/**
 * 认证控制器
 * 处理用户认证相关的API
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// JWT密钥（实际项目中应从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET || 'yoga_booking_secret_key';

class AuthController {
  /**
   * 微信登录
   * 模拟微信登录流程，实际项目中需要调用微信API
   */
  static async wechatLogin(req, res, next) {
    try {
      const { code, encryptedData, iv } = req.body;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: '缺少登录凭证'
        });
      }
      
      // 这里应该调用微信API获取用户openid
      // 模拟微信API调用结果
      const mockWechatResponse = {
        openid: `mock_openid_${Math.random().toString(36).substr(2, 9)}`,
        unionid: `mock_unionid_${Math.random().toString(36).substr(2, 9)}`,
        nickname: '模拟用户',
        avatar: 'https://via.placeholder.com/150'
      };
      
      // 尝试查找用户
      let user = await User.findByOpenId(mockWechatResponse.openid);
      
      if (!user) {
        // 用户不存在，创建新用户
        user = await User.create({
          openid: mockWechatResponse.openid,
          name: mockWechatResponse.nickname,
          avatar: mockWechatResponse.avatar,
          role: 'user'
        });
      } else {
        // 更新用户信息（如果需要）
        await User.update(user.id, {
          name: mockWechatResponse.nickname,
          avatar: mockWechatResponse.avatar
        });
      }
      
      // 生成JWT令牌
      const token = jwt.sign(
        { 
          userId: user.id, 
          openid: user.openid, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        success: true,
        message: '登录成功',
        data: {
          user: {
            id: user.id,
            openid: user.openid,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            creditBalance: user.credit_balance
          },
          token: token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 手机号绑定
   */
  static async bindPhone(req, res, next) {
    try {
      const { userId } = req.user; // 从JWT解析出的用户信息
      const { phone, verificationCode } = req.body;
      
      if (!phone || !verificationCode) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数'
        });
      }
      
      // 这里应该验证验证码（实际项目中需要短信验证服务）
      // 模拟验证通过
      const isValidCode = verificationCode === '123456'; // 仅用于演示
      
      if (!isValidCode) {
        return res.status(400).json({
          success: false,
          message: '验证码错误'
        });
      }
      
      // 检查手机号是否已被其他用户绑定
      const existingUser = await User.findByPhone(phone);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: '手机号已被其他用户绑定'
        });
      }
      
      // 更新用户手机号
      const updatedUser = await User.update(userId, { phone });
      
      res.json({
        success: true,
        message: '手机号绑定成功',
        data: {
          user: {
            id: updatedUser.id,
            phone: updatedUser.phone,
            name: updatedUser.name,
            role: updatedUser.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户信息
   */
  static async getUserInfo(req, res, next) {
    try {
      const { userId } = req.user;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      
      res.json({
        success: true,
        data: {
          id: user.id,
          openid: user.openid,
          phone: user.phone,
          name: user.name,
          avatar: user.avatar,
          creditBalance: user.credit_balance,
          role: user.role,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新用户信息
   */
  static async updateUserInfo(req, res, next) {
    try {
      const { userId } = req.user;
      const { name, avatar } = req.body;
      
      const updateData = {};
      if (name) updateData.name = name;
      if (avatar) updateData.avatar = avatar;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: '没有要更新的数据'
        });
      }
      
      const updatedUser = await User.update(userId, updateData);
      
      res.json({
        success: true,
        message: '用户信息更新成功',
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          updatedAt: updatedUser.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取课时余额
   */
  static async getCreditBalance(req, res, next) {
    try {
      const { userId } = req.user;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      
      res.json({
        success: true,
        data: {
          creditBalance: user.credit_balance
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 刷新令牌
   */
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: '缺少刷新令牌'
        });
      }
      
      // 实际项目中需要维护刷新令牌
      // 这里简化处理，直接生成新令牌
      const { userId, openid, role } = req.user;
      
      const newToken = jwt.sign(
        { userId, openid, role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        success: true,
        data: {
          token: newToken
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;