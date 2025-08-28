-- Users Table
-- ユーザー基本情報テーブル

USE healthcare_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    height DECIMAL(5,2) NOT NULL COMMENT '身長(cm)',
    initial_weight DECIMAL(5,2) NOT NULL COMMENT '初期体重(kg)',
    target_weight DECIMAL(5,2) COMMENT '目標体重(kg)',
    daily_calorie_goal INT COMMENT '1日の目標カロリー摂取量',
    activity_level ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active') DEFAULT 'lightly_active',
    profile_image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='ユーザー基本情報テーブル';
