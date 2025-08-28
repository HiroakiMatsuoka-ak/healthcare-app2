# ぶいざっぷ 💪

React + TypeScript + FastAPI で構築されたフィットネス管理アプリケーション

## 🚀 新機能

現在のブランチ（`add_fast_api`）では、以下の機能が実装されています：

- **FastAPI バックエンド**: REST API サーバー
- **データ取得**: バックエンドからリアルタイムでデータを取得
- **API ドキュメント**: Swagger UI での API 仕様確認
- **モジュラー設計**: フロントエンド・バックエンド分離

## 📊 ダッシュボード機能

### フィットネス管理機能
- **カロリー管理**: 目標摂取カロリーに対する進捗表示
- **食事の内訳**: 朝食・昼食・夕食・間食の円グラフ表示
- **体重管理**: 体重推移の折れ線グラフ
- **アクティビティ追跡**: 歩数、水分摂取、健康スコア
- **食事記録**: 今日の食事履歴一覧
- **クイックアクション**: 各種記録ボタン

### 🎯 主な特徴
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **リアルタイム進捗**: プログレスバーでの視覚的表示
- **インタラクティブなグラフ**: Rechartsによるデータ可視化
- **Material-UI**: モダンなUIコンポーネント

## 🛠 技術スタック

### フロントエンド
- **React.js 19.1.1** (TypeScript)
- **Material-UI (MUI)** - UIコンポーネント
- **Recharts** - グラフライブラリ
- **Emotion** - CSS-in-JS

### バックエンド
- **FastAPI** - 高速な Python Web フレームワーク
- **Pydantic** - データバリデーション
- **Uvicorn** - ASGI サーバー

## 🚀 セットアップ & 起動

### 前提条件
- Node.js (v16以上)
- Python (v3.8以上)
- npm または yarn

### 1. プロジェクトのクローン
```bash
git clone <repository-url>
cd buizapp
```

### 2. フロントエンド セットアップ
```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm start
```

### 3. バックエンド セットアップ
```bash
# バックエンドディレクトリに移動
cd backend

# 依存関係のインストール
pip install fastapi uvicorn pydantic python-multipart

# サーバー起動
python main.py
```

または、Windowsの場合：
```bash
# プロジェクトルートから
start-backend.bat
```

### 📱 アクセス URL

- **フロントエンド**: http://localhost:3000
- **バックエンド API**: http://localhost:8000
- **API ドキュメント (Swagger)**: http://localhost:8000/docs
- **API ドキュメント (ReDoc)**: http://localhost:8000/redoc

## 🔗 API エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/user` | ユーザー情報取得 |
| GET | `/api/weight-data` | 体重推移データ取得 |
| GET | `/api/calorie-data` | カロリー摂取データ取得 |
| GET | `/api/meals` | 食事記録取得 |
| POST | `/api/meals` | 食事記録追加 |
| GET | `/api/activity` | アクティビティデータ取得 |
| GET | `/api/today-calories` | 今日の総摂取カロリー取得 |

## 📁 プロジェクト構造

```
buizapp/
├── public/                 # 静的ファイル
├── src/                   # React ソースコード
│   ├── components/        # コンポーネント
│   ├── hooks/            # カスタムフック
│   │   └── useHealthData.ts  # データ取得フック
│   ├── services/         # API サービス
│   │   └── apiService.ts    # バックエンド通信
│   ├── data/            # テストデータ
│   └── App.tsx          # メインアプリケーション
├── backend/              # FastAPI バックエンド
│   ├── main.py          # FastAPI アプリケーション
│   ├── requirements.txt # Python 依存関係
│   └── README.md        # バックエンド ドキュメント
├── start-backend.bat    # Windows バックエンド起動スクリプト
└── README.md            # プロジェクト ドキュメント
```

## ✅ 開発状況

- [x] フロントエンド UI 実装
- [x] バックエンド API 実装
- [x] フロント・バック連携
- [x] テストデータでの動作確認
- [x] カスタムフック実装
- [x] エラーハンドリング
- [ ] データベース連携
- [ ] 認証機能
- [ ] デプロイ設定

## 🔮 今後の予定

1. **データベース連携** (SQLite/PostgreSQL)
2. **ユーザー認証機能** の実装
3. **データの永続化**
4. **モバイル対応** の向上
5. **テストケース** の追加
6. **Docker化**
7. **CI/CD パイプライン** 構築

## 🧪 テストデータ

現在は以下の仮ユーザーでダッシュボードを表示しています：

- **名前**: 田中 太郎
- **年齢**: 28歳  
- **身長**: 170cm
- **現在体重**: 68.5kg
- **目標体重**: 65kg
- **目標カロリー**: 2000kcal/日

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
