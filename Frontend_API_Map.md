# 前后端接口对接文档

## 1. 首页 (pages/index/index)

### 1.1 获取推荐课程
- **前端调用**: `onLoad()` 时调用
- **API**: `GET /api/courses?limit=5&category=all`
- **参数**: `limit=5`
- **返回**: 推荐课程列表
- **用途**: 首页推荐课程展示

### 1.2 获取用户信息
- **前端调用**: `onLoad()` 时调用
- **API**: `GET /api/auth/info`
- **认证**: 需要JWT token
- **返回**: 用户基本信息
- **用途**: 显示用户昵称、头像

### 1.3 获取用户当日预约
- **前端调用**: `onLoad()` 时调用
- **API**: `GET /api/bookings/today`
- **认证**: 需要JWT token
- **返回**: 当日预约列表
- **用途**: 首页预约提醒展示

## 2. 课程列表页 (pages/courses/list)

### 2.1 获取课程列表
- **前端调用**: `onLoad()`, `filterCourses()` 时调用
- **API**: `GET /api/courses`
- **参数**: `page, limit, category, search`
- **返回**: 课程列表和分页信息
- **用途**: 课程列表展示、筛选、搜索

### 2.2 获取课程分类
- **前端调用**: 页面初始化时使用内置数据
- **API**: 无（前端定义）
- **返回**: 分类选项列表
- **用途**: 分类筛选

## 3. 课程详情页 (pages/courses/detail)

### 3.1 获取课程详情
- **前端调用**: `onLoad()` 时调用
- **API**: `GET /api/courses/:id`
- **参数**: `id` (课程ID)
- **返回**: 课程详细信息
- **用途**: 课程详情展示

### 3.2 获取可预约时间
- **前端调用**: `onLoad()` 时调用
- **API**: `GET /api/schedules?courseId=:courseId&date=:date`
- **参数**: `courseId, date`
- **返回**: 可预约时间段列表
- **用途**: 显示可预约时间

## 4. 预约确认页 (pages/booking/confirm)

### 4.1 创建预约
- **前端调用**: `confirmBooking()` 时调用
- **API**: `POST /api/bookings`
- **认证**: 需要JWT token
- **请求体**: `{schedule_id, people_count}`
- **返回**: 预约结果
- **用途**: 确认预约操作

### 4.2 获取用户课时余额
- **前端调用**: 页面加载时调用
- **API**: `GET /api/auth/credit-balance`
- **认证**: 需要JWT token
- **返回**: 课时余额
- **用途**: 显示课时余额

## 5. 个人中心页 (pages/user/index)

### 5.1 获取用户信息
- **前端调用**: `onLoad()`, `onShow()` 时调用
- **API**: `GET /api/auth/info`
- **认证**: 需要JWT token
- **返回**: 用户完整信息
- **用途**: 个人信息展示

### 5.2 获取预约统计
- **前端调用**: `onLoad()` 时调用
- **API**: `GET /api/bookings/stats`
- **认证**: 需要JWT token
- **返回**: 预约统计信息
- **用途**: 预约概览展示

## 6. 我的预约页 (pages/booking/list)

### 6.1 获取预约列表
- **前端调用**: `onLoad()`, `filterBookings()` 时调用
- **API**: `GET /api/bookings`
- **认证**: 需要JWT token
- **参数**: `page, limit, status`
- **返回**: 预约列表和分页信息
- **用途**: 预约列表展示、状态筛选

### 6.2 取消预约
- **前端调用**: `cancelBooking()` 时调用
- **API**: `PUT /api/bookings/:id/cancel`
- **认证**: 需要JWT token
- **请求体**: `{reason}`
- **返回**: 取消结果
- **用途**: 预约取消操作

### 6.3 联系教练
- **前端调用**: `contactCoach()` 时调用
- **API**: 无（调用系统拨号功能）
- **返回**: 无
- **用途**: 拨打电话联系教练

## 7. 用户预约页 (pages/user/bookings)

