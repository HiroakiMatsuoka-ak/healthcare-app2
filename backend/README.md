# FastAPI ぶいざっぷ Backend

このディレクトリには、ぶいざっぷアプリのFastAPIバックエンドが含まれています。

## セットアップ

1. 仮想環境を作成:
```bash
python -m venv venv
```

2. 仮想環境をアクティベート:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. 依存関係をインストール:
```bash
pip install -r requirements.txt
```

4. サーバーを起動:
```bash
python main.py
```

または:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API エンドポイント

- `GET /` - ルートエンドポイント
- `GET /api/user` - ユーザー情報を取得
- `GET /api/weight-data` - 体重推移データを取得
- `GET /api/calorie-data` - カロリー摂取データを取得
- `GET /api/meals` - 食事記録を取得
- `POST /api/meals` - 食事記録を追加
- `GET /api/activity` - アクティビティデータを取得
- `GET /api/today-calories` - 今日の総摂取カロリーを取得

## API ドキュメント

サーバー起動後、以下のURLでAPI ドキュメントを確認できます：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
