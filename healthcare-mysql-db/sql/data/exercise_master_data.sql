-- Exercise Master Data
-- 運動マスターデータの投入

USE healthcare_db;

INSERT INTO exercise_master (
    exercise_name, exercise_name_en, category, subcategory, met_value, 
    calories_per_hour_per_kg, equipment_required, difficulty_level, 
    target_muscle_groups, description, instructions, safety_notes, typical_duration_minutes
) VALUES
-- 有酸素運動（Cardio）
('ウォーキング（普通）', 'Walking (Normal)', 'cardio', 'ウォーキング', 3.5, 3.5, 'なし', 'beginner', '["全身", "下半身"]', '日常的な速度でのウォーキング', '背筋を伸ばし、腕を振りながら歩く', '適切な靴を履き、水分補給を心がける', 30),
('ウォーキング（早歩き）', 'Walking (Brisk)', 'cardio', 'ウォーキング', 4.3, 4.3, 'なし', 'beginner', '["全身", "下半身"]', '早めの速度でのウォーキング', '歩幅を大きくし、腕を大きく振る', '膝や足首に痛みがある場合は控える', 30),
('ジョギング', 'Jogging', 'cardio', 'ランニング', 7.0, 7.0, 'ランニングシューズ', 'intermediate', '["全身", "下半身", "心肺"]', '軽いランニング', '足の中央部で着地し、リズミカルに走る', 'ウォームアップとクールダウンを必ず行う', 30),
('ランニング（8km/h）', 'Running (8km/h)', 'cardio', 'ランニング', 8.3, 8.3, 'ランニングシューズ', 'intermediate', '["全身", "下半身", "心肺"]', '中程度の速度でのランニング', '一定のペースを保ち、呼吸を整える', '体調不良時は無理をしない', 30),
('ランニング（10km/h）', 'Running (10km/h)', 'cardio', 'ランニング', 10.1, 10.1, 'ランニングシューズ', 'advanced', '["全身", "下半身", "心肺"]', '速めの速度でのランニング', 'フォームを意識し、オーバーペースに注意', '十分な準備運動が必要', 30),
('サイクリング（軽め）', 'Cycling (Light)', 'cardio', 'サイクリング', 5.8, 5.8, '自転車、ヘルメット', 'beginner', '["下半身", "心肺"]', '軽い負荷でのサイクリング', 'サドルの高さを適切に調整', 'ヘルメット着用必須、交通ルール遵守', 45),
('サイクリング（普通）', 'Cycling (Moderate)', 'cardio', 'サイクリング', 7.5, 7.5, '自転車、ヘルメット', 'intermediate', '["下半身", "心肺"]', '中程度の負荷でのサイクリング', 'ケイデンスを一定に保つ', '長距離の場合は水分・栄養補給を計画', 45),
('水泳（クロール）', 'Swimming (Freestyle)', 'cardio', '水泳', 8.3, 8.3, '水着、ゴーグル', 'intermediate', '["全身", "心肺"]', 'クロールでの水泳', 'ストロークを大きく、キックを安定させる', 'プールの安全ルールを守る', 30),
('水泳（平泳ぎ）', 'Swimming (Breaststroke)', 'cardio', '水泳', 5.3, 5.3, '水着、ゴーグル', 'beginner', '["全身", "心肺"]', '平泳ぎでの水泳', 'ゆっくりとしたリズムで泳ぐ', '泳げない場合は必ず監視員のいる場所で', 30),

