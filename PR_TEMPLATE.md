# 🚀 FastAPIバックエンド実装とフロントエンド連携

## 📋 概要

React + TypeScript + Material-UIのフロントエンドに、FastAPIバックエンドを追加してフルスタック構成にアップグレードしました。

## ✨ 新機能

### 🔧 バックエンド実装
- **FastAPI** REST APIサーバー
- **Pydantic** モデルによるデータバリデーション
- **CORS** 設定でReact開発サーバーとの連携
- **Swagger UI** でAPI仕様確認可能 (`/docs`)

### 🌐 APIエンドポイント (7個)
| メソッド | エンドポイント | 機能 |
|---------|---------------|-----|
| GET | `/api/user` | ユーザー情報取得 |
| GET | `/api/weight-data` | 体重推移データ取得 |
| GET | `/api/calorie-data` | カロリー摂取データ取得 |
| GET | `/api/meals` | 食事記録取得 |
| POST | `/api/meals` | 食事記録追加 |
| GET | `/api/activity` | アクティビティデータ取得 |
| GET | `/api/today-calories` | 今日の総摂取カロリー取得 |

### ⚛️ フロントエンド改良
- **API通信サービス** (`apiService.ts`)
- **カスタムフック** (`useHealthData.ts`) でデータ取得ロジック分離
- **エラーハンドリング** と **ローディング状態** 管理
- **TypeScript型定義** で型安全性確保

## 🏗️ アーキテクチャ

```
healthcare-app2/
├── frontend (React + TypeScript)
│   ├── src/services/apiService.ts    # API通信
│   ├── src/hooks/useHealthData.ts    # データ取得フック
│   └── src/App.tsx                   # バックエンド連携対応
├── backend (FastAPI + Python)
│   ├── main.py                       # APIサーバー
│   ├── requirements.txt              # Python依存関係
│   └── README.md                     # バックエンド仕様
└── start-backend.bat                 # 起動スクリプト
```

## 🚀 セットアップ & 動作確認

### バックエンド起動
```bash
cd backend
pip install fastapi uvicorn pydantic python-multipart
python main.py
```

### フロントエンド起動
```bash
npm start
```

### 確認URL
- **フロントエンド**: http://localhost:3000
- **API ドキュメント**: http://localhost:8000/docs

## 🧪 テスト内容

- [x] バックエンドサーバー起動確認
- [x] API エンドポイント動作確認
- [x] フロントエンドからのデータ取得確認
- [x] エラーハンドリング動作確認
- [x] ローディング状態表示確認
- [x] CORS設定動作確認

## 📈 今後の拡張性

この基盤により以下の機能も容易に実装可能：
- データベース連携 (SQLite/PostgreSQL)
- ユーザー認証 (JWT)
- リアルタイム通知
- Docker化とデプロイ

## 🔍 変更ファイル

### 新規追加
- `backend/main.py` - FastAPI アプリケーション
- `backend/requirements.txt` - Python 依存関係
- `backend/README.md` - バックエンド仕様
- `src/services/apiService.ts` - API通信サービス
- `src/hooks/useHealthData.ts` - データ取得カスタムフック
- `src/data/mockData.ts` - テストデータ
- `start-backend.bat` - Windows用起動スクリプト

### 更新
- `src/App.tsx` - バックエンドからのデータ取得に対応
- `README.md` - 技術スタック、セットアップ手順、API仕様追加

## 📊 動作デモ

1. バックエンド・フロントエンド両方を起動
2. http://localhost:3000 でアプリケーション確認
3. http://localhost:8000/docs でAPI仕様確認
4. ブラウザ開発者ツールでAPI通信ログ確認

静的なモックデータから、動的なAPI連携に進化しました！
