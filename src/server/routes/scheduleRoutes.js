/**
 * 排课相关路由
 */

const express = require('express');
const scheduleController = require('../controllers/scheduleController');

const router = express.Router();

// 排课相关路由（无需认证）
router.get('/', scheduleController.getSchedules); // 获取排课列表
router.get('/:id', scheduleController.getScheduleById); // 获取排课详情
router.get('/date/:date', scheduleController.getSchedulesByDate); // 获取某日期的排课
router.get('/coach/:coachId', scheduleController.getCoachSchedule); // 获取教练课表
router.get('/coach/:coachId/date/:date', scheduleController.getCoachScheduleByDate); // 获取教练某日排课

// 管理员专用路由（需要认证）
const adminRouter = express.Router();
adminRouter.post('/', scheduleController.createSchedule); // 创建排课
adminRouter.put('/:id', scheduleController.updateSchedule); // 更新排课
adminRouter.put('/:id/cancel', scheduleController.cancelSchedule); // 取消排课
adminRouter.delete('/:id', scheduleController.deleteSchedule); // 删除排课
adminRouter.post('/batch', scheduleController.batchCreateSchedules); // 批量创建排课

// 将管理员路由合并到主路由
router.use(adminRouter);

module.exports = router;