-- 筋力トレーニング（Strength）
('腕立て伏せ', 'Push-ups', 'strength', '自重トレーニング', 3.8, 3.8, 'なし', 'beginner', '["胸筋", "上腕三頭筋", "肩"]', '胸筋を鍛える基本的な自重トレーニング', '手は肩幅に開き、体を一直線に保つ', '膝をついた状態から始めても良い', 15),
('腹筋運動', 'Sit-ups', 'strength', '自重トレーニング', 3.8, 3.8, 'なし', 'beginner', '["腹筋"]', '腹筋を鍛える基本運動', '背中を丸めすぎず、腹筋を意識して上体を起こす', '首に負担をかけないよう注意', 15),
('スクワット', 'Squats', 'strength', '自重トレーニング', 5.0, 5.0, 'なし', 'beginner', '["大腿四頭筋", "大臀筋", "ハムストリング"]', '下半身を鍛える基本運動', '膝がつま先より前に出ないよう注意', '膝に痛みがある場合は控える', 15),
('プランク', 'Plank', 'strength', 'コアトレーニング', 3.8, 3.8, 'なし', 'intermediate', '["コア", "腹筋", "背筋"]', '体幹を鍛える静的運動', '肘とつま先で体を支え、一直線を保つ', '呼吸を止めないよう注意', 10),
('ダンベルカール', 'Dumbbell Curls', 'strength', 'ダンベル', 3.0, 3.0, 'ダンベル', 'beginner', '["上腕二頭筋"]', '上腕二頭筋を鍛える運動', '肘を固定し、ダンベルをゆっくり上げ下げ', '重量は無理のない範囲で設定', 15),
('ベンチプレス', 'Bench Press', 'strength', 'バーベル', 6.0, 6.0, 'バーベル、ベンチ', 'intermediate', '["胸筋", "上腕三頭筋", "肩"]', '胸筋を鍛える代表的な運動', 'バーを胸に軽く触れる程度まで下ろす', '必ずスポッターをつける', 20),
('デッドリフト', 'Deadlift', 'strength', 'バーベル', 6.0, 6.0, 'バーベル', 'advanced', '["背筋", "大臀筋", "ハムストリング"]', '背筋と下半身を鍛える運動', '背中を真っ直ぐ保ち、膝と股関節を同時に動かす', '正しいフォームを習得してから重量を上げる', 20),

-- 柔軟性・ストレッチ（Flexibility）
('ストレッチ（全身）', 'Full Body Stretch', 'flexibility', 'ストレッチ', 2.3, 2.3, 'ヨガマット', 'beginner', '["全身"]', '全身の柔軟性を高めるストレッチ', '反動をつけず、ゆっくりと筋肉を伸ばす', '痛みを感じたら無理をしない', 15),
('ヨガ（初級）', 'Yoga (Beginner)', 'flexibility', 'ヨガ', 2.5, 2.5, 'ヨガマット', 'beginner', '["全身", "コア"]', '基本的なヨガのポーズ', '呼吸を意識し、無理のない範囲で行う', 'バランスを崩しやすいポーズは壁の近くで', 30),
('ヨガ（中級）', 'Yoga (Intermediate)', 'flexibility', 'ヨガ', 3.0, 3.0, 'ヨガマット', 'intermediate', '["全身", "コア", "バランス"]', '中級レベルのヨガ', 'より複雑なポーズとフローを組み合わせる', '体調に合わせてポーズを調整', 45),
('ピラティス', 'Pilates', 'flexibility', 'ピラティス', 3.0, 3.0, 'ピラティスマット', 'intermediate', '["コア", "全身"]', 'コアを中心とした全身運動', '正確な動きと呼吸を重視', '首や腰に問題がある場合は事前に相談', 30),

-- スポーツ（Sports）
('テニス', 'Tennis', 'sports', 'ラケット', 7.3, 7.3, 'ラケット、ボール', 'intermediate', '["全身", "心肺"]', 'ラケットを使った球技', 'フットワークと正確なショットを心がける', '十分なウォームアップが必要', 60),
('バドミントン', 'Badminton', 'sports', 'ラケット', 5.5, 5.5, 'ラケット、シャトル', 'beginner', '["全身", "心肺"]', '軽いラケットを使った球技', '相手との距離感を保ち、安全にプレー', 'コート内での衝突に注意', 45),
('卓球', 'Table Tennis', 'sports', 'ラケット', 4.0, 4.0, 'ラケット、ボール', 'beginner', '["上半身", "反射神経"]', '室内で行う球技', '素早い反応とコントロールが重要', '周囲の安全を確認してプレー', 30),
('バスケットボール', 'Basketball', 'sports', 'ボール', 6.5, 6.5, 'ボール', 'intermediate', '["全身", "心肺", "ジャンプ力"]', 'チームスポーツの代表', 'ドリブル、シュート、パスの基本を習得', '他の選手との接触に注意', 45),
('サッカー', 'Soccer', 'sports', 'ボール', 7.0, 7.0, 'ボール', 'intermediate', '["下半身", "心肺", "全身"]', '世界的に人気の球技', 'ボールコントロールと持久力が重要', 'スライディングやヘディング時は注意', 60),

