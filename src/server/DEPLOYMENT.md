# 部署指南

## 环境要求

- Node.js >= 14.x
- MySQL >= 5.7 或 MariaDB >= 10.2
- Redis (可选，用于会话管理)

## 部署步骤

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

编辑 `.env` 文件：

```env
# 应用配置
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=yoga_booking

# JWT密钥（重要：使用强密钥）
JWT_SECRET=your_strong_jwt_secret_key_here

# 微信配置
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret

# 短信服务配置
SMS_ACCESS_KEY_ID=your_sms_access_key_id
SMS_ACCESS_KEY_SECRET=your_sms_access_key_secret
SMS_TEMPLATE_CODE=your_sms_template_code

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880  # 5MB
```

### 4. 启动服务

#### 开发模式
```bash
npm run dev
```

#### 生产模式
```bash
npm start
```

#### 使用PM2部署
```bash
# 安装pm2
npm install -g pm2

# 启动应用
pm2 start server.js --name yoga-booking-api

# 设置开机自启
pm2 startup
pm2 save
```

### 5. Nginx反向代理配置

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
}
```

## 安全配置

### SSL证书
使用Let's Encrypt获取SSL证书：

```bash
sudo certbot --nginx -d your-domain.com
```

### 数据库安全
- 不使用root账户，创建专用数据库用户
- 限制数据库用户权限
- 定期备份数据库

## 监控和日志

### 日志配置
应用会自动记录访问日志和错误日志到 `logs/` 目录。

### PM2监控
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs yoga-booking-api

# 监控资源使用
pm2 monit
```

## 备份策略

### 数据库备份
```bash
# 备份脚本示例
mysqldump -u username -p yoga_booking > backup_yoga_booking_$(date +%F).sql
```

### 文件备份
定期备份上传文件目录和配置文件。

## 性能优化

### 数据库优化
- 为常用查询字段建立索引
- 定期清理过期数据
- 使用连接池管理数据库连接

### 应用优化
- 使用Redis缓存热点数据
- 配置CDN加速静态资源
- 启用Gzip压缩

## 故障排查

### 常见问题
1. **数据库连接失败**: 检查数据库服务状态和配置
2. **JWT认证失败**: 检查JWT密钥配置
3. **API响应慢**: 检查数据库查询和网络状况

### 调试模式
设置 `NODE_ENV=development` 可以获得更详细的错误信息。

## 版本升级

### 停机升级
```bash
# 停止服务
pm2 stop yoga-booking-api

# 拉取最新代码
git pull origin master

# 安装新依赖
npm install

# 如有数据库变更，执行迁移
# mysql -u username -p yoga_booking < migrations/v1_to_v2.sql

# 启动服务
pm2 start yoga-booking-api
```

### 零停机升级
使用PM2集群模式：

```bash
pm2 start server.js -i max --name yoga-booking-api
pm2 reload yoga-booking-api
```

## 环境变量详解

| 变量 | 描述 | 默认值 |
|------|------|--------|
| NODE_ENV | 运行环境 | development |
| PORT | 服务端口 | 3000 |
| FRONTEND_URL | 前端域名 | http://localhost:8080 |
| DB_HOST | 数据库主机 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_USER | 数据库用户 | root |
| DB_PASSWORD | 数据库密码 | password |
| DB_NAME | 数据库名 | yoga_booking |
| JWT_SECRET | JWT密钥 | yoga_booking_secret_key |