-- 瑜伽馆课程预约系统数据库设计
-- 数据库：MySQL

-- 用户表 (users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(50) UNIQUE NOT NULL COMMENT '微信openid',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    name VARCHAR(100) NOT NULL COMMENT '用户姓名',
    avatar VARCHAR(255) COMMENT '头像URL',
    credit_balance INT DEFAULT 0 COMMENT '课时余额',
    role ENUM('user', 'coach', 'admin') DEFAULT 'user' COMMENT '用户角色',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_openid (openid),
    INDEX idx_phone (phone),
    INDEX idx_role (role)
);

-- 课程表 (courses)
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '课程名称',
    category VARCHAR(50) NOT NULL COMMENT '课程分类：瑜伽/普拉提/推拿/艾灸',
    duration INT NOT NULL COMMENT '课程时长（分钟）',
    capacity INT NOT NULL COMMENT '课程容量（人数）',
    price DECIMAL(10,2) NOT NULL COMMENT '课程价格',
    coach_id INT NOT NULL COMMENT '教练ID',
    coach_name VARCHAR(100) NOT NULL COMMENT '教练姓名',
    description TEXT COMMENT '课程描述',
    cover_image VARCHAR(255) COMMENT '封面图片URL',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '课程状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_coach_id (coach_id),
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- 排课表 (schedules)
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL COMMENT '课程ID',
    coach_id INT NOT NULL COMMENT '教练ID',
    date DATE NOT NULL COMMENT '排课日期',
    start_time TIME NOT NULL COMMENT '开始时间',
    end_time TIME NOT NULL COMMENT '结束时间',
    max_capacity INT NOT NULL COMMENT '最大容量',
    booked_count INT DEFAULT 0 COMMENT '已预约人数',
    location VARCHAR(100) COMMENT '上课地点',
    status ENUM('active', 'cancelled', 'full') DEFAULT 'active' COMMENT '排课状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_course_id (course_id),
    INDEX idx_coach_id (coach_id),
    INDEX idx_date (date),
    INDEX idx_datetime (date, start_time, end_time)
);

-- 预约表 (bookings)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '用户ID',
    schedule_id INT NOT NULL COMMENT '排课ID',
    course_id INT NOT NULL COMMENT '课程ID',
    booking_date DATE NOT NULL COMMENT '预约日期',
    booking_time DATETIME NOT NULL COMMENT '预约时间',
    people_count INT DEFAULT 1 COMMENT '预约人数',
    booking_status ENUM('confirmed', 'pending', 'cancelled', 'completed') DEFAULT 'confirmed' COMMENT '预约状态',
    cancel_time DATETIME NULL COMMENT '取消时间',
    cancel_reason VARCHAR(255) COMMENT '取消原因',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_course_id (course_id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (booking_status)
);

-- 课时记录表 (credit_records)
CREATE TABLE credit_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '用户ID',
    type ENUM('purchase', 'deduction', 'adjustment', 'refund') NOT NULL COMMENT '记录类型',
    amount INT NOT NULL COMMENT '变动数量',
    balance_after INT NOT NULL COMMENT '变动后余额',
    reason VARCHAR(255) COMMENT '变动原因',
    related_id INT COMMENT '关联ID（如预约ID）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

-- 教练课时统计表 (coach_hours)
CREATE TABLE coach_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coach_id INT NOT NULL COMMENT '教练ID',
    date DATE NOT NULL COMMENT '日期',
    class_count INT DEFAULT 0 COMMENT '上课节数',
    student_count INT DEFAULT 0 COMMENT '上课学员总数',
    hours_worked DECIMAL(4,2) DEFAULT 0.00 COMMENT '工作小时数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_coach_id (coach_id),
    INDEX idx_date (date)
);

-- 添加外键约束
ALTER TABLE schedules ADD FOREIGN KEY (course_id) REFERENCES courses(id);
ALTER TABLE bookings ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE bookings ADD FOREIGN KEY (schedule_id) REFERENCES schedules(id);
ALTER TABLE bookings ADD FOREIGN KEY (course_id) REFERENCES courses(id);
ALTER TABLE credit_records ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE coach_hours ADD FOREIGN KEY (coach_id) REFERENCES users(id);