/**
 * 课程控制器
 * 处理课程相关的API
 */

const Course = require('../models/Course');

class CourseController {
  /**
   * 获取课程列表
   */
  static async getCourses(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        coachId, 
        search 
      } = req.query;

      const filters = {};
      if (category) filters.category = category;
      if (coachId) filters.coachId = coachId;
      if (search) filters.search = search;

      const result = await Course.getList(page, limit, filters);

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
   * 获取课程详情
   */
  static async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      
      const course = await Course.getById(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: '课程不存在'
        });
      }

      res.json({
        success: true,
        data: course
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取教练的课程列表
   */
  static async getCoursesByCoach(req, res, next) {
    try {
      const { coachId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await Course.getByCoachId(coachId, page, limit);

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
   * 获取热门课程
   */
  static async getPopularCourses(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const courses = await Course.getPopularCourses(parseInt(limit));

      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建课程（管理员权限）
   */
  static async createCourse(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { 
        name, category, duration, capacity, price,
        coach_id, coach_name, description, cover_image
      } = req.body;

      // 验证必填字段
      if (!name || !category || !duration || !capacity || !price || !coach_id || !coach_name) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数'
        });
      }

      const courseData = {
        name,
        category,
        duration: parseInt(duration),
        capacity: parseInt(capacity),
        price: parseFloat(price),
        coach_id: parseInt(coach_id),
        coach_name,
        description: description || '',
        cover_image: cover_image || ''
      };

      const course = await Course.create(courseData);

      res.status(201).json({
        success: true,
        message: '课程创建成功',
        data: course
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新课程（管理员权限）
   */
  static async updateCourse(req, res, next) {
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
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.category) updateData.category = req.body.category;
      if (req.body.duration) updateData.duration = parseInt(req.body.duration);
      if (req.body.capacity) updateData.capacity = parseInt(req.body.capacity);
      if (req.body.price) updateData.price = parseFloat(req.body.price);
      if (req.body.coach_id) updateData.coach_id = parseInt(req.body.coach_id);
      if (req.body.coach_name) updateData.coach_name = req.body.coach_name;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.cover_image !== undefined) updateData.cover_image = req.body.cover_image;
      if (req.body.status) updateData.status = req.body.status;

      const course = await Course.update(parseInt(id), updateData);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: '课程不存在'
        });
      }

      res.json({
        success: true,
        message: '课程更新成功',
        data: course
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除课程（软删除，管理员权限）
   */
  static async deleteCourse(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权限操作'
        });
      }

      const { id } = req.params;
      const success = await Course.softDelete(parseInt(id));

      if (!success) {
        return res.status(404).json({
          success: false,
          message: '课程不存在'
        });
      }

      res.json({
        success: true,
        message: '课程删除成功'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CourseController;