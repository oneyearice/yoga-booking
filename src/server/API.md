# 瑜伽馆课程预约系统 - API文档

## 概述

本API提供瑜伽馆课程预约系统的所有后端功能，包括用户认证、课程管理、排课管理、预约管理等功能。

## 基础信息

- **API基础URL**: `http://localhost:3000/api`
- **协议**: HTTPS/HTTP
- **数据格式**: JSON
- **认证方式**: JWT Token

## 通用响应格式

```json
{
  "success": true/false,
  "message": "响应消息",
  "data": {},
  "pagination": {}
}
```

## 认证相关

### 微信登录
- **POST** `/auth/login/wechat`
- **描述**: 微信一键登录
- **请求体**:
```json
{
  "code": "wx_login_code",
  "encryptedData": "encrypted_data",
  "iv": "initialization_vector"
}
```
- **响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "openid": "wx_openid",
      "name": "用户昵称",
      "avatar": "头像URL",
      "role": "user/coach/admin",
      "creditBalance": 8
    },
    "token": "jwt_token"
  }
}
```

### 绑定手机号
- **POST** `/auth/bind-phone`
- **描述**: 绑定手机号
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
```json
{
  "phone": "13800138000",
  "verificationCode": "123456"
}
```

### 获取用户信息
- **GET** `/auth/info`
- **描述**: 获取当前用户信息
- **请求头**: `Authorization: Bearer {token}`

## 课程相关

### 获取课程列表
- **GET** `/courses`
- **描述**: 获取课程列表
- **参数**:
  - `page`: 页码，默认1
  - `limit`: 每页数量，默认10
  - `category`: 课程分类（瑜伽/普拉提/推拿/艾灸）
  - `coachId`: 教练ID
  - `search`: 搜索关键词

### 获取课程详情
- **GET** `/courses/{id}`
- **描述**: 获取课程详情

### 创建课程（管理员）
- **POST** `/courses`
- **描述**: 创建课程
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
```json
{
  "name": "课程名称",
  "category": "课程分类",
  "duration": 60,
  "capacity": 10,
  "price": 120,
  "coach_id": 1,
  "coach_name": "教练姓名",
  "description": "课程描述",
  "cover_image": "封面图片URL"
}
```

## 排课相关

### 获取排课列表
- **GET** `/schedules`
- **描述**: 获取排课列表
- **参数**:
  - `page`: 页码，默认1
  - `limit`: 每页数量，默认10
  - `date`: 日期筛选
  - `courseId`: 课程ID
  - `coachId`: 教练ID
  - `status`: 状态筛选

### 获取排课详情
- **GET** `/schedules/{id}`
- **描述**: 获取排课详情

### 创建排课（管理员）
- **POST** `/schedules`
- **描述**: 创建排课
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
```json
{
  "course_id": 1,
  "coach_id": 1,
  "date": "2026-03-16",
  "start_time": "10:00:00",
  "end_time": "11:00:00",
  "max_capacity": 10,
  "location": "上课地点"
}
```

## 预约相关

### 获取用户预约列表
- **GET** `/bookings`
- **描述**: 获取当前用户的预约列表
- **请求头**: `Authorization: Bearer {token}`
- **参数**:
  - `page`: 页码，默认1
  - `limit`: 每页数量，默认10
  - `status`: 预约状态筛选

### 创建预约
- **POST** `/bookings`
- **描述**: 创建预约
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
```json
{
  "schedule_id": 1,
  "people_count": 1
}
```

### 取消预约
- **PUT** `/bookings/{id}/cancel`
- **描述**: 取消预约
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
```json
{
  "reason": "取消原因"
}
```

## 用户相关

### 获取当前用户信息
- **GET** `/users`
- **描述**: 获取当前用户信息
- **请求头**: `Authorization: Bearer {token}`

### 更新当前用户信息
- **PUT** `/users`
- **描述**: 更新当前用户信息
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
```json
{
  "name": "新名字",
  "avatar": "新头像URL"
}
```

### 获取教练列表
- **GET** `/users/coaches`
- **描述**: 获取教练列表
- **参数**:
  - `page`: 页码，默认1
  - `limit`: 每页数量，默认10
  - `search`: 搜索关键词

## 管理员相关

### 获取用户列表（管理员）
- **GET** `/admin/users`
- **描述**: 获取用户列表
- **请求头**: `Authorization: Bearer {token}`

### 获取课程列表（管理员）
- **GET** `/admin/courses`
- **描述**: 获取课程列表
- **请求头**: `Authorization: Bearer {token}`

### 获取排课列表（管理员）
- **GET** `/admin/schedules`
- **描述**: 获取排课列表
- **请求头**: `Authorization: Bearer {token}`

## 错误码

- `400`: 请求参数错误
- `401`: 未认证或认证失败
- `403`: 无权限操作
- `404`: 资源不存在
- `429`: 请求过于频繁
- `500`: 服务器内部错误
- `503`: 服务不可用

## 注意事项

1. 所有需要认证的接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. 请求体数据应为JSON格式
3. 日期格式为 `YYYY-MM-DD`
4. 时间格式为 `HH:mm:ss`
5. 所有价格字段单位为元，使用小数形式