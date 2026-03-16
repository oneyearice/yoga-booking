/**
 * 预约相关路由
 */

const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// 预约相关路由（需要认证）
router.get('/', bookingController.getUserBookings); // 获取用户预约列表
router.get('/:id', bookingController.getBookingById); // 获取预约详情
router.post('/', bookingController.createBooking); // 创建预约
router.put('/:id/cancel', bookingController.cancelBooking); // 取消预约
router.get('/today', bookingController.getUserTodayBookings); // 获取今日预约
router.get('/stats', bookingController.getUserBookingStats); // 获取预约统计
router.post('/waiting-list', bookingController.joinWaitingList); // 加入候补

// 教练/管理员专用路由
router.get('/schedule/:scheduleId', bookingController.getScheduleBookings); // 获取排课的预约列表
router.get('/course/:courseId/stats', bookingController.getCourseBookingStats); // 获取课程预约统计
router.put('/check-in/:bookingId', bookingController.checkInBooking); // 预约签到

module.exports = router;