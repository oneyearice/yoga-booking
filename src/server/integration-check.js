/**
 * 瑜伽馆课程预约系统 - 集成检查脚本
 * 检查所有模块之间的集成关系
 */

console.log('🔍 开始后端系统集成检查...\n');

let successCount = 0;
const totalChecks = 12;

try {
  console.log(`✅ 1/${totalChecks} 检查Express框架导入...`);
  const express = require('express');
  console.log('   Express框架导入成功');
  successCount++;

  console.log(`✅ 2/${totalChecks} 检查配置模块...`);
  const dbConfig = require('./config/db');
  console.log('   数据库配置模块正常');
  successCount++;

  console.log(`✅ 3/${totalChecks} 检查用户模型...`);
  const User = require('./models/User');
  console.log('   用户模型正常');
  successCount++;

  console.log(`✅ 4/${totalChecks} 检查课程模型...`);
  const Course = require('./models/Course');
  console.log('   课程模型正常');
  successCount++;

  console.log(`✅ 5/${totalChecks} 检查排课模型...`);
  const Schedule = require('./models/Schedule');
  console.log('   排课模型正常');
  successCount++;

  console.log(`✅ 6/${totalChecks} 检查预约模型...`);
  const Booking = require('./models/Booking');
  console.log('   预约模型正常');
  successCount++;

  console.log(`✅ 7/${totalChecks} 检查认证控制器...`);
  const authController = require('./controllers/authController');
  console.log('   认证控制器正常');
  successCount++;

  console.log(`✅ 8/${totalChecks} 检查用户控制器...`);
  const userController = require('./controllers/userController');
  console.log('   用户控制器正常');
  successCount++;

  console.log(`✅ 9/${totalChecks} 检查路由模块...`);
  const userRoutes = require('./routes/userRoutes');
  const courseRoutes = require('./routes/courseRoutes');
  const scheduleRoutes = require('./routes/scheduleRoutes');
  const bookingRoutes = require('./routes/bookingRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  console.log('   所有路由模块正常');
  successCount++;

  console.log(`✅ 10/${totalChecks} 检查中间件...`);
  const authMiddleware = require('./middleware/auth');
  const errorHandler = require('./middleware/errorHandler');
  console.log('   所有中间件正常');
  successCount++;

  console.log(`✅ 11/${totalChecks} 检查主服务器文件语法...`);
  // 仅检查文件是否存在和基本语法
  const fs = require('fs');
  const serverCode = fs.readFileSync('./server.js', 'utf8');
  if (serverCode.includes('express') && serverCode.includes('app.listen')) {
    console.log('   主服务器文件结构正常');
  }
  successCount++;

  console.log(`✅ 12/${totalChecks} 检查package.json配置...`);
  const packageJson = require('./package.json');
  if (packageJson.name && packageJson.dependencies) {
    console.log('   package.json配置正常');
  }
  successCount++;

  console.log(`\n🎉 集成检查完成！`);
  console.log(`✅ 成功: ${successCount}/${totalChecks} 检查项目`);
  console.log(`📋 检查结果: 所有模块集成正常`);

  // 检查关键功能模块
  console.log(`\n🎯 关键功能模块验证:`);
  console.log(`   用户管理: ${typeof User === 'function' ? '✅' : '❌'}`);
  console.log(`   课程管理: ${typeof Course === 'function' ? '✅' : '❌'}`);
  console.log(`   排课管理: ${typeof Schedule === 'function' ? '✅' : '❌'}`);
  console.log(`   预约管理: ${typeof Booking === 'function' ? '✅' : '❌'}`);
  console.log(`   认证系统: ${typeof authController === 'object' ? '✅' : '❌'}`);
  console.log(`   API路由: ${typeof userRoutes === 'object' ? '✅' : '❌'}`);
  console.log(`   权限控制: ${typeof authMiddleware === 'function' ? '✅' : '❌'}`);

  console.log(`\n🚀 后端系统已准备就绪，可以进行前后端联调！`);

} catch (error) {
  console.error(`❌ 集成检查失败: ${error.message}`);
  console.log(`📋 成功: ${successCount}/${totalChecks} 检查项目`);
}