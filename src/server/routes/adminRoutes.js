/**
 * 管理员相关路由
 */

const express = require('express');
const courseController = require('../controllers/courseController');
const scheduleController = require('../controllers/scheduleController');
const bookingController = require('../controllers/bookingController');
const userController = require('../controllers/userController');

const router = express.Router();

// 课程管理
router.get('/courses', courseController.getCourses); // 获取课程列表
router.post('/courses', courseController.createCourse); // 创建课程
router.put('/courses/:id', courseController.updateCourse); // 更新课程
router.delete('/courses/:id', courseController.deleteCourse); // 删除课程

// 排课管理
router.get('/schedules', scheduleController.getSchedules); // 获取排课列表
router.post('/schedules', scheduleController.createSchedule); // 创建排课
router.put('/schedules/:id', scheduleController.updateSchedule); // 更新排课
router.put('/schedules/:id/cancel', scheduleController.cancelSchedule); // 取消排课
router.delete('/schedules/:id', scheduleController.deleteSchedule); // 删除排课
router.post('/schedules/batch', scheduleController.batchCreateSchedules); // 批量创建排课

// 用户管理
router.get('/users', userController.getUsers); // 获取用户列表
router.get('/users/:id', userController.getUserById); // 获取用户详情
router.put('/users/:id', userController.updateUser); // 更新用户信息
router.put('/users/:id/credit', userController.updateUserCredit); // 更新用户课时
router.delete('/users/:id', userController.deleteUser); // 删除用户

// 预约管理
router.get('/bookings', bookingController.getUserBookings); // 获取预约列表
router.get('/bookings/:id', bookingController.getBookingById); // 获取预约详情
router.put('/bookings/:id/cancel', bookingController.cancelBooking); // 取消预约
router.get('/bookings/schedule/:scheduleId', bookingController.getScheduleBookings); // 获取排课预约
router.get('/bookings/course/:courseId/stats', bookingController.getCourseBookingStats); // 课程预约统计
router.put('/bookings/check-in/:bookingId', bookingController.checkInBooking); // 预约签到

// 数据统计
router.get('/stats/overall', (req, res) => {
  // 获取总体统计数据
  res.json({
    success: true,
    data: {
      total_users: 0,
      total_courses: 0,
      total_schedules: 0,
      total_bookings: 0,
      today_bookings: 0,
      monthly_revenue: 0
    }
  });
});

router.get('/stats/course-popularity', (req, res) => {
  // 获取课程受欢迎程度统计
  res.json({
    success: true,
    data: []
  });
});

router.get('/stats/coach-performance', (req, res) => {
  // 获取教练表现统计
  res.json({
    success: true,
    data: []
  });
});

module.exports = router;