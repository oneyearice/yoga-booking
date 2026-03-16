# 瑜伽馆课程预约系统

## 项目简介
为瑜伽/普拉提/推拿/艾灸馆开发的微信小程序，实现课程预约、排课管理功能。

## 项目结构
```
projects/yoga-booking/
├── README.md           # 使用说明
├── DESIGN.md           # 设计文档
├── STATUS.md           # 项目状态跟踪
├── BRIEF.md            # 需求文档
├── tests/              # 测试报告
└── src/
    └── miniprogram/    # 小程序前端源码
        ├── app.js
        ├── app.json
        ├── app.wxss
        ├── sitemap.json
        ├── pages/
        │   ├── index/          # 首页
        │   ├── courses/        # 课程相关页面
        │   ├── booking/        # 预约相关页面
        │   ├── user/           # 用户相关页面
        │   ├── coach/          # 教练相关页面
        │   └── admin/          # 管理员相关页面
        └── images/             # 图片资源
```

## 功能模块

### 用户端功能
- 首页 (pages/index/index) - 基础框架
- 课程列表 (pages/courses/list) - 课程浏览与筛选
- 课程详情 (pages/courses/detail) - 课程信息与时间选择
- 预约确认 (pages/booking/confirm) - 预约信息填写与确认
- 个人中心 (pages/user/index) - 用户信息与功能入口
- 我的预约 (pages/booking/list) - 预约列表与管理
- 我的预约 (pages/user/bookings) - 用户端预约管理

### 教练端功能
- 我的课表 (pages/coach/schedule) - 课程安排与时间管理
- 学员名单 (pages/coach/students) - 学员信息与联系

### 管理员端功能
- 课程管理 (pages/admin/courses) - 课程信息维护
- 排课管理 (pages/admin/schedule) - 课程安排与调度
- 用户管理 (pages/admin/users) - 用户信息与权限管理

## 使用方式

### 开发环境搭建
1. 安装微信开发者工具
2. 打开项目目录 `src/miniprogram/`
3. 配置AppID（测试用）

### 后端服务部署
1. 进入后端目录: `cd src/server/`
2. 安装依赖: `npm install`
3. 配置数据库连接
4. 启动服务: `npm start`

### 详细部署说明
参考 `USAGE_GUIDE.md` 文件获取完整的部署和配置说明。

## 技术栈
- 前端：原生微信小程序
- 后端：Node.js + Express + MySQL
- 认证：JWT + 微信登录

## 当前状态
- 前端页面开发完成
- 后端API开发完成
- 数据库设计完成
- 系统集成验证完成
- 等待测试验证

## 文档资源
- API接口文档: `API.md`
- 接口映射文档: `Frontend_API_Map.md`
- UI设计指南: `UI_DESIGN_GUIDE.md`
- 自测报告: `tests/SELFTEST_REPORT.md`
- 使用指南: `USAGE_GUIDE.md`
- 部署文档: `DEPLOYMENT.md`

## 注意事项
- 项目当前使用mock数据演示功能
- 真实数据交互需等待后端API开发完成
- 需要微信小程序账号进行真机测试