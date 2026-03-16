# 瑜伽馆课程预约系统 - API接口清单

## 1. 认证相关接口

### 1.1 微信登录
- **POST** `/api/auth/login/wechat`
- **描述**: 微信一键登录
- **权限**: 公开
- **请求体**: `{code, encryptedData, iv}`
- **响应**: `{success, data: {user, token}}`

### 1.2 绑定手机号
- **POST** `/api/auth/bind-phone`
- **描述**: 绑定手机号
- **权限**: 认证用户
- **请求体**: `{phone, verificationCode}`
- **响应**: `{success, data: {user}}`

### 1.3 获取用户信息
- **GET** `/api/auth/info`
- **描述**: 获取当前用户信息
- **权限**: 认证用户
- **响应**: `{success, data: {user}}`

### 1.4 更新用户信息
- **PUT** `/api/auth/info`
- **描述**: 更新当前用户信息
- **权限**: 认证用户
- **请求体**: `{name, avatar}`
- **响应**: `{success, data: {user}}`

### 1.5 获取课时余额
- **GET** `/api/auth/credit-balance`
- **描述**: 获取当前用户课时余额
- **权限**: 认证用户
- **响应**: `{success, data: {creditBalance}}`

## 2. 课程相关接口

### 2.1 获取课程列表
- **GET** `/api/courses`
- **描述**: 获取课程列表
- **权限**: 公开
- **参数**: `page, limit, category, coachId, search`
- **响应**: `{success, data: [courses], pagination}`

### 2.2 获取课程详情
- **GET** `/api/courses/:id`
- **描述**: 获取课程详情
- **权限**: 公开
- **响应**: `{success, data: {course}}`

### 2.3 获取教练课程列表
- **GET** `/api/courses/coach/:coachId`
- **描述**: 获取指定教练的课程列表
- **权限**: 公开
- **参数**: `page, limit`
- **响应**: `{success, data: [courses], pagination}`

### 2.4 获取热门课程
- **GET** `/api/courses/popular`
- **描述**: 获取热门课程
- **权限**: 公开
- **参数**: `limit`
- **响应**: `{success, data: [courses]}`

### 2.5 创建课程（管理员）
- **POST** `/api/courses`
- **描述**: 创建课程
- **权限**: 管理员
- **请求体**: `{name, category, duration, capacity, price, coach_id, coach_name, description, cover_image}`
- **响应**: `{success, data: {course}}`

### 2.6 更新课程（管理员）
- **PUT** `/api/courses/:id`
- **描述**: 更新课程
- **权限**: 管理员
- **请求体**: `{name, category, duration, capacity, price, coach_id, coach_name, description, cover_image, status}`
- **响应**: `{success, data: {course}}`

### 2.7 删除课程（管理员）
- **DELETE** `/api/courses/:id`
- **描述**: 删除课程
- **权限**: 管理员
- **响应**: `{success, message}`

## 3. 排课相关接口

### 3.1 获取排课列表
- **GET** `/api/schedules`
- **描述**: 获取排课列表
- **权限**: 公开
- **参数**: `page, limit, date, courseId, coachId, status`
- **响应**: `{success, data: [schedules], pagination}`

### 3.2 获取排课详情
- **GET** `/api/schedules/:id`
- **描述**: 获取排课详情
- **权限**: 公开
- **响应**: `{success, data: {schedule}}`

### 3.3 获取某日期排课
- **GET** `/api/schedules/date/:date`
- **描述**: 获取指定日期的排课
- **权限**: 公开
- **参数**: `courseCategory, coachId`
- **响应**: `{success, data: [schedules]}`

### 3.4 获取教练课表
- **GET** `/api/schedules/coach/:coachId`
- **描述**: 获取教练的课表
- **权限**: 公开
- **参数**: `startDate, endDate`
- **响应**: `{success, data: {schedulesByDate}}`

### 3.5 获取教练某日排课
- **GET** `/api/schedules/coach/:coachId/date/:date`
- **描述**: 获取教练某日的排课
- **权限**: 公开
- **响应**: `{success, data: [schedules]}`

