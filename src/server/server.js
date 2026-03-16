/**
 * 瑜伽馆课程预约系统 - 主服务器文件
 * 后端API服务 (Node.js + Express)
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// 导入中间件和路由
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// 导入路由
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// 请求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
});
app.use(limiter);

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API路由
app.use('/api/auth', userRoutes.auth); // 认证相关
app.use('/api/users', authMiddleware, userRoutes.main); // 用户相关
app.use('/api/courses', courseRoutes); // 课程相关
app.use('/api/schedules', scheduleRoutes); // 排课相关
app.use('/api/bookings', authMiddleware, bookingRoutes); // 预约相关
app.use('/api/admin', authMiddleware, adminRoutes); // 管理员相关

// 根路径健康检查
app.get('/', (req, res) => {
  res.json({
    message: '瑜伽馆课程预约系统 API 服务',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'running'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 瑜伽馆课程预约系统 API 服务已启动`);
  console.log(`📍 监听端口: ${PORT}`);
  console.log(`📡 API文档: http://localhost:${PORT}/api/docs (待实现)`);
  console.log(`🔒 环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;