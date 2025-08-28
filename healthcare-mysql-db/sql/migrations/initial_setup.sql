-- Initial Setup Script
-- 初期データベースセットアップ用スクリプト

-- 文字セットの設定
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

-- データベースの作成と使用
CREATE DATABASE IF NOT EXISTS healthcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE healthcare_db;

-- 既存テーブルの削除（開発環境用）
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS user_exercises;
DROP TABLE IF EXISTS user_meals;
DROP TABLE IF EXISTS weight_records;
DROP TABLE IF EXISTS exercise_master;
DROP TABLE IF EXISTS meal_master;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 管理用ユーザーの作成
CREATE USER IF NOT EXISTS 'healthcare_admin'@'%' IDENTIFIED BY 'admin_pass_2025';
GRANT ALL PRIVILEGES ON healthcare_db.* TO 'healthcare_admin'@'%';

-- 読み取り専用ユーザーの作成
CREATE USER IF NOT EXISTS 'healthcare_readonly'@'%' IDENTIFIED BY 'readonly_pass_2025';
GRANT SELECT ON healthcare_db.* TO 'healthcare_readonly'@'%';

-- 権限の反映
FLUSH PRIVILEGES;

-- サンプルデータ作成用のテンポラリユーザー
INSERT INTO users (
    username, email, password_hash, first_name, last_name, birth_date, gender, 
    height, initial_weight, target_weight, daily_calorie_goal, activity_level
) VALUES 
('demo_user', 'demo@healthcare.com', 'hashed_password_here', 'デモ', 'ユーザー', '1990-01-01', 'male', 175.0, 70.0, 65.0, 2200, 'moderately_active'),
('test_user', 'test@healthcare.com', 'hashed_password_here', 'テスト', 'ユーザー', '1985-05-15', 'female', 160.0, 55.0, 50.0, 1800, 'lightly_active');

-- サンプル体重データ
INSERT INTO weight_records (user_id, record_date, weight, body_fat_percentage) VALUES
(1, CURDATE() - INTERVAL 30 DAY, 70.5, 15.2),
(1, CURDATE() - INTERVAL 25 DAY, 70.2, 15.0),
(1, CURDATE() - INTERVAL 20 DAY, 69.8, 14.8),
(1, CURDATE() - INTERVAL 15 DAY, 69.5, 14.5),
(1, CURDATE() - INTERVAL 10 DAY, 69.0, 14.2),
(1, CURDATE() - INTERVAL 5 DAY, 68.5, 14.0),
(1, CURDATE(), 68.0, 13.8),
(2, CURDATE() - INTERVAL 30 DAY, 55.2, 22.0),
(2, CURDATE() - INTERVAL 25 DAY, 54.8, 21.8),
(2, CURDATE() - INTERVAL 20 DAY, 54.5, 21.5),
(2, CURDATE() - INTERVAL 15 DAY, 54.0, 21.2),
(2, CURDATE() - INTERVAL 10 DAY, 53.5, 21.0),
(2, CURDATE() - INTERVAL 5 DAY, 53.0, 20.8),
(2, CURDATE(), 52.8, 20.5);

-- サンプル食事データ
INSERT INTO user_meals (user_id, meal_id, meal_date, meal_time, serving_size, actual_calories, meal_category, notes) VALUES
(1, 1, CURDATE(), '07:30:00', 150, 252, 'breakfast', '朝食の白米'),
(1, 6, CURDATE(), '07:35:00', 100, 151, 'breakfast', '朝食の卵焼き'),
(1, 11, CURDATE(), '12:30:00', 350, 473, 'lunch', '昼食の牛丼'),
(1, 22, CURDATE(), '19:00:00', 120, 166, 'dinner', '夕食の焼き魚'),
(2, 4, CURDATE(), '07:00:00', 60, 148, 'breakfast', '朝食の全粒粉パン'),
(2, 10, CURDATE(), '07:05:00', 100, 62, 'breakfast', '朝食のヨーグルト'),
(2, 18, CURDATE(), '12:00:00', 120, 280, 'lunch', '昼食のサンドイッチ'),
(2, 24, CURDATE(), '18:30:00', 150, 335, 'dinner', '夕食のハンバーグ');

-- サンプル運動データ
INSERT INTO user_exercises (user_id, exercise_id, exercise_date, start_time, duration_minutes, intensity, calories_burned, notes) VALUES
(1, 1, CURDATE(), '06:00:00', 30, 'moderate', 210, '朝のウォーキング'),
(1, 11, CURDATE(), '20:00:00', 15, 'moderate', 95, '夜の腕立て伏せ'),
(2, 3, CURDATE() - INTERVAL 1 DAY, '18:00:00', 25, 'moderate', 154, 'ジョギング'),
(2, 13, CURDATE(), '19:30:00', 20, 'low', 66, 'スクワット');

-- データベースの状態確認
SELECT 'Users created' as status, COUNT(*) as count FROM users;
SELECT 'Meal master records' as status, COUNT(*) as count FROM meal_master;
SELECT 'Exercise master records' as status, COUNT(*) as count FROM exercise_master;
SELECT 'Weight records' as status, COUNT(*) as count FROM weight_records;
SELECT 'User meals' as status, COUNT(*) as count FROM user_meals;
SELECT 'User exercises' as status, COUNT(*) as count FROM user_exercises;