### 7.1 获取预约列表
- **前端调用**: `onLoad()`, `filterBookings()` 时调用
- **API**: `GET /api/bookings`
- **认证**: 需要JWT token
- **参数**: `page, limit, status`
- **返回**: 预约列表和分页信息
- **用途**: 预约列表展示、状态筛选

### 7.2 取消预约
- **前端调用**: `cancelBooking()` 时调用
- **API**: `PUT /api/bookings/:id/cancel`
- **认证**: 需要JWT token
- **请求体**: `{reason}`
- **返回**: 取消结果
- **用途**: 预约取消操作

## 8. 教练课表页 (pages/coach/schedule)

### 8.1 获取教练课表
- **前端调用**: `onLoad()`, `loadSchedule()` 时调用
- **API**: `GET /api/schedules/coach/:coachId`
- **认证**: 需要JWT token
- **参数**: `startDate, endDate`
- **返回**: 教练课表信息
- **用途**: 课表展示

### 8.2 获取指定日期排课
- **前端调用**: `bindDateChange()` 时调用
- **API**: `GET /api/schedules/date/:date`
- **参数**: `date`
- **返回**: 指定日期的排课列表
- **用途**: 日期筛选后的课表展示

## 9. 教练学员页 (pages/coach/students)

### 9.1 获取学员列表
- **前端调用**: `onLoad()`, `filterStudents()` 时调用
- **API**: `GET /api/users/admin/list`
- **认证**: 需要JWT token（教练角色）
- **参数**: `page, limit, role=user, search`
- **返回**: 学员列表和分页信息
- **用途**: 学员列表展示、搜索

### 9.2 获取预约记录
- **前端调用**: 需要单独接口获取学员预约记录
- **API**: `GET /api/bookings?coachId=:coachId`
- **认证**: 需要JWT token
- **参数**: `coachId`
- **返回**: 学员预约记录
- **用途**: 学员预约详情

## 10. 管理员课程管理页 (pages/admin/courses)

### 10.1 获取课程列表
- **前端调用**: `onLoad()`, `filterCourses()` 时调用
- **API**: `GET /api/admin/courses`
- **认证**: 需要JWT token（管理员角色）
- **参数**: `page, limit, category, status, search`
- **返回**: 课程列表和分页信息
- **用途**: 课程列表展示、筛选

### 10.2 创建课程
- **前端调用**: `saveCourse()` 时调用
- **API**: `POST /api/admin/courses`
- **认证**: 需要JWT token（管理员角色）
- **请求体**: 课程信息
- **返回**: 创建的课程信息
- **用途**: 新增课程

### 10.3 更新课程
- **前端调用**: `saveCourse()` 时调用
- **API**: `PUT /api/admin/courses/:id`
- **认证**: 需要JWT token（管理员角色）
- **请求体**: 更新的课程信息
- **返回**: 更新后的课程信息
- **用途**: 修改课程

### 10.4 删除课程
- **前端调用**: `performDelete()` 时调用
- **API**: `DELETE /api/admin/courses/:id`
- **认证**: 需要JWT token（管理员角色）
- **返回**: 删除结果
- **用途**: 删除课程

### 10.5 切换课程状态
- **前端调用**: `performToggle()` 时调用
- **API**: `PUT /api/admin/courses/:id` (更新status字段)
- **认证**: 需要JWT token（管理员角色）
- **请求体**: `{status}`
- **返回**: 更新后的课程信息
- **用途**: 启用/停用课程

## 11. 管理员排课管理页 (pages/admin/schedule)

### 11.1 获取排课列表
- **前端调用**: `onLoad()`, `filterSchedules()` 时调用
- **API**: `GET /api/admin/schedules`
- **认证**: 需要JWT token（管理员角色）
- **参数**: `page, limit, date, courseId, coachId, status`
- **返回**: 排课列表和分页信息
- **用途**: 排课列表展示、筛选

### 11.2 创建排课
- **前端调用**: `saveSchedule()` 时调用
- **API**: `POST /api/admin/schedules`
- **认证**: 需要JWT token（管理员角色）
- **请求体**: 排课信息
- **返回**: 创建的排课信息
- **用途**: 新增排课

