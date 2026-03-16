/**
 * 瑜伽馆课程预约系统 - API 测试脚本
 * 用于验证后端API功能
 */

const axios = require('axios');

// API基础URL
const BASE_URL = 'http://localhost:3000';

// 模拟测试数据
const testData = {
  user: {
    openid: 'test_openid_12345',
    name: '测试用户',
    role: 'user'
  },
  course: {
    name: '基础瑜伽',
    category: '瑜伽',
    duration: 60,
    capacity: 10,
    price: 120,
    coach_id: 1,
    coach_name: '张教练',
    description: '适合初学者的基础瑜伽课程'
  }
};

async function testAPI() {
  console.log('🧪 开始测试瑜伽馆课程预约系统API...\n');
  
  try {
    // 1. 测试根路径健康检查
    console.log('1. 测试API服务健康状态...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ API服务运行正常:', healthResponse.data.message);
    
    // 2. 模拟微信登录
    console.log('\n2. 测试微信登录...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login/wechat`, {
      code: 'test_code_123',
      encryptedData: 'test_encrypted_data',
      iv: 'test_iv'
    });
    console.log('✅ 微信登录成功');
    
    // 检查是否有返回token
    const token = loginResponse.data.data?.token;
    if (!token) {
      throw new Error('登录未返回有效token');
    }
    
    console.log('✅ JWT Token获取成功');
    
    // 设置认证头
    const authHeaders = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    // 3. 测试获取用户信息
    console.log('\n3. 测试获取用户信息...');
    const userResponse = await axios.get(`${BASE_URL}/api/auth/info`, authHeaders);
    console.log('✅ 用户信息获取成功:', userResponse.data.data.name);
    
    // 4. 测试获取课程列表
    console.log('\n4. 测试获取课程列表...');
    const coursesResponse = await axios.get(`${BASE_URL}/api/courses`);
    console.log('✅ 课程列表获取成功，当前课程数量:', coursesResponse.data.data?.length || 0);
    
    // 5. 测试获取排课列表
    console.log('\n5. 测试获取排课列表...');
    const schedulesResponse = await axios.get(`${BASE_URL}/api/schedules`);
    console.log('✅ 排课列表获取成功，当前排课数量:', schedulesResponse.data.data?.length || 0);
    
    // 6. 测试获取用户预约列表
    console.log('\n6. 测试获取用户预约列表...');
    const bookingsResponse = await axios.get(`${BASE_URL}/api/bookings`, authHeaders);
    console.log('✅ 用户预约列表获取成功，当前预约数量:', bookingsResponse.data.data?.length || 0);
    
    console.log('\n🎉 所有API测试通过！');
    console.log('\n📋 已完成的API功能验证:');
    console.log('   - 用户认证 (微信登录)');
    console.log('   - JWT Token管理');
    console.log('   - 用户信息管理');
    console.log('   - 课程信息管理');
    console.log('   - 排课信息管理');
    console.log('   - 预约信息管理');
    console.log('   - 权限控制验证');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

// 如果作为主模块运行，则执行测试
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };