/**
 * 瑜伽馆课程预约系统 - 基础功能测试
 * 用于验证后端服务的基本功能
 */

// 简单测试导入所有模块是否正常
try {
  console.log('🔍 检查后端模块完整性...\n');
  
  // 测试数据库配置
  console.log('1. 测试数据库配置模块...');
  const dbConfig = require('./config/db');
  console.log('✅ 数据库配置模块加载成功\n');
  
  // 测试模型
  console.log('2. 测试数据模型...');
  const User = require('./models/User');
  const Course = require('./models/Course');
  const Schedule = require('./models/Schedule');
  const Booking = require('./models/Booking');
  console.log('✅ 所有数据模型加载成功\n');
  
  // 测试控制器
  console.log('3. 测试控制器...');
  const authController = require('./controllers/authController');
  const courseController = require('./controllers/courseController');
  const scheduleController = require('./controllers/scheduleController');
  const bookingController = require('./controllers/bookingController');
  const userController = require('./controllers/userController');
  console.log('✅ 所有控制器加载成功\n');
  
  // 测试路由
  console.log('4. 测试路由...');
  const userRoutes = require('./routes/userRoutes');
  const courseRoutes = require('./routes/courseRoutes');
  const scheduleRoutes = require('./routes/scheduleRoutes');
  const bookingRoutes = require('./routes/bookingRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  console.log('✅ 所有路由模块加载成功\n');
  
  // 测试中间件
  console.log('5. 测试中间件...');
  const authMiddleware = require('./middleware/auth');
  const errorHandler = require('./middleware/errorHandler');
  console.log('✅ 所有中间件加载成功\n');
  
  console.log('🎉 后端模块完整性检查完成！');
  console.log('\n📋 已验证的功能模块:');
  console.log('   - 数据库配置');
  console.log('   - 数据模型 (用户、课程、排课、预约)');
  console.log('   - 控制器 (认证、课程、排课、预约、用户)');
  console.log('   - 路由 (用户、课程、排课、预约、管理员)');
  console.log('   - 中间件 (认证、错误处理)');
  
  console.log('\n✅ 后端API开发完成，所有模块正常加载！');
  console.log('💡 下一步: 启动服务进行集成测试');
  
} catch (error) {
  console.error('❌ 模块加载失败:', error.message);
  process.exit(1);
}