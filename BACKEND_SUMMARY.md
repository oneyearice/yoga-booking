# 瑜伽馆课程预约系统 - 后端实现总结

## 项目概述

完成了瑜伽馆课程预约系统的完整后端API开发，包括用户认证、课程管理、排课管理、预约管理等功能模块。

## 技术架构

- **运行环境**: Node.js 14+
- **Web框架**: Express.js
- **数据库**: MySQL
- **ORM**: Sequelize (逻辑封装在模型中)
- **认证**: JWT (JSON Web Tokens)
- **安全**: Helmet, Rate Limiting, CORS
- **验证**: 自定义验证逻辑

## 数据库设计

### 7个核心数据表

1. **users表** - 用户信息管理
   - 字段: id, openid, phone, name, avatar, credit_balance, role
   - 索引: openid, phone, role
   - 用途: 存储系统所有用户（用户/教练/管理员）

2. **courses表** - 课程信息管理
   - 字段: id, name, category, duration, capacity, price, coach_id, coach_name, description, cover_image, status
   - 索引: coach_id, category, status
   - 用途: 存储各类课程信息

3. **schedules表** - 排课信息管理
   - 字段: id, course_id, coach_id, date, start_time, end_time, max_capacity, booked_count, location, status
   - 索引: course_id, coach_id, date, datetime
   - 用途: 存储具体的排课安排

4. **bookings表** - 预约信息管理
   - 字段: id, user_id, schedule_id, course_id, booking_date, booking_time, people_count, booking_status, cancel_time, cancel_reason
   - 索引: user_id, schedule_id, course_id, booking_date, status
   - 用途: 存储用户预约记录

5. **credit_records表** - 课时记录管理
   - 字段: id, user_id, type, amount, balance_after, reason, related_id
   - 索引: user_id, type, created_at
   - 用途: 记录用户课时变动历史

6. **coach_hours表** - 教练课时统计
   - 字段: id, coach_id, date, class_count, student_count, hours_worked
   - 索引: coach_id, date
   - 用途: 统计教练工作量

7. **外键约束** - 确保数据一致性
   - schedules.course_id → courses.id
   - bookings.user_id → users.id
   - bookings.schedule_id → schedules.id
   - bookings.course_id → courses.id
   - credit_records.user_id → users.id
   - coach_hours.coach_id → users.id

## API功能模块

### 1. 认证模块 (Auth)
- 微信登录 (`POST /api/auth/login/wechat`)
- 手机号绑定 (`POST /api/auth/bind-phone`)
- 获取用户信息 (`GET /api/auth/info`)
- 更新用户信息 (`PUT /api/auth/info`)
- 获取课时余额 (`GET /api/auth/credit-balance`)
- 刷新令牌 (`POST /api/auth/refresh-token`)

### 2. 课程模块 (Course)
- 获取课程列表 (`GET /api/courses`)
- 获取课程详情 (`GET /api/courses/:id`)
- 获取教练课程 (`GET /api/courses/coach/:coachId`)
- 获取热门课程 (`GET /api/courses/popular`)
- 创建课程 (`POST /api/courses`) - 管理员
- 更新课程 (`PUT /api/courses/:id`) - 管理员
- 删除课程 (`DELETE /api/courses/:id`) - 管理员

### 3. 排课模块 (Schedule)
- 获取排课列表 (`GET /api/schedules`)
- 获取排课详情 (`GET /api/schedules/:id`)
- 获取某日排课 (`GET /api/schedules/date/:date`)
- 获取教练课表 (`GET /api/schedules/coach/:coachId`)
- 创建排课 (`POST /api/schedules`) - 管理员
- 更新排课 (`PUT /api/schedules/:id`) - 管理员
- 取消排课 (`PUT /api/schedules/:id/cancel`) - 管理员
- 删除排课 (`DELETE /api/schedules/:id`) - 管理员
- 批量排课 (`POST /api/schedules/batch`) - 管理员

