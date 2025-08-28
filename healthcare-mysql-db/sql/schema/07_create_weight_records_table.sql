-- Weight Records Table
-- 体重記録テーブル

USE healthcare_db;

CREATE TABLE weight_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    record_date DATE NOT NULL,
    record_time TIME DEFAULT '07:00:00',
    weight DECIMAL(5,2) NOT NULL COMMENT '体重(kg)',
    body_fat_percentage DECIMAL(4,1) COMMENT '体脂肪率(%)',
    muscle_mass DECIMAL(5,2) COMMENT '筋肉量(kg)',
    bmi DECIMAL(4,2) COMMENT 'BMI（自動計算）',
    measurement_method ENUM('scale', 'manual', 'estimated') DEFAULT 'scale',
    notes TEXT COMMENT 'メモ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_date_time (user_id, record_date, record_time),
    INDEX idx_user_record_date (user_id, record_date),
    INDEX idx_record_date (record_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='体重記録テーブル';

-- BMI自動計算のトリガー
DELIMITER $$

CREATE TRIGGER calculate_bmi_before_insert
BEFORE INSERT ON weight_records
FOR EACH ROW
BEGIN
    DECLARE user_height DECIMAL(5,2);
    
    SELECT height INTO user_height 
    FROM users 
    WHERE user_id = NEW.user_id;
    
    IF user_height > 0 THEN
        SET NEW.bmi = NEW.weight / POWER(user_height / 100, 2);
    END IF;
END$$

CREATE TRIGGER calculate_bmi_before_update
BEFORE UPDATE ON weight_records
FOR EACH ROW
BEGIN
    DECLARE user_height DECIMAL(5,2);
    
    SELECT height INTO user_height 
    FROM users 
    WHERE user_id = NEW.user_id;
    
    IF user_height > 0 THEN
        SET NEW.bmi = NEW.weight / POWER(user_height / 100, 2);
    END IF;
END$$

DELIMITER ;
