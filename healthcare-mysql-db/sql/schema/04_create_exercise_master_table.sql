-- Exercise Master Table
-- 運動メニューマスターテーブル

USE healthcare_db;

CREATE TABLE exercise_master (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_name VARCHAR(100) NOT NULL,
    exercise_name_en VARCHAR(100),
    category ENUM('cardio', 'strength', 'flexibility', 'sports', 'daily_activity') NOT NULL,
    subcategory VARCHAR(50) COMMENT '運動のサブカテゴリ（ランニング、筋トレ等）',
    met_value DECIMAL(4,2) NOT NULL COMMENT 'METs値（代謝当量）',
    calories_per_hour_per_kg DECIMAL(6,2) COMMENT '体重1kgあたり1時間の消費カロリー',
    equipment_required VARCHAR(100) COMMENT '必要な器具',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    target_muscle_groups JSON COMMENT '対象筋肉群',
    description TEXT COMMENT '運動の説明',
    instructions TEXT COMMENT '実施方法',
    safety_notes TEXT COMMENT '安全上の注意',
    typical_duration_minutes INT COMMENT '一般的な実施時間（分）',
    image_url VARCHAR(255) COMMENT '画像URL',
    video_url VARCHAR(255) COMMENT 'デモ動画URL',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_exercise_name (exercise_name),
    INDEX idx_category (category),
    INDEX idx_subcategory (subcategory),
    INDEX idx_met_value (met_value),
    INDEX idx_difficulty_level (difficulty_level),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='運動メニューマスターテーブル';