### 3.6 创建排课（管理员）
- **POST** `/api/schedules`
- **描述**: 创建排课
- **权限**: 管理员
- **请求体**: `{course_id, coach_id, date, start_time, end_time, max_capacity, location}`
- **响应**: `{success, data: {schedule}}`

### 3.7 更新排课（管理员）
- **PUT** `/api/schedules/:id`
- **描述**: 更新排课
- **权限**: 管理员
- **请求体**: `{course_id, coach_id, date, start_time, end_time, max_capacity, location, status}`
- **响应**: `{success, data: {schedule}}`

### 3.8 取消排课（管理员）
- **PUT** `/api/schedules/:id/cancel`
- **描述**: 取消排课
- **权限**: 管理员
- **响应**: `{success, message}`

### 3.9 删除排课（管理员）
- **DELETE** `/api/schedules/:id`
- **描述**: 删除排课
- **权限**: 管理员
- **响应**: `{success, message}`

### 3.10 批量创建排课（自动排课）
- **POST** `/api/schedules/batch`
- **描述**: 批量创建排课（自动排课功能）
- **权限**: 管理员
- **请求体**: `{course_id, coach_id, location, max_capacity, start_date, end_date, repeat_rule, start_time, end_time}`
- **响应**: `{success, data: [schedules]}`

## 4. 预约相关接口

### 4.1 获取用户预约列表
- **GET** `/api/bookings`
- **描述**: 获取当前用户的预约列表
- **权限**: 认证用户
- **参数**: `page, limit, status, dateFrom, dateTo`
- **响应**: `{success, data: [bookings], pagination}`

### 4.2 获取预约详情
- **GET** `/api/bookings/:id`
- **描述**: 获取预约详情
- **权限**: 认证用户（本人）
- **响应**: `{success, data: {booking}}`

### 4.3 创建预约
- **POST** `/api/bookings`
- **描述**: 创建预约
- **权限**: 认证用户
- **请求体**: `{schedule_id, people_count}`
- **响应**: `{success, data: {booking}}`

### 4.4 取消预约
- **PUT** `/api/bookings/:id/cancel`
- **描述**: 取消预约
- **权限**: 认证用户（本人）
- **请求体**: `{reason}`
- **响应**: `{success, data: {booking}}`

### 4.5 获取排课预约列表
- **GET** `/api/bookings/schedule/:scheduleId`
- **描述**: 获取排课的预约列表
- **权限**: 教练（本人课程）/管理员
- **响应**: `{success, data: [bookings]}`

### 4.6 获取用户当日预约
- **GET** `/api/bookings/today`
- **描述**: 获取当前用户当日预约
- **权限**: 认证用户
- **响应**: `{success, data: [bookings]}`

### 4.7 获取用户预约统计
- **GET** `/api/bookings/stats`
- **描述**: 获取当前用户预约统计
- **权限**: 认证用户
- **响应**: `{success, data: {stats}}`

### 4.8 获取课程预约统计
- **GET** `/api/bookings/course/:courseId/stats`
- **描述**: 获取课程预约统计
- **权限**: 教练（本人课程）/管理员
- **响应**: `{success, data: {stats}}`

### 4.9 加入候补
- **POST** `/api/bookings/waiting-list`
- **描述**: 加入预约候补队列
- **权限**: 认证用户
- **请求体**: `{schedule_id}`
- **响应**: `{success, message, data: {schedule}}`

### 4.10 预约签到
- **PUT** `/api/bookings/check-in/:bookingId`
- **描述**: 预约签到
- **权限**: 教练（本人课程）/管理员
- **响应**: `{success, message, data: {booking}}`

## 5. 用户相关接口

### 5.1 获取当前用户信息
- **GET** `/api/users`
- **描述**: 获取当前用户信息
- **权限**: 认证用户
- **响应**: `{success, data: {user}}`

### 5.2 更新当前用户信息
- **PUT** `/api/users`
- **描述**: 更新当前用户信息
- **权限**: 认证用户
- **请求体**: `{name, avatar}`
- **响应**: `{success, data: {user}}`

### 5.3 获取用户预约统计
- **GET** `/api/users/booking-stats`
- **描述**: 获取当前用户预约统计
- **权限**: 认证用户
- **响应**: `{success, data: {stats}}`

