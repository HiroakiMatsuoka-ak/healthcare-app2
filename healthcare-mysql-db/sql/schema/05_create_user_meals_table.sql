-- User Meals Table
-- ユーザー食事記録テーブル

USE healthcare_db;

CREATE TABLE user_meals (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_id INT NOT NULL,
    meal_date DATE NOT NULL,
    meal_time TIME NOT NULL,
    serving_size DECIMAL(6,2) NOT NULL COMMENT '摂取量(g)',
    actual_calories INT NOT NULL COMMENT '実際の摂取カロリー',
    actual_protein DECIMAL(6,2) COMMENT '実際のタンパク質摂取量(g)',
    actual_fat DECIMAL(6,2) COMMENT '実際の脂質摂取量(g)',
    actual_carbohydrate DECIMAL(6,2) COMMENT '実際の炭水化物摂取量(g)',
    meal_category ENUM('breakfast', 'lunch', 'dinner', 'snack', 'drink') NOT NULL,
    notes TEXT COMMENT 'メモ・感想',
    satisfaction_rating TINYINT COMMENT '満足度評価（1-5）',
    image_url VARCHAR(255) COMMENT '食事写真URL',
    location VARCHAR(100) COMMENT '食事場所',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (meal_id) REFERENCES meal_master(meal_id) ON DELETE RESTRICT,
    
    INDEX idx_user_meal_date (user_id, meal_date),
    INDEX idx_meal_date (meal_date),
    INDEX idx_meal_category (meal_category),
    INDEX idx_created_at (created_at),
    
    CONSTRAINT chk_satisfaction_rating CHECK (satisfaction_rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='ユーザー食事記録テーブル';
