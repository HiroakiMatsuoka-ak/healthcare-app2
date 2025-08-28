# Healthcare MySQL Database

ヘルスケアアプリケーション用のMySQLデータベース環境です。Docker Composeを使用して簡単にセットアップできます。

## 🗄️ データベース設計

### テーブル構成

#### 1. users（ユーザー基本情報）
- ユーザーの基本プロフィール情報
- 身長、初期体重、目標体重など

#### 2. meal_master（食事マスター）
- 食事メニューの栄養価情報
- カロリー、タンパク質、脂質、炭水化物など

#### 3. exercise_master（運動マスター）
- 運動メニューの情報
- METs値、消費カロリー、対象筋肉群など

#### 4. user_meals（ユーザー食事記録）
- ユーザーの日々の食事摂取記録
- 食事時間、摂取量、実際のカロリーなど

#### 5. user_exercises（ユーザー運動記録）
- ユーザーの日々の運動記録
- 運動時間、強度、消費カロリーなど

#### 6. weight_records（体重記録）
- ユーザーの体重推移データ
- 体重、体脂肪率、BMI（自動計算）など

### ER図

```
users (1) ──────── (*) user_meals ────── (1) meal_master
  │                                          
  │                                          
  └── (1) ──────── (*) user_exercises ─── (1) exercise_master
  │                                          
  │                                          
  └── (1) ──────── (*) weight_records        
```

## 🚀 セットアップ

### 前提条件

- Docker
- Docker Compose
- Git

### 1. 環境設定

```bash
# .envファイルをコピー
cp .env.example .env

# 必要に応じて設定を変更
nano .env
```

### 2. データベース起動

#### Linuxの場合:
```bash
cd scripts
chmod +x setup.sh
./setup.sh
```

#### Windowsの場合:
```cmd
cd docker
docker-compose up -d
```

### 3. 接続確認

- **phpMyAdmin**: http://localhost:8080
- **MySQL接続情報**:
  - ホスト: localhost
  - ポート: 3306
  - データベース: healthcare_db
  - ユーザー: healthcare_user
  - パスワード: healthcare_pass_2025

## 📊 サンプルデータ

データベースには以下のサンプルデータが含まれています：

- **食事マスター**: 40種類以上の食事メニュー
- **運動マスター**: 30種類以上の運動メニュー
- **テストユーザー**: 2名のサンプルユーザー
- **サンプル記録**: 食事・運動・体重の記録データ

## 🔧 管理

### コンテナ操作

```bash
# コンテナ停止
docker-compose down

# コンテナ再起動
docker-compose restart

# ログ確認
docker-compose logs mysql

# MySQLコンソール接続
docker-compose exec mysql mysql -u root -p
```

### バックアップ

```bash
# Linuxの場合
cd scripts
./backup.sh

# 手動バックアップ（Windows）
docker-compose exec mysql mysqldump -u root -p healthcare_db > backup.sql
```

### リストア

```bash
# Linuxの場合（backup.shで作成したファイル）
gunzip healthcare_db_backup_YYYYMMDD_HHMMSS.sql.gz
docker-compose exec -T mysql mysql -u root -p healthcare_db < healthcare_db_backup_YYYYMMDD_HHMMSS.sql

# 手動リストア
docker-compose exec -T mysql mysql -u root -p healthcare_db < backup.sql
```

## 📈 パフォーマンス最適化

### インデックス

主要なクエリパターンに対して以下のインデックスが設定されています：

- ユーザー別日付範囲検索用複合インデックス
- 栄養素・カロリー検索用インデックス
- 全文検索インデックス（食事名・運動名）

### ビュー

統計データ取得用のビューが用意されています：

- `user_daily_summary`: 日別サマリー
- `user_weekly_summary`: 週別サマリー
- `user_monthly_summary`: 月別サマリー

## 🔍 よく使用するクエリ例

### 1. ユーザーの今日の摂取カロリー合計

```sql
SELECT SUM(actual_calories) as total_calories
FROM user_meals 
WHERE user_id = 1 AND meal_date = CURDATE();
```

### 2. ユーザーの体重推移（過去30日）

```sql
SELECT record_date, weight, bmi
FROM weight_records 
WHERE user_id = 1 
  AND record_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY record_date;
```

### 3. 高タンパク質食材の検索

```sql
SELECT meal_name, protein_per_100g, calories_per_100g
FROM meal_master 
WHERE protein_per_100g > 20 
ORDER BY protein_per_100g DESC;
```

### 4. ユーザーの月間運動サマリー

```sql
SELECT 
    MONTH(exercise_date) as month,
    COUNT(*) as exercise_count,
    SUM(calories_burned) as total_calories_burned,
    AVG(duration_minutes) as avg_duration
FROM user_exercises 
WHERE user_id = 1 
  AND YEAR(exercise_date) = YEAR(CURDATE())
GROUP BY MONTH(exercise_date);
```

## 🛡️ セキュリティ

### ユーザー権限

- **healthcare_admin**: 全権限（開発・管理用）
- **healthcare_user**: アプリケーション用（読み書き）
- **healthcare_readonly**: 読み取り専用（レポート用）

### 接続制限

- ローカル接続のみ許可
- パスワード認証必須
- SSL接続推奨（本番環境）

## 🐛 トラブルシューティング

### よくある問題

1. **コンテナが起動しない**
   ```bash
   # ポート使用状況確認
   netstat -an | grep 3306
   
   # .envファイルの設定確認
   cat .env
   ```

2. **データベース接続エラー**
   ```bash
   # コンテナ状態確認
   docker-compose ps
   
   # MySQLログ確認
   docker-compose logs mysql
   ```

3. **初期データが入らない**
   ```bash
   # 初期化スクリプト再実行
   docker-compose exec mysql mysql -u root -p healthcare_db < /docker-entrypoint-initdb.d/migrations/initial_setup.sql
   ```

## 📝 開発者向け情報

### データベース設計方針

- **正規化**: 第3正規形まで正規化済み
- **外部キー制約**: データ整合性を保証
- **インデックス**: パフォーマンス最適化済み
- **文字セット**: UTF-8（絵文字対応）

### API連携

`backend/main.py`でFastAPIアプリケーションと連携します。

```python
# 接続例
import mysql.connector

config = {
    'host': 'localhost',
    'port': 3306,
    'database': 'healthcare_db',
    'user': 'healthcare_user',
    'password': 'healthcare_pass_2025',
    'charset': 'utf8mb4'
}

conn = mysql.connector.connect(**config)
```

## 📚 参考資料

- [MySQL 8.0 Documentation](https://dev.mysql.com/doc/refman/8.0/en/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [phpMyAdmin Documentation](https://docs.phpmyadmin.net/)

## 🤝 コントリビューション

1. フォークしてください
2. フィーチャーブランチを作成してください (`git checkout -b feature/amazing-feature`)
3. コミットしてください (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュしてください (`git push origin feature/amazing-feature`)
5. プルリクエストを開いてください

## 📄 ライセンス

このプロジェクトはMITライセンスの下で配布されています。詳細については`LICENSE`ファイルを参照してください。
