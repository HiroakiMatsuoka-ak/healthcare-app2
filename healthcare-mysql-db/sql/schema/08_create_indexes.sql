-- Indexes and Performance Optimization
-- インデックスとパフォーマンス最適化

USE healthcare_db;

-- 複合インデックスの追加（よく使用されるクエリパターン用）

-- ユーザーの日付範囲での食事記録検索用
CREATE INDEX idx_user_meals_date_range ON user_meals(user_id, meal_date, meal_category);

-- ユーザーの日付範囲での運動記録検索用
CREATE INDEX idx_user_exercises_date_range ON user_exercises(user_id, exercise_date, intensity);

-- カロリー計算用インデックス
CREATE INDEX idx_user_meals_calories ON user_meals(user_id, meal_date, actual_calories);
CREATE INDEX idx_user_exercises_calories ON user_exercises(user_id, exercise_date, calories_burned);

-- 食事マスターの栄養素検索用
CREATE INDEX idx_meal_master_nutrition ON meal_master(calories_per_100g, protein_per_100g, category);

-- 運動マスターのMETs検索用
CREATE INDEX idx_exercise_master_mets ON exercise_master(category, met_value, difficulty_level);

-- 体重記録の推移検索用
CREATE INDEX idx_weight_records_trend ON weight_records(user_id, record_date, weight);

-- 全文検索インデックス（食事名・運動名検索用）
CREATE FULLTEXT INDEX idx_meal_name_fulltext ON meal_master(meal_name, description);
CREATE FULLTEXT INDEX idx_exercise_name_fulltext ON exercise_master(exercise_name, description);

-- 統計データ取得用ビュー
CREATE VIEW user_daily_summary AS
SELECT 
    u.user_id,
    u.username,
    DATE(um.meal_date) as summary_date,
    COALESCE(SUM(um.actual_calories), 0) as total_calories_consumed,
    COALESCE(SUM(ue.calories_burned), 0) as total_calories_burned,
    COALESCE(SUM(um.actual_protein), 0) as total_protein,
    COALESCE(SUM(um.actual_fat), 0) as total_fat,
    COALESCE(SUM(um.actual_carbohydrate), 0) as total_carbohydrate,
    COUNT(DISTINCT um.record_id) as meals_count,
    COUNT(DISTINCT ue.record_id) as exercises_count,
    wr.weight as daily_weight,
    wr.bmi as daily_bmi
FROM users u
LEFT JOIN user_meals um ON u.user_id = um.user_id
LEFT JOIN user_exercises ue ON u.user_id = ue.user_id AND DATE(ue.exercise_date) = DATE(um.meal_date)
LEFT JOIN weight_records wr ON u.user_id = wr.user_id AND wr.record_date = DATE(um.meal_date)
WHERE u.is_active = TRUE
GROUP BY u.user_id, u.username, DATE(um.meal_date), wr.weight, wr.bmi;

-- 週間サマリービュー
CREATE VIEW user_weekly_summary AS
SELECT 
    user_id,
    YEAR(summary_date) as year,
    WEEK(summary_date) as week,
    AVG(total_calories_consumed) as avg_calories_consumed,
    AVG(total_calories_burned) as avg_calories_burned,
    AVG(total_protein) as avg_protein,
    AVG(total_fat) as avg_fat,
    AVG(total_carbohydrate) as avg_carbohydrate,
    SUM(meals_count) as total_meals,
    SUM(exercises_count) as total_exercises,
    AVG(daily_weight) as avg_weight,
    AVG(daily_bmi) as avg_bmi
FROM user_daily_summary
WHERE summary_date IS NOT NULL
GROUP BY user_id, YEAR(summary_date), WEEK(summary_date);

-- 月間サマリービュー
CREATE VIEW user_monthly_summary AS
SELECT 
    user_id,
    YEAR(summary_date) as year,
    MONTH(summary_date) as month,
    AVG(total_calories_consumed) as avg_calories_consumed,
    AVG(total_calories_burned) as avg_calories_burned,
    AVG(total_protein) as avg_protein,
    AVG(total_fat) as avg_fat,
    AVG(total_carbohydrate) as avg_carbohydrate,
    SUM(meals_count) as total_meals,
    SUM(exercises_count) as total_exercises,
    AVG(daily_weight) as avg_weight,
    AVG(daily_bmi) as avg_bmi,
    MIN(daily_weight) as min_weight,
    MAX(daily_weight) as max_weight
FROM user_daily_summary
WHERE summary_date IS NOT NULL
GROUP BY user_id, YEAR(summary_date), MONTH(summary_date);
