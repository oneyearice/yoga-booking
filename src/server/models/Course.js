/**
 * 课程模型
 * 处理课程相关的数据库操作
 */

const { pool } = require('../config/db');

class Course {
  /**
   * 获取课程列表（分页）
   */
  static async getList(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE status = "active" '; // 默认只返回激活的课程
    const params = [];
    
    if (filters.category) {
      whereClause += 'AND category = ? ';
      params.push(filters.category);
    }
    
    if (filters.coachId) {
      whereClause += 'AND coach_id = ? ';
      params.push(filters.coachId);
    }
    
    if (filters.search) {
      whereClause += 'AND name LIKE ? ';
      params.push(`%${filters.search}%`);
    }
    
    // 查询总数
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM courses ${whereClause}`,
      params
    );
    const total = countRows[0].total;
    
    // 查询列表
    const [rows] = await pool.execute(
      `SELECT * FROM courses ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
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
   * 根据ID获取课程详情
   */
  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM courses WHERE id = ? AND status = "active"',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * 创建课程
   */
  static async create(courseData) {
    const {
      name, category, duration, capacity, price,
      coach_id, coach_name, description, cover_image
    } = courseData;
    
    const [result] = await pool.execute(
      'INSERT INTO courses (name, category, duration, capacity, price, coach_id, coach_name, description, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, duration, capacity, price, coach_id, coach_name, description, cover_image]
    );
    
    return this.getById(result.insertId);
  }

  /**
   * 更新课程
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
      `UPDATE courses SET ${fields.join(', ')} WHERE id = ? AND status != 'deleted'`,
      values
    );
    
    return this.getById(id);
  }

  /**
   * 删除课程（软删除）
   */
  static async softDelete(id) {
    await pool.execute(
      'UPDATE courses SET status = "inactive" WHERE id = ?',
      [id]
    );
    return true;
  }

  /**
   * 根据教练ID获取课程列表
   */
  static async getByCoachId(coachId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const [countRows] = await pool.execute(
      'SELECT COUNT(*) as total FROM courses WHERE coach_id = ? AND status = "active"',
      [coachId]
    );
    const total = countRows[0].total;
    
    const [rows] = await pool.execute(
      'SELECT * FROM courses WHERE coach_id = ? AND status = "active" ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [coachId, limit, offset]
    );
    
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
   * 获取热门课程（按预约数量排序）
   */
  static async getPopularCourses(limit = 10) {
    // 通过连接预约表统计课程预约数量
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        COALESCE(b.booking_count, 0) as booking_count
      FROM courses c
      LEFT JOIN (
        SELECT 
          sc.course_id,
          COUNT(b.id) as booking_count
        FROM bookings b
        JOIN schedules sc ON b.schedule_id = sc.id
        WHERE b.booking_status = 'confirmed'
        GROUP BY sc.course_id
      ) b ON c.id = b.course_id
      WHERE c.status = 'active'
      ORDER BY b.booking_count DESC
      LIMIT ?
    `, [limit]);
    
    return rows;
  }
}

module.exports = Course;