-- 日常活動（Daily Activity）
('階段昇降', 'Stair Climbing', 'daily_activity', '日常', 8.8, 8.8, 'なし', 'beginner', '["下半身", "心肺"]', '階段の上り下り', '手すりを利用し、安定したペースで', '膝に負担がかかるため、痛みがある場合は控える', 10),
('掃除機かけ', 'Vacuuming', 'daily_activity', '家事', 3.3, 3.3, '掃除機', 'beginner', '["全身"]', '掃除機を使った掃除', '腰を曲げすぎず、脚を使って移動', '長時間同じ姿勢を避ける', 30),
('庭仕事', 'Gardening', 'daily_activity', '屋外作業', 4.0, 4.0, '園芸用具', 'beginner', '["全身"]', '植物の手入れや庭の作業', 'しゃがむ際は膝を使い、腰を保護', '日焼け対策と水分補給を忘れずに', 60),
('洗車', 'Car Washing', 'daily_activity', '屋外作業', 3.0, 3.0, '洗車用具', 'beginner', '["全身"]', '自動車の洗浄', '腰を曲げすぎず、脚を使って姿勢を変える', '滑りやすい場所での作業に注意', 30);

-- target_muscle_groupsをJSON形式で更新
UPDATE exercise_master SET target_muscle_groups = '["全身", "下半身"]' WHERE exercise_name IN ('ウォーキング（普通）', 'ウォーキング（早歩き）');
UPDATE exercise_master SET target_muscle_groups = '["全身", "下半身", "心肺"]' WHERE exercise_name IN ('ジョギング', 'ランニング（8km/h）', 'ランニング（10km/h）');
UPDATE exercise_master SET target_muscle_groups = '["下半身", "心肺"]' WHERE exercise_name IN ('サイクリング（軽め）', 'サイクリング（普通）');
UPDATE exercise_master SET target_muscle_groups = '["全身", "心肺"]' WHERE exercise_name IN ('水泳（クロール）', '水泳（平泳ぎ）', 'テニス', 'バドミントン');
UPDATE exercise_master SET target_muscle_groups = '["胸筋", "上腕三頭筋", "肩"]' WHERE exercise_name IN ('腕立て伏せ', 'ベンチプレス');
UPDATE exercise_master SET target_muscle_groups = '["腹筋"]' WHERE exercise_name = '腹筋運動';
UPDATE exercise_master SET target_muscle_groups = '["大腿四頭筋", "大臀筋", "ハムストリング"]' WHERE exercise_name = 'スクワット';
UPDATE exercise_master SET target_muscle_groups = '["コア", "腹筋", "背筋"]' WHERE exercise_name = 'プランク';
UPDATE exercise_master SET target_muscle_groups = '["上腕二頭筋"]' WHERE exercise_name = 'ダンベルカール';
UPDATE exercise_master SET target_muscle_groups = '["背筋", "大臀筋", "ハムストリング"]' WHERE exercise_name = 'デッドリフト';
UPDATE exercise_master SET target_muscle_groups = '["全身"]' WHERE exercise_name IN ('ストレッチ（全身）', '掃除機かけ', '庭仕事', '洗車');
UPDATE exercise_master SET target_muscle_groups = '["全身", "コア"]' WHERE exercise_name = 'ヨガ（初級）';
UPDATE exercise_master SET target_muscle_groups = '["全身", "コア", "バランス"]' WHERE exercise_name = 'ヨガ（中級）';
UPDATE exercise_master SET target_muscle_groups = '["コア", "全身"]' WHERE exercise_name = 'ピラティス';
UPDATE exercise_master SET target_muscle_groups = '["上半身", "反射神経"]' WHERE exercise_name = '卓球';
UPDATE exercise_master SET target_muscle_groups = '["全身", "心肺", "ジャンプ力"]' WHERE exercise_name = 'バスケットボール';
UPDATE exercise_master SET target_muscle_groups = '["下半身", "心肺", "全身"]' WHERE exercise_name = 'サッカー';
UPDATE exercise_master SET target_muscle_groups = '["下半身", "心肺"]' WHERE exercise_name = '階段昇降';
UPDATE exercise_master SET target_muscle_groups = '[]' WHERE target_muscle_groups IS NULL;
