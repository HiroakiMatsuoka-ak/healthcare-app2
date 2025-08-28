-- User Exercises Table
-- ユーザー運動記録テーブル

USE healthcare_db;

CREATE TABLE user_exercises (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    exercise_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL COMMENT '運動時間（分）',
    intensity ENUM('low', 'moderate', 'high', 'very_high') DEFAULT 'moderate',
    calories_burned INT NOT NULL COMMENT '消費カロリー',
    distance DECIMAL(8,2) COMMENT '距離（km）※ランニング等の場合',
    sets_count INT COMMENT 'セット数（筋トレの場合）',
    reps_per_set JSON COMMENT '各セットの回数（筋トレの場合）',
    weight_used DECIMAL(6,2) COMMENT '使用重量(kg)（筋トレの場合）',
    heart_rate_avg INT COMMENT '平均心拍数',
    heart_rate_max INT COMMENT '最大心拍数',
    location VARCHAR(100) COMMENT '運動場所',
    weather VARCHAR(50) COMMENT '天候（屋外運動の場合）',
    notes TEXT COMMENT 'メモ・感想',
    effort_rating TINYINT COMMENT '運動強度の主観評価（1-10）',
    enjoyment_rating TINYINT COMMENT '楽しさ評価（1-5）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercise_master(exercise_id) ON DELETE RESTRICT,
    
    INDEX idx_user_exercise_date (user_id, exercise_date),
    INDEX idx_exercise_date (exercise_date),
    INDEX idx_intensity (intensity),
    INDEX idx_created_at (created_at),
    
    CONSTRAINT chk_effort_rating CHECK (effort_rating BETWEEN 1 AND 10),
    CONSTRAINT chk_enjoyment_rating CHECK (enjoyment_rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='ユーザー運動記録テーブル';