### 5.4 获取教练列表
- **GET** `/api/users/coaches`
- **描述**: 获取教练列表
- **权限**: 公开
- **参数**: `page, limit, search`
- **响应**: `{success, data: [coaches], pagination}`

### 5.5 获取教练详情
- **GET** `/api/users/coaches/:id`
- **描述**: 获取教练详情
- **权限**: 公开
- **响应**: `{success, data: {coach}}`

### 5.6 获取用户课时记录
- **GET** `/api/users/credit-records/:userId`
- **描述**: 获取用户课时记录
- **权限**: 用户本人/管理员
- **参数**: `page, limit, type`
- **响应**: `{success, data: [records], pagination}`

### 5.7 获取用户列表（管理员）
- **GET** `/api/users/admin/list`
- **描述**: 获取用户列表
- **权限**: 管理员
- **参数**: `page, limit, role, search`
- **响应**: `{success, data: [users], pagination}`

### 5.8 获取用户详情（管理员）
- **GET** `/api/users/admin/:id`
- **描述**: 获取用户详情
- **权限**: 管理员
- **响应**: `{success, data: {user}}`

### 5.9 更新用户信息（管理员）
- **PUT** `/api/users/admin/:id`
- **描述**: 更新用户信息
- **权限**: 管理员
- **请求体**: `{name, phone, role, avatar}`
- **响应**: `{success, data: {user}}`

### 5.10 更新用户课时（管理员）
- **PUT** `/api/users/admin/:id/credit`
- **描述**: 更新用户课时
- **权限**: 管理员
- **请求体**: `{credit_balance, reason}`
- **响应**: `{success, data: {user}}`

### 5.11 删除用户（管理员）
- **DELETE** `/api/users/admin/:id`
- **描述**: 删除用户
- **权限**: 管理员
- **响应**: `{success, message}`

## 6. 管理员相关接口

### 6.1 课程管理
- **GET** `/api/admin/courses` - 获取课程列表
- **POST** `/api/admin/courses` - 创建课程
- **PUT** `/api/admin/courses/:id` - 更新课程
- **DELETE** `/api/admin/courses/:id` - 删除课程

### 6.2 排课管理
- **GET** `/api/admin/schedules` - 获取排课列表
- **POST** `/api/admin/schedules` - 创建排课
- **PUT** `/api/admin/schedules/:id` - 更新排课
- **PUT** `/api/admin/schedules/:id/cancel` - 取消排课
- **DELETE** `/api/admin/schedules/:id` - 删除排课
- **POST** `/api/admin/schedules/batch` - 批量创建排课

### 6.3 用户管理
- **GET** `/api/admin/users` - 获取用户列表
- **GET** `/api/admin/users/:id` - 获取用户详情
- **PUT** `/api/admin/users/:id` - 更新用户信息
- **PUT** `/api/admin/users/:id/credit` - 更新用户课时
- **DELETE** `/api/admin/users/:id` - 删除用户

### 6.4 预约管理
- **GET** `/api/admin/bookings` - 获取预约列表
- **GET** `/api/admin/bookings/:id` - 获取预约详情
- **PUT** `/api/admin/bookings/:id/cancel` - 取消预约
- **GET** `/api/admin/bookings/schedule/:scheduleId` - 获取排课预约
- **GET** `/api/admin/bookings/course/:courseId/stats` - 课程预约统计
- **PUT** `/api/admin/bookings/check-in/:bookingId` - 预约签到

### 6.5 数据统计
- **GET** `/api/admin/stats/overall` - 获取总体统计数据
- **GET** `/api/admin/stats/course-popularity` - 课程受欢迎程度统计
- **GET** `/api/admin/stats/coach-performance` - 教练表现统计

## 通用响应格式

```json
{
  "success": true/false,
  "message": "响应消息",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 通用错误码

- `400`: 请求参数错误
- `401`: 未认证或认证失败
- `403`: 无权限操作
- `404`: 资源不存在
- `429`: 请求过于频繁
- `500`: 服务器内部错误
- `503`: 服务不可用