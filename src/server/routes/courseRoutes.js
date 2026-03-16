/**
 * 课程相关路由
 */

const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// 课程相关路由（无需认证）
router.get('/', courseController.getCourses); // 获取课程列表
router.get('/:id', courseController.getCourseById); // 获取课程详情
router.get('/coach/:coachId', courseController.getCoursesByCoach); // 获取教练的课程列表
router.get('/popular', courseController.getPopularCourses); // 获取热门课程

// 管理员专用路由（需要认证）
const adminRouter = express.Router();
adminRouter.post('/', courseController.createCourse); // 创建课程
adminRouter.put('/:id', courseController.updateCourse); // 更新课程
adminRouter.delete('/:id', courseController.deleteCourse); // 删除课程

// 将管理员路由合并到主路由
router.use(adminRouter);

module.exports = router;