### 11.3 更新排课
- **前端调用**: `saveSchedule()` 时调用
- **API**: `PUT /api/admin/schedules/:id`
- **认证**: 需要JWT token（管理员角色）
- **请求体**: 更新的排课信息
- **返回**: 更新后的排课信息
- **用途**: 修改排课

### 11.4 删除排课
- **前端调用**: `performDelete()` 时调用
- **API**: `DELETE /api/admin/schedules/:id`
- **认证**: 需要JWT token（管理员角色）
- **返回**: 删除结果
- **用途**: 删除排课

### 11.5 批量创建排课（自动排课）
- **前端调用**: `performAutoSchedule()` 时调用
- **API**: `POST /api/admin/schedules/batch`
- **认证**: 需要JWT token（管理员角色）
- **请求体**: 批量排课参数
- **返回**: 创建的排课列表
- **用途**: 自动排课功能

## 12. 管理员用户管理页 (pages/admin/users)

### 12.1 获取用户列表
- **前端调用**: `onLoad()`, `filterUsers()` 时调用
- **API**: `GET /api/admin/users`
- **认证**: 需要JWT token（管理员角色）
- **参数**: `page, limit, role, search`
- **返回**: 用户列表和分页信息
- **用途**: 用户列表展示、筛选

### 12.2 创建用户
- **前端调用**: `saveUser()` 时调用
- **API**: `POST /api/admin/users` (需要新接口)
- **认证**: 需要JWT token（管理员角色）
- **请求体**: 用户信息
- **返回**: 创建的用户信息
- **用途**: 新增用户

### 12.3 更新用户
- **前端调用**: `saveUser()` 时调用
- **API**: `PUT /api/admin/users/:id`
- **认证**: 需要JWT token（管理员角色）
- **请求体**: 更新的用户信息
- **返回**: 更新后的用户信息
- **用途**: 修改用户信息

### 12.4 删除用户
- **前端调用**: `performDelete()` 时调用
- **API**: `DELETE /api/admin/users/:id`
- **认证**: 需要JWT token（管理员角色）
- **返回**: 删除结果
- **用途**: 删除用户

### 12.5 重置用户密码
- **前端调用**: `confirmResetPassword()` 时调用
- **API**: `PUT /api/admin/users/:id/password` (需要新接口)
- **认证**: 需要JWT token（管理员角色）
- **请求体**: `{newPassword}`
- **返回**: 重置结果
- **用途**: 重置用户密码

### 12.6 更新用户课时
- **前端调用**: 需要特定功能时调用
- **API**: `PUT /api/admin/users/:id/credit`
- **认证**: 需要JWT token（管理员角色）
- **请求体**: `{credit_balance, reason}`
- **返回**: 更新后的用户信息
- **用途**: 调整用户课时

## 13. 通用接口

### 13.1 微信登录
- **前端调用**: 应用启动或需要登录时调用
- **API**: `POST /api/auth/login/wechat`
- **请求体**: `{code}`
- **返回**: `{user, token}`
- **用途**: 用户认证

### 13.2 绑定手机号
- **前端调用**: 用户需要绑定手机号时调用
- **API**: `POST /api/auth/bind-phone`
- **认证**: 需要JWT token
- **请求体**: `{phone, verificationCode}`
- **返回**: 绑定结果
- **用途**: 手机号绑定

### 13.3 获取教练列表
- **前端调用**: 需要教练信息时调用
- **API**: `GET /api/users/coaches`
- **参数**: `page, limit, search`
- **返回**: 教练列表
- **用途**: 教练选择、信息展示

## 14. 错误处理

### 14.1 认证失败
- **状态码**: 401
- **前端处理**: 跳转登录页面

### 14.2 权限不足
- **状态码**: 403
- **前端处理**: 显示权限不足提示

### 14.3 资源不存在
- **状态码**: 404
- **前端处理**: 显示相应提示

### 14.4 业务逻辑错误
- **状态码**: 400
- **前端处理**: 显示具体错误信息