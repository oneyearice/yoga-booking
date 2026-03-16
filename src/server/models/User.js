/**
 * 用户模型
 * 处理用户相关的数据库操作
 */

const { pool } = require('../config/db');

class User {
  /**
   * 根据微信openid查找用户
   */
  static async findByOpenId(openid) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE openid = ?',
      [openid]
    );
    return rows[0] || null;
  }

  /**
   * 根据ID查找用户
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * 创建新用户
   */
  static async create(userData) {
    const { openid, phone, name, avatar, role = 'user' } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (openid, phone, name, avatar, role) VALUES (?, ?, ?, ?, ?)',
      [openid, phone, name, avatar, role]
    );
    return this.findById(result.insertId);
  }

  /**
   * 更新用户信息
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
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  /**
   * 更新用户课时余额
   */
  static async updateCreditBalance(userId, newBalance, reason = '课时变动') {
    const [user] = await pool.execute(
      'SELECT credit_balance FROM users WHERE id = ?',
      [userId]
    );
    
    if (!user[0]) {
      throw new Error('用户不存在');
    }
    
    const oldBalance = user[0].credit_balance;
    const changeAmount = newBalance - oldBalance;
    
    // 更新用户余额
    await pool.execute(
      'UPDATE users SET credit_balance = ? WHERE id = ?',
      [newBalance, userId]
    );
    
    // 记录课时变动
    await pool.execute(
      'INSERT INTO credit_records (user_id, type, amount, balance_after, reason) VALUES (?, ?, ?, ?, ?)',
      [userId, changeAmount >= 0 ? 'adjustment' : 'adjustment', changeAmount, newBalance, reason]
    );
    
    return this.findById(userId);
  }

  /**
   * 根据手机号查找用户
   */
  static async findByPhone(phone) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );
    return rows[0] || null;
  }

  /**
   * 获取用户列表（分页）
   */
  static async getList(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = '';
    const params = [];
    
    if (filters.role) {
      whereClause += 'WHERE role = ? ';
      params.push(filters.role);
    }
    
    if (filters.search) {
      whereClause += whereClause ? 'AND ' : 'WHERE ';
      whereClause += '(name LIKE ? OR phone LIKE ?) ';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    // 查询总数
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const total = countRows[0].total;
    
    // 查询列表
    const [rows] = await pool.execute(
      `SELECT * FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
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
   * 删除用户（软删除或实际删除）
   */
  static async delete(id) {
    // 这里可以实现软删除，暂时使用实际删除
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }
}

module.exports = User;