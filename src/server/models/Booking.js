/**
 * 预约模型
 * 处理预约相关的数据库操作
 */

const { pool } = require('../config/db');
const Schedule = require('./Schedule');

class Booking {
  /**
   * 获取用户预约列表（分页）
   */
  static async getListByUser(userId, page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE b.user_id = ? ';
    const params = [userId];
    
    if (filters.status) {
      whereClause += 'AND b.booking_status = ? ';
      params.push(filters.status);
    }
    
    if (filters.dateFrom) {
      whereClause += 'AND s.date >= ? ';
      params.push(filters.dateFrom);
    }
    
    if (filters.dateTo) {
      whereClause += 'AND s.date <= ? ';
      params.push(filters.dateTo);
    }
    
    // 查询总数
    const [countRows] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM bookings b
      LEFT JOIN schedules s ON b.schedule_id = s.id
      ${whereClause}
    `, params);
    const total = countRows[0].total;
    
    // 查询列表，包含课程和排课信息
    const [rows] = await pool.execute(`
      SELECT 
        b.*,
        s.date as schedule_date,
        s.start_time,
        s.end_time,
        s.location,
        s.status as schedule_status,
        c.name as course_name,
        c.category,
        c.coach_name,
        c.duration,
        c.price
      FROM bookings b
      LEFT JOIN schedules s ON b.schedule_id = s.id
      LEFT JOIN courses c ON s.course_id = c.id
      ${whereClause}
      ORDER BY s.date DESC, s.start_time DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);
    
    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * 获取排课的预约列表
   */
  static async getListBySchedule(scheduleId) {
    const [rows] = await pool.execute(`
      SELECT 
        b.*,
        u.name as user_name,
        u.phone as user_phone
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.schedule_id = ? AND b.booking_status IN ('confirmed', 'pending')
      ORDER BY b.created_at ASC
    `, [scheduleId]);
    
    return rows;
  }

  /**
   * 根据ID获取预约详情
   */
  static async getById(id) {
    const [rows] = await pool.execute(`
      SELECT 
        b.*,
        s.date as schedule_date,
        s.start_time,
        s.end_time,
        s.location,
        s.status as schedule_status,
        c.name as course_name,
        c.category,
        c.coach_name,
        c.duration,
        c.price,
        u.name as user_name,
        u.phone as user_phone
      FROM bookings b
      LEFT JOIN schedules s ON b.schedule_id = s.id
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.id = ?
    `, [id]);
    return rows[0] || null;
  }

