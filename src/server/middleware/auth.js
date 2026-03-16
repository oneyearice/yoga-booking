/**
 * 认证中间件
 * 验证JWT令牌
 */

const jwt = require('jsonwebtoken');

// JWT密钥（实际项目中应从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET || 'yoga_booking_secret_key';

const authMiddleware = (req, res, next) => {
  try {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    // 检查令牌格式
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: '令牌格式错误'
      });
    }

    const token = tokenParts[1];

    // 验证令牌
    const decoded = jwt.verify(token, JWT_SECRET);

    // 将用户信息附加到请求对象
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '认证令牌已过期'
      });
    }

    return res.status(500).json({
      success: false,
      message: '认证过程中发生错误'
    });
  }
};

module.exports = authMiddleware;