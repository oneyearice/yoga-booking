/**
 * 用户控制器
 * 处理用户相关的API
 */

const User = require('../models/User');

class UserController {
  /**
   * 获取用户列表（管理员权限）
   */
  static async getUsers(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { 
        page = 1, 
        limit = 10, 
        role: filterRole, 
        search 
      } = req.query;

      const filters = {};
      if (filterRole) filters.role = filterRole;
      if (search) filters.search = search;

      const result = await User.getList(page, limit, filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户详情（管理员权限）
   */
  static async getUserById(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { id } = req.params;
      
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 不返回敏感信息
      const { password, ...safeUser } = user;
      res.json({
        success: true,
        data: safeUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新用户信息（管理员权限）
   */
  static async updateUser(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { id } = req.params;
      const updateData = {};

      // 只更新允许的字段
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.phone) updateData.phone = req.body.phone;
      if (req.body.role && ['user', 'coach', 'admin'].includes(req.body.role)) {
        updateData.role = req.body.role;
      }
      if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;

      const user = await User.update(parseInt(id), updateData);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        message: '用户信息更新成功',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新用户课时（管理员权限）
   */
  static async updateUserCredit(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { id } = req.params;
      const { credit_balance, reason = '管理员调整' } = req.body;

      if (credit_balance === undefined) {
        return res.status(400).json({
          success: false,
          message: '缺少课时余额参数'
        });
      }

      if (typeof credit_balance !== 'number' || credit_balance < 0) {
        return res.status(400).json({
          success: false,
          message: '课时余额必须是非负数'
        });
      }

      const user = await User.updateCreditBalance(parseInt(id), parseInt(credit_balance), reason);

      res.json({
        success: true,
        message: '用户课时更新成功',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除用户（管理员权限）
   */
  static async deleteUser(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { id } = req.params;
      const success = await User.delete(parseInt(id));

      if (!success) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        message: '用户删除成功'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取当前用户信息（本人权限）
   */
  static async getCurrentUser(req, res, next) {
    try {
      const { userId } = req.user;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 不返回敏感信息
      const { password, ...safeUser } = user;
      res.json({
        success: true,
        data: safeUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新当前用户信息（本人权限）
   */
  static async updateCurrentUser(req, res, next) {
    try {
      const { userId } = req.user;
      const updateData = {};

      // 只允许更新部分字段
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;

      const user = await User.update(userId, updateData);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        message: '个人信息更新成功',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户预约统计
   */
  static async getUserBookingStats(req, res, next) {
    try {
      const { userId } = req.user;
      
      const stats = await require('../models/Booking').getUserBookingStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取教练列表
   */
  static async getCoaches(req, res, next) {
    try {
      const { page = 1, limit = 10, search } = req.query;

      const filters = { role: 'coach' };
      if (search) filters.search = search;

      const result = await User.getList(page, limit, filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取教练详情
   */
  static async getCoachById(req, res, next) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      if (user.role !== 'coach') {
        return res.status(404).json({
          success: false,
          message: '该用户不是教练'
        });
      }

      // 不返回敏感信息
      const { password, ...safeUser } = user;
      res.json({
        success: true,
        data: safeUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户课时记录
   */
  static async getUserCreditRecords(req, res, next) {
    try {
      const { userId: currentUserId } = req.user;
      const { userId: targetUserId } = req.params;
      
      // 权限检查：只能查看自己的记录，管理员可以查看所有
      if (currentUserId != targetUserId) {
        const currentUser = await User.findById(currentUserId);
        if (currentUser.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: '无权限操作'
          });
        }
      }

      const { page = 1, limit = 10, type } = req.query;

      let whereClause = 'WHERE user_id = ? ';
      const params = [targetUserId];

      if (type) {
        whereClause += 'AND type = ? ';
        params.push(type);
      }

      // 查询总数
      const [countRows] = await require('../models/db').pool.execute(
        `SELECT COUNT(*) as total FROM credit_records ${whereClause}`,
        params
      );
      const total = countRows[0].total;

      // 查询列表
      const offset = (page - 1) * limit;
      const [rows] = await require('../models/db').pool.execute(`
        SELECT * FROM credit_records ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset]);

      res.json({
        success: true,
        data: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;