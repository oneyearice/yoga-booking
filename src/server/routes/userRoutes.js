/**
 * 用户相关路由
 */

const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// 认证相关路由
const authRouter = express.Router();

authRouter.post('/login/wechat', authController.wechatLogin); // 微信登录
authRouter.post('/bind-phone', authController.bindPhone); // 绑定手机号
authRouter.get('/info', authController.getUserInfo); // 获取用户信息
authRouter.put('/info', authController.updateUserInfo); // 更新用户信息
authRouter.get('/credit-balance', authController.getCreditBalance); // 获取课时余额
authRouter.post('/refresh-token', authController.refreshToken); // 刷新令牌

// 主用户路由（需要认证）
const mainRouter = express.Router();

mainRouter.get('/', userController.getCurrentUser); // 获取当前用户信息
mainRouter.put('/', userController.updateCurrentUser); // 更新当前用户信息
mainRouter.get('/booking-stats', userController.getUserBookingStats); // 获取预约统计
mainRouter.get('/coaches', userController.getCoaches); // 获取教练列表
mainRouter.get('/coaches/:id', userController.getCoachById); // 获取教练详情
mainRouter.get('/credit-records/:userId', userController.getUserCreditRecords); // 获取课时记录

// 管理员专用路由
mainRouter.get('/admin/list', userController.getUsers); // 获取用户列表
mainRouter.get('/admin/:id', userController.getUserById); // 获取用户详情
mainRouter.put('/admin/:id', userController.updateUser); // 更新用户信息
mainRouter.put('/admin/:id/credit', userController.updateUserCredit); // 更新用户课时
mainRouter.delete('/admin/:id', userController.deleteUser); // 删除用户

module.exports = {
  auth: authRouter,
  main: mainRouter
};