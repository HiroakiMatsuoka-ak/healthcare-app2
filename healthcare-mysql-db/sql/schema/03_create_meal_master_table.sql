-- Meal Master Table
-- 食事メニューマスターテーブル

USE healthcare_db;

CREATE TABLE meal_master (
    meal_id INT AUTO_INCREMENT PRIMARY KEY,
    meal_name VARCHAR(100) NOT NULL,
    meal_name_en VARCHAR(100),
    category ENUM('breakfast', 'lunch', 'dinner', 'snack', 'drink') NOT NULL,
    cuisine_type VARCHAR(50) COMMENT '料理の種類（和食、洋食、中華等）',
    calories_per_100g INT NOT NULL COMMENT '100gあたりのカロリー',
    protein_per_100g DECIMAL(5,2) COMMENT '100gあたりのタンパク質(g)',
    fat_per_100g DECIMAL(5,2) COMMENT '100gあたりの脂質(g)',
    carbohydrate_per_100g DECIMAL(5,2) COMMENT '100gあたりの炭水化物(g)',
    fiber_per_100g DECIMAL(5,2) COMMENT '100gあたりの食物繊維(g)',
    sugar_per_100g DECIMAL(5,2) COMMENT '100gあたりの糖質(g)',
    sodium_per_100g DECIMAL(8,2) COMMENT '100gあたりのナトリウム(mg)',
    typical_serving_size DECIMAL(6,2) DEFAULT 100.00 COMMENT '一般的な一人前の量(g)',
    allergens JSON COMMENT 'アレルゲン情報',
    preparation_time_minutes INT COMMENT '調理時間（分）',
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    recipe_url VARCHAR(255) COMMENT 'レシピURL',
    image_url VARCHAR(255) COMMENT '画像URL',
    description TEXT COMMENT '食事の説明',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_meal_name (meal_name),
    INDEX idx_category (category),
    INDEX idx_cuisine_type (cuisine_type),
    INDEX idx_calories (calories_per_100g),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='食事メニューマスターテーブル';
