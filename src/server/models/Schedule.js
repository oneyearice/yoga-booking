/**
 * 排课模型
 * 处理排课相关的数据库操作
 */

const { pool } = require('../config/db');

class Schedule {
  /**
   * 获取排课列表（分页）
   */
  static async getList(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE s.status != "deleted" '; // 排除已删除的排课
    const params = [];
    
    if (filters.date) {
      whereClause += 'AND s.date = ? ';
      params.push(filters.date);
    }
    
    if (filters.courseId) {
      whereClause += 'AND s.course_id = ? ';
      params.push(filters.courseId);
    }
    
    if (filters.coachId) {
      whereClause += 'AND s.coach_id = ? ';
      params.push(filters.coachId);
    }
    
    if (filters.status) {
      whereClause += 'AND s.status = ? ';
      params.push(filters.status);
    }
    
    // 查询总数
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM schedules s ${whereClause}`,
      params
    );
    const total = countRows[0].total;
    
    // 查询列表，同时获取课程信息
    const [rows] = await pool.execute(`
      SELECT 
        s.*,
        c.name as course_name,
        c.category,
        c.duration,
        c.price,
        c.coach_name,
        (s.max_capacity - s.booked_count) as remaining_spots
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      ${whereClause}
      ORDER BY s.date ASC, s.start_time ASC
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
   * 根据ID获取排课详情
   */
  static async getById(id) {
    const [rows] = await pool.execute(`
      SELECT 
        s.*,
        c.name as course_name,
        c.category,
        c.duration,
        c.price,
        c.coach_name,
        (s.max_capacity - s.booked_count) as remaining_spots
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE s.id = ? AND s.status != 'deleted'
    `, [id]);
    return rows[0] || null;
  }

  /**
   * 创建排课
   */
  static async create(scheduleData) {
    const {
      course_id, coach_id, date, start_time, end_time,
      max_capacity, location
    } = scheduleData;
    
    // 检查时间冲突
    const [conflictRows] = await pool.execute(`
      SELECT id FROM schedules 
      WHERE coach_id = ? 
      AND date = ? 
      AND status != 'cancelled'
      AND (
        (start_time < ? AND end_time > ?) OR
        (start_time < ? AND end_time > ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `, [
      coach_id, date, end_time, start_time, // 检查时间重叠
      start_time, end_time, start_time, end_time // 检查完全包含
    ]);
    
    if (conflictRows.length > 0) {
      throw new Error('时间冲突：教练在该时间段已有排课');
    }
    
    const [result] = await pool.execute(`
      INSERT INTO schedules (course_id, coach_id, date, start_time, end_time, max_capacity, location)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [course_id, coach_id, date, start_time, end_time, max_capacity, location]);
    
    return this.getById(result.insertId);
  }

  /**
   * 更新排课
   */
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    });
    
    values.push(id);
    
    await pool.execute(
      `UPDATE schedules SET ${fields.join(', ')} WHERE id = ? AND status != 'deleted'`,
      values
    );
    
    return this.getById(id);
  }

  /**
   * 取消排课
   */
  static async cancel(id) {
    await pool.execute(
      'UPDATE schedules SET status = "cancelled" WHERE id = ?',
      [id]
    );
    return true;
  }

  /**
   * 删除排课（物理删除）
   */
  static async delete(id) {
    await pool.execute(
      'UPDATE schedules SET status = "deleted" WHERE id = ?',
      [id]
    );
    return true;
  }

  /**
   * 根据日期获取教练的排课
   */
  static async getByCoachAndDate(coachId, date) {
    const [rows] = await pool.execute(`
      SELECT 
        s.*,
        c.name as course_name,
        c.category,
        (s.max_capacity - s.booked_count) as remaining_spots
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE s.coach_id = ? AND s.date = ? AND s.status IN ('active', 'full')
      ORDER BY s.start_time ASC
    `, [coachId, date]);
    
    return rows;
  }

  /**
   * 获取某日期的所有排课
   */
  static async getByDate(date, filters = {}) {
    let whereClause = 'WHERE s.date = ? AND s.status != "deleted" ';
    const params = [date];
    
    if (filters.courseCategory) {
      whereClause += 'AND c.category = ? ';
      params.push(filters.courseCategory);
    }
    
    if (filters.coachId) {
      whereClause += 'AND s.coach_id = ? ';
      params.push(filters.coachId);
    }
    
    const [rows] = await pool.execute(`
      SELECT 
        s.*,
        c.name as course_name,
        c.category,
        c.duration,
        c.price,
        c.coach_name,
        (s.max_capacity - s.booked_count) as remaining_spots
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      ${whereClause}
      ORDER BY s.start_time ASC
    `, params);
    
    return rows;
  }

  /**
   * 获取教练的课表（按日期范围）
   */
  static async getCoachSchedule(coachId, startDate, endDate) {
    const [rows] = await pool.execute(`
      SELECT 
        s.*,
        c.name as course_name,
        c.category,
        (s.max_capacity - s.booked_count) as remaining_spots
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE s.coach_id = ? 
      AND s.date BETWEEN ? AND ?
      AND s.status != 'deleted'
      ORDER BY s.date ASC, s.start_time ASC
    `, [coachId, startDate, endDate]);
    
    // 按日期分组
    const scheduleByDate = {};
    rows.forEach(row => {
      const date = row.date;
      if (!scheduleByDate[date]) {
        scheduleByDate[date] = [];
      }
      scheduleByDate[date].push(row);
    });
    
    return scheduleByDate;
  }

  /**
   * 更新已预约人数
   */
  static async updateBookedCount(scheduleId, increment = 1) {
    await pool.execute(`
      UPDATE schedules 
      SET booked_count = GREATEST(0, booked_count + ?),
          status = CASE 
            WHEN (booked_count + ?) >= max_capacity THEN 'full'
            ELSE 'active'
          END
      WHERE id = ?
    `, [increment, increment, scheduleId]);
    
    return this.getById(scheduleId);
  }
}

module.exports = Schedule;