  /**
   * 创建预约
   */
  static async create(bookingData) {
    const { user_id, schedule_id, people_count = 1 } = bookingData;
    
    // 检查用户是否存在
    const [userRows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [user_id]
    );
    if (!userRows[0]) {
      throw new Error('用户不存在');
    }
    
    // 检查排课是否存在且有效
    const schedule = await Schedule.getById(schedule_id);
    if (!schedule) {
      throw new Error('排课不存在');
    }
    
    if (schedule.status === 'cancelled') {
      throw new Error('排课已取消');
    }
    
    if (schedule.status === 'full') {
      throw new Error('预约人数已满，候补');
    }
    
    // 检查用户是否有足够课时
    if (userRows[0].credit_balance < 1) {
      throw new Error('课时不足');
    }
    
    // 检查时间冲突：用户在同一时间段是否已有预约
    const [conflictRows] = await pool.execute(`
      SELECT b.id 
      FROM bookings b
      JOIN schedules s ON b.schedule_id = s.id
      WHERE b.user_id = ? 
      AND s.date = ?
      AND b.booking_status IN ('confirmed', 'pending')
      AND (
        (s.start_time < ? AND s.end_time > ?) OR
        (s.start_time < ? AND s.end_time > ?) OR
        (s.start_time >= ? AND s.end_time <= ?)
      )
    `, [
      user_id, schedule.date, // 同一天
      schedule.end_time, schedule.start_time, // 检查时间重叠
      schedule.start_time, schedule.end_time, // 检查时间重叠
      schedule.start_time, schedule.end_time // 检查完全包含
    ]);
    
    if (conflictRows.length > 0) {
      throw new Error('时间冲突：您在同一时间段已有预约');
    }
    
    // 开始事务
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      // 创建预约记录
      const [result] = await conn.execute(`
        INSERT INTO bookings (user_id, schedule_id, course_id, booking_date, booking_time, people_count)
        VALUES (?, ?, ?, ?, NOW(), ?)
      `, [user_id, schedule_id, schedule.course_id, schedule.date, people_count]);
      
      const bookingId = result.insertId;
      
      // 更新排课的已预约人数
      await Schedule.updateBookedCount(schedule_id, 1);
      
      // 扣除用户课时
      const newBalance = userRows[0].credit_balance - 1;
      await conn.execute(
        'UPDATE users SET credit_balance = ? WHERE id = ?',
        [newBalance, user_id]
      );
      
      // 记录课时变动
      await conn.execute(`
        INSERT INTO credit_records (user_id, type, amount, balance_after, reason, related_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [user_id, 'deduction', -1, newBalance, '预约课程', bookingId]);
      
      await conn.commit();
      
      // 返回完整的预约信息
      return this.getById(bookingId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * 取消预约
   */
  static async cancel(id, userId, cancelReason = '用户取消') {
    // 获取预约信息
    const booking = await this.getById(id);
    if (!booking) {
      throw new Error('预约不存在');
    }
    
    // 检查是否是当前用户
    if (booking.user_id != userId) {
      throw new Error('无权限取消他人预约');
    }
    
    // 检查预约状态
    if (booking.booking_status === 'cancelled') {
      throw new Error('预约已取消');
    }
    
    // 检查取消时间：提前3小时免费取消
    const bookingTime = new Date(booking.schedule_date + ' ' + booking.start_time);
    const currentTime = new Date();
    const timeDiff = bookingTime.getTime() - currentTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // 如果在3小时内取消，需要额外处理（这里简化为统一处理）
    if (hoursDiff < 3) {
      // 根据业务规则，可能需要扣除课时或与教练协商
      // 这里暂时按业务规则：3小时内取消需与教练协商，但仍然允许取消
    }
    
    // 开始事务
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      // 更新预约状态
      await conn.execute(`
        UPDATE bookings SET booking_status = 'cancelled', cancel_time = NOW(), cancel_reason = ?
        WHERE id = ?
      `, [cancelReason, id]);
      
      // 更新排课的已预约人数
      await Schedule.updateBookedCount(booking.schedule_id, -1);
      
      // 退还用户课时（如果是在规定时间内取消）
      if (hoursDiff >= 3) {
        // 3小时前取消，退还课时
        await conn.execute(`
          UPDATE users SET credit_balance = credit_balance + 1 WHERE id = ?
        `, [userId]);
        
        // 记录课时变动
        await conn.execute(`
          INSERT INTO credit_records (user_id, type, amount, balance_after, reason, related_id)
          VALUES (?, ?, ?, (SELECT credit_balance FROM users WHERE id = ?) + 1, ?, ?)
        `, [userId, 'refund', 1, userId, '取消预约退款', id]);
      }
      
      await conn.commit();
      
      return this.getById(id);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * 获取用户当天的预约
   */
  static async getUserTodayBookings(userId) {
    const today = new Date().toISOString().split('T')[0];
    
    const [rows] = await pool.execute(`
      SELECT 
        b.*,
        s.date as schedule_date,
        s.start_time,
        s.end_time,
        s.location,
        c.name as course_name,
        c.category,
        c.coach_name
      FROM bookings b
      LEFT JOIN schedules s ON b.schedule_id = s.id
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE b.user_id = ? 
      AND s.date = ?
      AND b.booking_status = 'confirmed'
      ORDER BY s.start_time ASC
    `, [userId, today]);
    
    return rows;
  }

  /**
   * 获取课程的预约统计
   */
  static async getCourseBookingStats(courseId) {
    const [rows] = await pool.execute(`
      SELECT 
        c.name as course_name,
        COUNT(b.id) as total_bookings,
        SUM(CASE WHEN b.booking_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        AVG(c.price) as avg_price
      FROM courses c
      LEFT JOIN schedules s ON c.id = s.course_id
      LEFT JOIN bookings b ON s.id = b.schedule_id
      WHERE c.id = ?
      GROUP BY c.id, c.name
    `, [courseId]);
    
    return rows[0] || null;
  }

  /**
   * 获取用户的预约统计
   */
  static async getUserBookingStats(userId) {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN booking_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_count,
        SUM(CASE WHEN booking_status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN booking_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count
      FROM bookings
      WHERE user_id = ?
    `, [userId]);
    
    return rows[0] || {
      total_bookings: 0,
      confirmed_count: 0,
      completed_count: 0,
      cancelled_count: 0
    };
  }
}

module.exports = Booking;