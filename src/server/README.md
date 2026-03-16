# 瑜伽馆课程预约系统 - 后端服务

## 项目简介

瑜伽馆课程预约系统后端服务，基于 Node.js + Express + MySQL 构建，提供完整的课程预约管理功能。

## 技术栈

- **运行环境**: Node.js 14+
- **框架**: Express.js
- **数据库**: MySQL
- **ORM**: Sequelize
- **认证**: JWT
- **密码加密**: bcryptjs
- **输入验证**: Joi
- **文件上传**: Multer
- **安全防护**: Helmet, Rate Limiting

## 功能特性

### 用户管理
- 微信一键登录
- 手机号绑定
- 个人信息管理
- 课时余额管理

### 课程管理
- 课程分类（瑜伽/普拉提/推拿/艾灸）
- 课程详情管理
- 教练关联
- 课程搜索与筛选

### 排课管理
- 手动排课
- 自动排课
- 时间冲突检测
- 课程容量控制

### 预约管理
- 课程预约
- 预约取消（3小时规则）
- 时间冲突检测
- 预约状态管理
- 候补功能

### 角色权限
- **用户**: 预约课程、查看个人预约
- **教练**: 查看课表、学员名单、课程管理
- **管理员**: 课程管理、排课管理、用户管理、数据统计

## API文档

详细API文档请参见 [API.md](./API.md)

## 项目结构

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

## 数据库设计

数据库设计包含以下主要表：

- **users**: 用户表（openid、手机号、姓名、角色等）
- **courses**: 课程表（名称、分类、时长、价格、教练等）
- **schedules**: 排课表（课程、时间、容量、已预约数等）
- **bookings**: 预约表（用户、排课、状态、时间等）
- **credit_records**: 课时记录表（变动类型、数量、原因等）

详细表结构请参见 `database/schema.sql`

## 安装部署

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd yoga-booking/src/server

# 安装依赖
npm install
```

### 2. 数据库配置

```sql
-- 创建数据库
CREATE DATABASE yoga_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 导入表结构
mysql -u root -p yoga_booking < database/schema.sql
```

### 3. 环境变量配置

复制 `.env.example` 为 `.env` 并填入实际值：

```bash
cp .env.example .env
```

### 4. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 环境变量

| 变量 | 描述 | 是否必需 |
|------|------|----------|
| NODE_ENV | 运行环境 | 否 |
| PORT | 服务端口 | 否 |
| DB_HOST | 数据库主机 | 是 |
| DB_PORT | 数据库端口 | 否 |
| DB_USER | 数据库用户 | 是 |
| DB_PASSWORD | 数据库密码 | 是 |
| DB_NAME | 数据库名 | 是 |
| JWT_SECRET | JWT密钥 | 是 |

## 错误处理

系统实现了完善的错误处理机制：
- 参数验证错误
- 认证授权错误
- 数据库操作错误
- 业务逻辑错误
- 服务器内部错误

## 安全措施

- JWT认证和授权
- 输入数据验证
- SQL注入防护
- XSS防护
- 请求频率限制
- 敏感信息脱敏

## 性能优化

- 数据库索引优化
- 查询缓存
- 连接池管理
- 静态资源压缩
- API响应缓存

## 测试

```bash
# 运行测试
npm test
```

## 部署

详细部署指南请参见 [DEPLOYMENT.md](./DEPLOYMENT.md)

## API调用示例

### 微信登录
```javascript
fetch('/api/auth/login/wechat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: 'wx_login_code'
  })
})
```

### 获取课程列表
```javascript
fetch('/api/courses?page=1&limit=10&category=瑜伽')
  .then(response => response.json())
```

### 创建预约
```javascript
fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    schedule_id: 1,
    people_count: 1
  })
})
```

## 贡献

欢迎提交Issue和Pull Request。

## 许可证

MIT License