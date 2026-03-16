# 瑜伽馆课程预约系统 - 使用指南

## 项目概述

瑜伽馆课程预约系统包含前端微信小程序和后端API服务两部分，支持用户预约、教练管理、管理员后台等功能。

## 环境要求

### 系统要求
- **操作系统**: Windows 7+/macOS 10.12+/Linux
- **Node.js**: 14.x 或更高版本
- **MySQL**: 5.7 或更高版本
- **微信开发者工具**: 最新版

### 依赖软件
- Git (用于代码管理)
- MySQL数据库
- Node.js运行环境
- 微信开发者工具

## 后端部署

### 1. 环境准备
```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version
```

### 2. 项目下载
```bash
# 克隆项目
git clone <repository-url>
cd yoga-booking/src/server
```

### 3. 依赖安装
```bash
# 安装后端依赖
npm install
```

### 4. 数据库配置

#### 4.1 创建数据库
```sql
-- 连接到MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE yoga_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 退出MySQL
EXIT;
```

#### 4.2 导入表结构
```bash
# 导入数据库表结构
mysql -u root -p yoga_booking < database/schema.sql
```

### 5. 环境变量配置

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 应用配置
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=yoga_booking

# JWT密钥（重要：使用强密钥）
JWT_SECRET=your_strong_jwt_secret_key_here

# 微信配置（测试环境可使用mock数据）
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret

# 短信服务配置（如需要）
SMS_ACCESS_KEY_ID=your_sms_access_key_id
SMS_ACCESS_KEY_SECRET=your_sms_access_key_secret
SMS_TEMPLATE_CODE=your_sms_template_code
```

### 6. 启动后端服务

#### 6.1 开发模式
```bash
# 在项目根目录下
npm run dev
```

#### 6.2 生产模式
```bash
# 在项目根目录下
npm start
```

服务将运行在 `http://localhost:3000`

## 前端部署

### 1. 微信小程序配置

#### 1.1 开发者工具导入
1. 打开微信开发者工具
2. 选择"小程序项目"
3. 项目目录选择: `yoga-booking/src/miniprogram`
4. AppID: 输入您的小程序AppID

#### 1.2 服务器域名配置
在小程序管理后台配置以下域名:
- **request合法域名**: `https://localhost:3000` (开发环境)
- **socket合法域名**: 无
- **uploadFile合法域名**: 无
- **downloadFile合法域名**: 无

### 2. 前端API配置

编辑 `src/miniprogram/utils/config.js` (如存在):

```javascript
const config = {
  // API基础URL - 根据环境调整
  baseURL: 'http://localhost:3000/api', // 开发环境
  // baseURL: 'https://yourdomain.com/api', // 生产环境
  
  // 超时时间
  timeout: 10000
};

module.exports = config;
```

### 3. 运行小程序
1. 在微信开发者工具中点击"编译"
2. 确保无错误信息
3. 可以开始预览和调试

## 系统配置

### 1. 数据库初始化

首次部署需要初始化数据库:

```bash
# 确保MySQL服务运行
# 执行数据库初始化脚本
mysql -u root -p yoga_booking < database/init-data.sql  # 如有初始数据
```

### 2. 管理员账户创建

系统启动后，可通过API创建第一个管理员账户:

```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "openid": "admin_openid",
    "name": "管理员",
    "role": "admin",
    "phone": "13800138000"
  }'
```

### 3. 微信配置

如需真实微信登录功能，需配置:

1. **微信公众平台**: 获取AppID和AppSecret
2. **服务器域名**: 配置业务域名和request域名
3. **接口权限**: 确保有用户授权等相关权限

## 运行方式

### 1. 本地开发模式

#### 1.1 启动后端
```bash
cd yoga-booking/src/server
npm run dev
```

#### 1.2 启动前端
```bash
# 使用微信开发者工具打开 yoga-booking/src/miniprogram
# 或者配置代理到后端API
```

### 2. 生产环境部署

#### 2.1 使用PM2部署
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name yoga-booking-api --env production

# 设置开机自启
pm2 startup
pm2 save
```

#### 2.2 Nginx反向代理配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location / {
        # 小程序静态文件服务或转发到前端服务器
        root /path/to/your/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## 环境变量说明

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| NODE_ENV | 运行环境 | development | 否 |
| PORT | 服务端口 | 3000 | 否 |
| FRONTEND_URL | 前端地址 | http://localhost:8080 | 否 |
| DB_HOST | 数据库主机 | localhost | 是 |
| DB_PORT | 数据库端口 | 3306 | 否 |
| DB_USER | 数据库用户 | root | 是 |
| DB_PASSWORD | 数据库密码 | - | 是 |
| DB_NAME | 数据库名 | yoga_booking | 是 |
| JWT_SECRET | JWT密钥 | - | 是 |
| WECHAT_APP_ID | 微信AppID | - | 否 |
| WECHAT_APP_SECRET | 微信AppSecret | - | 否 |

## 常见问题

### 1. 数据库连接失败
- 检查MySQL服务是否运行
- 确认数据库配置信息正确
- 检查防火墙设置

### 2. API调用失败
- 确认后端服务已启动
- 检查前端API地址配置
- 确认跨域设置正确

### 3. 微信登录失败
- 检查AppID和AppSecret配置
- 确认服务器域名配置
- 检查网络连通性

### 4. 权限问题
- 确认管理员账户已创建
- 检查角色权限设置
- 验证JWT令牌有效性

## 维护指南

### 1. 日志查看
```bash
# PM2日志
pm2 logs yoga-booking-api

# 查看应用状态
pm2 status yoga-booking-api
```

### 2. 数据库备份
```bash
# 备份数据库
mysqldump -u root -p yoga_booking > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3. 服务重启
```bash
# 重启服务
pm2 restart yoga-booking-api

# 停止服务
pm2 stop yoga-booking-api
```

## 版本升级

### 1. 代码更新
```bash
# 拉取最新代码
git pull origin master

# 安装新依赖
npm install

# 如有数据库变更，执行迁移
# mysql -u root -p yoga_booking < migrations/v1_to_v2.sql

# 重启服务
pm2 restart yoga-booking-api
```

---
**文档版本**: v1.0  
**更新日期**: 2026-03-16  
**维护人员**: @coder