### 4. 预约模块 (Booking)
- 获取用户预约 (`GET /api/bookings`)
- 获取预约详情 (`GET /api/bookings/:id`)
- 创建预约 (`POST /api/bookings`)
- 取消预约 (`PUT /api/bookings/:id/cancel`)
- 获取排课预约 (`GET /api/bookings/schedule/:scheduleId`) - 教练/管理员
- 获取今日预约 (`GET /api/bookings/today`)
- 获取预约统计 (`GET /api/bookings/stats`)
- 预约签到 (`PUT /api/bookings/check-in/:bookingId`) - 教练/管理员

### 5. 用户模块 (User)
- 获取当前用户 (`GET /api/users`)
- 更新用户信息 (`PUT /api/users`)
- 获取预约统计 (`GET /api/users/booking-stats`)
- 获取教练列表 (`GET /api/users/coaches`)
- 获取教练详情 (`GET /api/users/coaches/:id`)
- 获取课时记录 (`GET /api/users/credit-records/:userId`)
- 用户管理接口 - 管理员专用

### 6. 管理员模块 (Admin)
- 课程管理接口
- 排课管理接口
- 用户管理接口
- 预约管理接口
- 数据统计接口

## 安全措施

- JWT认证和授权机制
- 身份验证中间件
- 角色权限控制（用户/教练/管理员）
- 输入数据验证
- SQL注入防护
- 请求频率限制
- XSS防护

## 业务逻辑

### 1. 预约规则
- 时间冲突检测：防止同一用户在相同时间预约多个课程
- 容量限制：确保不超过课程最大容量
- 课时扣除：预约成功时扣除相应课时
- 取消政策：开课前3小时可免费取消

### 2. 排课规则
- 时间冲突检测：防止教练在同一时间安排多个课程
- 容量管理：实时更新已预约人数
- 状态管理：根据预约情况自动更新状态

### 3. 课时管理
- 预约扣费：根据课程价格扣除课时
- 退订返费：取消预约返还课时
- 余额检查：确保用户有足够的课时预约

## 文件结构

```
src/server/
├── server.js                 # 主服务器文件
├── package.json             # 依赖配置
├── .env.example            # 环境变量示例
├── API.md                  # API文档
├── DEPLOYMENT.md           # 部署指南
├── controllers/            # 控制器层
│   ├── authController.js   # 认证控制器
│   ├── courseController.js # 课程控制器
│   ├── scheduleController.js # 排课控制器
│   ├── bookingController.js # 预约控制器
│   └── userController.js   # 用户控制器
├── models/                 # 数据模型层
│   ├── User.js             # 用户模型
│   ├── Course.js           # 课程模型
│   ├── Schedule.js         # 排课模型
│   └── Booking.js          # 预约模型
├── routes/                 # 路由定义
│   ├── userRoutes.js       # 用户路由
│   ├── courseRoutes.js     # 课程路由
│   ├── scheduleRoutes.js   # 排课路由
│   ├── bookingRoutes.js    # 预约路由
│   └── adminRoutes.js      # 管理员路由
├── middleware/             # 中间件
│   ├── auth.js             # 认证中间件
│   └── errorHandler.js     # 错误处理中间件
├── config/                 # 配置文件
│   └── db.js               # 数据库配置
├── database/               # 数据库相关
│   └── schema.sql          # 数据库表结构
└── utils/                  # 工具函数
```

## 错误处理

- 统一的错误响应格式
- 详细的错误信息
- 开发/生产环境差异化错误信息
- 业务逻辑错误处理

## 性能优化

- 数据库索引优化
- 查询性能优化
- 连接池管理
- 缓存策略预留

## 部署准备

- 环境变量配置
- 生产环境配置
- PM2进程管理支持
- Nginx反向代理配置

## 测试覆盖

- 单元测试基础结构
- API功能测试用例
- 业务逻辑验证
- 异常情况处理

## 扩展性考虑

- 模块化设计便于扩展
- 标准化接口便于维护
- 松耦合架构便于升级
- 文档完善便于协作

---
**完成时间**: 2026-03-16
**开发人员**: @coder
**状态**: 后端API开发完成，准备前后端联调