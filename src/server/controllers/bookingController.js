/**
 * 预约控制器
 * 处理预约相关的API
 */

const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

class BookingController {
  /**
   * 获取用户预约列表
   */
  static async getUserBookings(req, res, next) {
    try {
      const { userId } = req.user;
      const { 
        page = 1, 
        limit = 10, 
        status, 
        dateFrom, 
        dateTo 
      } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;

      const result = await Booking.getListByUser(userId, page, limit, filters);

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
   * 获取预约详情
   */
  static async getBookingById(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      
      const booking = await Booking.getById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: '预约不存在'
        });
      }

      // 检查是否是当前用户的预约
      if (booking.user_id != userId) {
        return res.status(403).json({
          success: false,
          message: '无权限查看他人预约'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建预约
   */
  static async createBooking(req, res, next) {
    try {
      const { userId } = req.user;
      const { schedule_id, people_count = 1 } = req.body;

      if (!schedule_id) {
        return res.status(400).json({
          success: false,
          message: '缺少排课ID'
        });
      }

      if (people_count <= 0 || people_count > 5) {
        return res.status(400).json({
          success: false,
          message: '预约人数必须在1-5之间'
        });
      }

      const bookingData = {
        user_id: userId,
        schedule_id: parseInt(schedule_id),
        people_count: parseInt(people_count)
      };

      const booking = await Booking.create(bookingData);

      res.status(201).json({
        success: true,
        message: '预约创建成功',
        data: booking
      });
    } catch (error) {
      // 特殊处理业务错误
      if (error.message.includes('时间冲突')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes('课时不足')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes('预约人数已满')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes('排课不存在') || error.message.includes('排课已取消')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * 取消预约
   */
  static async cancelBooking(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const { reason = '用户主动取消' } = req.body;

      const booking = await Booking.cancel(parseInt(id), userId, reason);

      res.json({
        success: true,
        message: '预约取消成功',
        data: booking
      });
    } catch (error) {
      if (error.message.includes('预约不存在') || error.message.includes('无权限')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  /**
   * 获取排课的预约列表（教练/管理员权限）
   */
  static async getScheduleBookings(req, res, next) {
    try {
      const { scheduleId } = req.params;
      const { userId, role } = req.user;

      // 获取排课信息
      const schedule = await Schedule.getById(scheduleId);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: '排课不存在'
        });
      }

      // 检查权限：教练只能查看自己的排课，管理员可以查看所有
      if (role !== 'admin' && schedule.coach_id != userId) {
        return res.status(403).json({
          success: false,
          message: '无权限查看此排课的预约'
        });
      }

      const bookings = await Booking.getListBySchedule(scheduleId);

      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户当日预约
   */
  static async getUserTodayBookings(req, res, next) {
    try {
      const { userId } = req.user;

      const bookings = await Booking.getUserTodayBookings(userId);

      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户预约统计
   */
  static async getUserBookingStats(req, res, next) {
    try {
      const { userId } = req.user;

      const stats = await Booking.getUserBookingStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取课程预约统计（管理员/教练权限）
   */
  static async getCourseBookingStats(req, res, next) {
    try {
      const { courseId } = req.params;
      const { userId, role } = req.user;

      // 获取课程信息
      const course = await require('../models/Course').getById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: '课程不存在'
        });
      }

      // 检查权限：教练只能查看自己教授的课程，管理员可以查看所有
      if (role !== 'admin' && course.coach_id != userId) {
        return res.status(403).json({
          success: false,
          message: '无权限查看此课程的预约统计'
        });
      }

      const stats = await Booking.getCourseBookingStats(courseId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 预约候补
   */
  static async joinWaitingList(req, res, next) {
    try {
      const { userId } = req.user;
      const { schedule_id } = req.body;

      if (!schedule_id) {
        return res.status(400).json({
          success: false,
          message: '缺少排课ID'
        });
      }

      // 获取排课信息
      const schedule = await Schedule.getById(schedule_id);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: '排课不存在'
        });
      }

      // 检查是否已约满
      if (schedule.status !== 'full') {
        return res.status(400).json({
          success: false,
          message: '课程尚未约满，可以直接预约'
        });
      }

      // 这里应该创建候补记录，当前简化处理
      // 实际项目中需要创建专门的候补表
      res.json({
        success: true,
        message: '已加入候补队列，有位置时将通知您',
        data: {
          schedule: {
            id: schedule.id,
            course_name: schedule.course_name,
            date: schedule.date,
            start_time: schedule.start_time,
            end_time: schedule.end_time
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 预约签到（教练/管理员权限）
   */
  static async checkInBooking(req, res, next) {
    try {
      const { bookingId } = req.params;
      const { userId, role } = req.user;

      // 获取预约信息
      const booking = await Booking.getById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: '预约不存在'
        });
      }

      // 获取排课信息
      const schedule = await Schedule.getById(booking.schedule_id);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: '排课不存在'
        });
      }

      // 检查权限：教练只能为自己课程签到，管理员可以为任意课程签到
      if (role !== 'admin' && schedule.coach_id != userId) {
        return res.status(403).json({
          success: false,
          message: '无权限为此课程签到'
        });
      }

      // 更新预约状态为已完成
      // 实际项目中可能需要专门的签到表记录
      await require('../models/db').pool.execute(
        'UPDATE bookings SET booking_status = "completed" WHERE id = ?',
        [bookingId]
      );

      res.json({
        success: true,
        message: '签到成功',
        data: {
          bookingId: bookingId,
          userId: booking.user_id,
          courseName: booking.course_name
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BookingController;