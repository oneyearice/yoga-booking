/**
 * 排课控制器
 * 处理排课相关的API
 */

const Schedule = require('../models/Schedule');

class ScheduleController {
  /**
   * 获取排课列表
   */
  static async getSchedules(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        date, 
        courseId, 
        coachId, 
        status 
      } = req.query;

      const filters = {};
      if (date) filters.date = date;
      if (courseId) filters.courseId = courseId;
      if (coachId) filters.coachId = coachId;
      if (status) filters.status = status;

      const result = await Schedule.getList(page, limit, filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取排课详情
   */
  static async getScheduleById(req, res, next) {
    try {
      const { id } = req.params;
      
      const schedule = await Schedule.getById(id);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: '排课不存在'
        });
      }

      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取某日期的排课
   */
  static async getSchedulesByDate(req, res, next) {
    try {
      const { date } = req.params;
      const { courseCategory, coachId } = req.query;

      const filters = {};
      if (courseCategory) filters.courseCategory = courseCategory;
      if (coachId) filters.coachId = coachId;

      const schedules = await Schedule.getByDate(date, filters);

      res.json({
        success: true,
        data: schedules
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取教练的课表
   */
  static async getCoachSchedule(req, res, next) {
    try {
      const { coachId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: '请提供开始日期和结束日期'
        });
      }

      const schedule = await Schedule.getCoachSchedule(coachId, startDate, endDate);

      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取教练某日的排课
   */
  static async getCoachScheduleByDate(req, res, next) {
    try {
      const { coachId, date } = req.params;

      const schedules = await Schedule.getByCoachAndDate(coachId, date);

      res.json({
        success: true,
        data: schedules
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建排课（管理员权限）
   */
  static async createSchedule(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { 
        course_id, coach_id, date, start_time, end_time,
        max_capacity, location
      } = req.body;

      // 验证必填字段
      if (!course_id || !coach_id || !date || !start_time || !end_time || !max_capacity) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数'
        });
      }

      const scheduleData = {
        course_id: parseInt(course_id),
        coach_id: parseInt(coach_id),
        date,
        start_time,
        end_time,
        max_capacity: parseInt(max_capacity),
        location: location || ''
      };

      const schedule = await Schedule.create(scheduleData);

      res.status(201).json({
        success: true,
        message: '排课创建成功',
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新排课（管理员权限）
   */
  static async updateSchedule(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { id } = req.params;
      const updateData = {};

      // 只更新提供的字段
      if (req.body.course_id) updateData.course_id = parseInt(req.body.course_id);
      if (req.body.coach_id) updateData.coach_id = parseInt(req.body.coach_id);
      if (req.body.date) updateData.date = req.body.date;
      if (req.body.start_time) updateData.start_time = req.body.start_time;
      if (req.body.end_time) updateData.end_time = req.body.end_time;
      if (req.body.max_capacity) updateData.max_capacity = parseInt(req.body.max_capacity);
      if (req.body.location !== undefined) updateData.location = req.body.location;
      if (req.body.status) updateData.status = req.body.status;

      const schedule = await Schedule.update(parseInt(id), updateData);

      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: '排课不存在'
        });
      }

      res.json({
        success: true,
        message: '排课更新成功',
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 取消排课（管理员权限）
   */
  static async cancelSchedule(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { id } = req.params;
      const success = await Schedule.cancel(parseInt(id));

      if (!success) {
        return res.status(404).json({
          success: false,
          message: '排课不存在'
        });
      }

      res.json({
        success: true,
        message: '排课取消成功'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除排课（管理员权限）
   */
  static async deleteSchedule(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { id } = req.params;
      const success = await Schedule.delete(parseInt(id));

      if (!success) {
        return res.status(404).json({
          success: false,
          message: '排课不存在'
        });
      }

      res.json({
        success: true,
        message: '排课删除成功'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 批量创建排课（自动排课功能）
   */
  static async batchCreateSchedules(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { 
        course_id, coach_id, location, max_capacity,
        start_date, end_date, repeat_rule // daily, weekly, weekdays, weekends
      } = req.body;

      if (!course_id || !coach_id || !start_date || !end_date || !repeat_rule) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数'
        });
      }

      // 解析日期范围
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      if (startDate > endDate) {
        return res.status(400).json({
          success: false,
          message: '开始日期不能晚于结束日期'
        });
      }

      // 生成排课
      const scheduleDates = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        let shouldCreate = false;

        switch (repeat_rule) {
          case 'daily':
            shouldCreate = true;
            break;
          case 'weekdays':
            const dayOfWeek = currentDate.getDay();
            shouldCreate = dayOfWeek !== 0 && dayOfWeek !== 6; // 非周末
            break;
          case 'weekends':
            const dayOfWeek2 = currentDate.getDay();
            shouldCreate = dayOfWeek2 === 0 || dayOfWeek2 === 6; // 仅周末
            break;
          case 'weekly':
            // 每周同一天
            if (currentDate.toDateString() === startDate.toDateString() || 
                currentDate.getDay() === startDate.getDay()) {
              shouldCreate = true;
            }
            break;
          default:
            shouldCreate = true;
        }

        if (shouldCreate) {
          scheduleDates.push(new Date(currentDate));
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // 批量创建排课
      const createdSchedules = [];
      for (const date of scheduleDates) {
        try {
          const scheduleData = {
            course_id: parseInt(course_id),
            coach_id: parseInt(coach_id),
            date: date.toISOString().split('T')[0],
            start_time: req.body.start_time || '09:00:00',
            end_time: req.body.end_time || '10:00:00',
            max_capacity: parseInt(max_capacity),
            location: location || ''
          };

          const schedule = await Schedule.create(scheduleData);
          createdSchedules.push(schedule);
        } catch (error) {
          // 记录单个排课创建失败，但继续处理其他
          console.error(`创建排课失败 ${date}:`, error.message);
        }
      }

      res.json({
        success: true,
        message: `批量创建排课完成，成功${createdSchedules.length}条`,
        data: createdSchedules
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ScheduleController;