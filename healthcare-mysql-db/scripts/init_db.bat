@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo Database Initialization Script
echo =============================
echo.

cd /d "%~dp0..\\docker"

echo [INFO] Initializing database with all tables and data...

:: Create all tables
echo [INFO] Creating users table...
docker-compose exec -T mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db -e "
CREATE TABLE IF NOT EXISTS users (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"

echo [INFO] Creating meal_master table...
docker-compose exec -T mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db -e "
CREATE TABLE IF NOT EXISTS meal_master (
    meal_id INT AUTO_INCREMENT PRIMARY KEY,
    meal_name VARCHAR(100) NOT NULL,
    meal_name_en VARCHAR(100),
    category ENUM('breakfast', 'lunch', 'dinner', 'snack', 'drink') NOT NULL,
    cuisine_type VARCHAR(50),
    calories_per_100g INT NOT NULL,
    protein_per_100g DECIMAL(5,2),
    fat_per_100g DECIMAL(5,2),
    carbohydrate_per_100g DECIMAL(5,2),
    fiber_per_100g DECIMAL(5,2),
    sugar_per_100g DECIMAL(5,2),
    sodium_per_100g DECIMAL(8,2),
    typical_serving_size DECIMAL(6,2) DEFAULT 100.00,
    allergens JSON,
    preparation_time_minutes INT,
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    recipe_url VARCHAR(255),
    image_url VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"

echo [INFO] Creating exercise_master table...
docker-compose exec -T mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db -e "
CREATE TABLE IF NOT EXISTS exercise_master (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_name VARCHAR(100) NOT NULL,
    exercise_name_en VARCHAR(100),
    category ENUM('cardio', 'strength', 'flexibility', 'sports', 'daily_activity') NOT NULL,
    subcategory VARCHAR(50),
    met_value DECIMAL(4,2) NOT NULL,
    calories_per_hour_per_kg DECIMAL(6,2),
    equipment_required VARCHAR(100),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    target_muscle_groups JSON,
    description TEXT,
    instructions TEXT,
    safety_notes TEXT,
    typical_duration_minutes INT,
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"

echo [INFO] Inserting sample data...
docker-compose exec -T mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db < ../sql/data/meal_master_data.sql 2>nul
docker-compose exec -T mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db < ../sql/data/exercise_master_data.sql 2>nul

echo [INFO] Creating sample users...
docker-compose exec -T mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db -e "
INSERT IGNORE INTO users (username, email, password_hash, first_name, last_name, birth_date, gender, height, initial_weight, target_weight, daily_calorie_goal, activity_level) VALUES 
('demo_user', 'demo@healthcare.com', 'hashed_password_here', 'Demo', 'User', '1990-01-01', 'male', 175.0, 70.0, 65.0, 2200, 'moderately_active'),
('test_user', 'test@healthcare.com', 'hashed_password_here', 'Test', 'User', '1985-05-15', 'female', 160.0, 55.0, 50.0, 1800, 'lightly_active');"

echo [SUCCESS] Database initialization completed!
echo.
echo [INFO] Checking tables...
docker-compose exec mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db -e "SHOW TABLES;"

echo.
echo [INFO] Checking data counts...
docker-compose exec mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db -e "
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'meal_master', COUNT(*) FROM meal_master
UNION ALL
SELECT 'exercise_master', COUNT(*) FROM exercise_master;"

pause
