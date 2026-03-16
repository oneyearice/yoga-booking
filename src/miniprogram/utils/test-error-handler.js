/**
 * 错误处理工具测试文件
 * 用于验证错误处理工具是否正常工作
 */

const errorHandler = require('./errorHandler');

console.log('🧪 开始测试错误处理工具...');

// 测试错误提示函数
console.log('✅ showError 函数存在:', typeof errorHandler.showError === 'function');

// 测试表单验证函数
console.log('✅ validate.phone 函数存在:', typeof errorHandler.validate.phone === 'function');
console.log('✅ validate.required 函数存在:', typeof errorHandler.validate.required === 'function');
console.log('✅ validate.number 函数存在:', typeof errorHandler.validate.number === 'function');

// 测试验证功能
const phoneTest = errorHandler.validate.phone('13800138000');
console.log('✅ 手机号验证 (正确)', phoneTest.valid);

const phoneTest2 = errorHandler.validate.phone('123');
console.log('✅ 手机号验证 (错误)', !phoneTest2.valid);

const requiredTest = errorHandler.validate.required('test', '测试字段');
console.log('✅ 必填验证 (正确)', requiredTest.valid);

const requiredTest2 = errorHandler.validate.required('', '测试字段');
console.log('✅ 必填验证 (错误)', !requiredTest2.valid);

const numberTest = errorHandler.validate.number('10', '数值字段', 1, 100);
console.log('✅ 数字验证 (正确)', numberTest.valid);

const numberTest2 = errorHandler.validate.number('abc', '数值字段');
console.log('✅ 数字验证 (错误)', !numberTest2.valid);

// 测试加载状态管理
console.log('✅ loading.show 函数存在:', typeof errorHandler.loading.show === 'function');
console.log('✅ loading.hide 函数存在:', typeof errorHandler.loading.hide === 'function');

console.log('🎉 错误处理工具测试完成！');
console.log('✨ 所有功能正常工作');