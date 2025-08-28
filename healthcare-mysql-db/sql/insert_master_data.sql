-- Master Data Insertion for Current Table Structure
-- 現在のテーブル構造に合わせたマスターデータ挿入

USE healthcare_db;

-- 食事マスターデータの挿入
INSERT INTO meal_master (meal_name, category, calories_per_100g, protein_per_100g) VALUES
-- 朝食メニュー
('白米', 'breakfast', 168, 2.5),
('玄米', 'breakfast', 165, 2.8),
('食パン', 'breakfast', 264, 9.3),
('全粒粉パン', 'breakfast', 247, 13.2),
('オートミール', 'breakfast', 380, 13.7),
('卵焼き', 'breakfast', 151, 12.5),
('目玉焼き', 'breakfast', 196, 14.3),
('スクランブルエッグ', 'breakfast', 149, 10.8),
('ベーコン', 'breakfast', 405, 13.0),
('ヨーグルト（プレーン）', 'breakfast', 62, 3.6),

-- 昼食メニュー
('牛丼', 'lunch', 135, 8.9),
('カレーライス', 'lunch', 124, 3.1),
('チャーハン', 'lunch', 172, 4.8),
('ラーメン', 'lunch', 149, 6.9),
('うどん', 'lunch', 95, 2.6),
('そば', 'lunch', 132, 4.8),
('パスタ（トマトソース）', 'lunch', 131, 4.5),
('サンドイッチ（ハム）', 'lunch', 233, 13.4),
('お弁当（幕の内）', 'lunch', 156, 7.8),
('ハンバーガー', 'lunch', 295, 12.8),

-- 夕食メニュー
('焼き魚（鮭）', 'dinner', 138, 21.7),
('鶏の唐揚げ', 'dinner', 290, 18.0),
('ハンバーグ', 'dinner', 223, 16.5),
('生姜焼き', 'dinner', 164, 17.1),
('マーボー豆腐', 'dinner', 98, 6.5),
('寿司（握り）', 'dinner', 142, 9.4),
('天ぷら', 'dinner', 175, 2.7),
('ステーキ', 'dinner', 201, 26.4),
('焼き鳥', 'dinner', 186, 18.4),
('鍋料理', 'dinner', 89, 7.2),

-- スナック・おやつ
('りんご', 'snack', 61, 0.2),
('バナナ', 'snack', 93, 1.1),
('ナッツミックス', 'snack', 607, 19.9),
('プロテインバー', 'snack', 376, 25.0),
('チョコレート', 'snack', 556, 7.3),
('アイスクリーム', 'snack', 207, 3.8),
('ポテトチップス', 'snack', 554, 5.4),
('クッキー', 'snack', 502, 6.3),

-- 飲み物
('緑茶', 'drink', 0, 0),
('コーヒー（ブラック）', 'drink', 4, 0.2),
('水', 'drink', 0, 0),
('牛乳', 'drink', 67, 3.3),
('オレンジジュース', 'drink', 42, 0.7),
('コーラ', 'drink', 46, 0),
('スポーツドリンク', 'drink', 21, 0),
('ビール', 'drink', 43, 0.5);

-- 運動マスターデータの挿入
INSERT INTO exercise_master (exercise_name, category, met_value) VALUES
-- 有酸素運動
('ウォーキング（普通）', 'cardio', 3.5),
('ウォーキング（早歩き）', 'cardio', 4.3),
('ジョギング', 'cardio', 7.0),
('ランニング（8km/h）', 'cardio', 8.3),
('ランニング（10km/h）', 'cardio', 10.1),
('サイクリング（軽め）', 'cardio', 5.8),
('サイクリング（普通）', 'cardio', 7.5),
('水泳（クロール）', 'cardio', 8.3),
('水泳（平泳ぎ）', 'cardio', 5.3),
('エアロビクス', 'cardio', 7.0),
('縄跳び', 'cardio', 11.0),

-- 筋力トレーニング
('腕立て伏せ', 'strength', 3.8),
('腹筋運動', 'strength', 3.8),
('スクワット', 'strength', 5.0),
('プランク', 'strength', 3.8),
('ダンベルカール', 'strength', 3.0),
('ベンチプレス', 'strength', 6.0),
('デッドリフト', 'strength', 6.0),
('懸垂', 'strength', 7.0),
('ダンベルフライ', 'strength', 3.5),
('レッグプレス', 'strength', 5.5),

-- 柔軟性・ストレッチ
('ストレッチ（全身）', 'flexibility', 2.3),
('ヨガ（初級）', 'flexibility', 2.5),
('ヨガ（中級）', 'flexibility', 3.0),
('ピラティス', 'flexibility', 3.0),
('太極拳', 'flexibility', 3.0),

-- スポーツ
('テニス', 'sports', 7.3),
('バドミントン', 'sports', 5.5),
('卓球', 'sports', 4.0),
('バスケットボール', 'sports', 6.5),
('サッカー', 'sports', 7.0),
('バレーボール', 'sports', 4.0),
('ゴルフ', 'sports', 4.8),
('野球', 'sports', 5.0),

-- 日常活動
('階段昇降', 'daily_activity', 8.8),
('掃除機かけ', 'daily_activity', 3.3),
('庭仕事', 'daily_activity', 4.0),
('洗車', 'daily_activity', 3.0),
('雪かき', 'daily_activity', 5.3),
('買い物', 'daily_activity', 2.3),
('料理', 'daily_activity', 2.5),
('洗濯物干し', 'daily_activity', 2.8);

-- 挿入結果の確認
SELECT 'meal_master' as table_name, COUNT(*) as count FROM meal_master
UNION ALL
SELECT 'exercise_master', COUNT(*) FROM exercise_master;
