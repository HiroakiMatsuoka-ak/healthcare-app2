@echo off
setlocal enabledelayedexpansion

:: Healthcare MySQL Database Setup Script for Windows
:: このスクリプトはDockerを使用してMySQLデータベース環境を構築します

echo.
echo 🏥 Healthcare MySQL Database Setup for Windows
echo ==============================================
echo.

:: 環境チェック
echo [INFO] 環境要件をチェックしています...

:: Docker のチェック
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker が見つかりません。Docker Desktop をインストールしてください。
    pause
    exit /b 1
)

:: Docker Compose のチェック
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose が見つかりません。
    pause
    exit /b 1
)

echo [SUCCESS] 環境要件チェック完了

:: .env ファイルの作成
if not exist "..\\.env" (
    echo [INFO] .env ファイルを作成しています...
    copy "..\\.env.example" "..\\.env" >nul
    echo [SUCCESS] .env ファイルが作成されました
    echo [WARNING] 必要に応じて .env ファイル内の設定を変更してください
) else (
    echo [INFO] .env ファイルは既に存在します
)

:: ログディレクトリの作成
echo [INFO] ログディレクトリを作成しています...
if not exist "..\\logs" mkdir "..\\logs"
echo [SUCCESS] ログディレクトリが作成されました

:: Docker イメージのビルドとコンテナ起動
echo [INFO] Docker images wo build shi, container wo kidou shiteimasu...
cd /d "%~dp0..\\docker"

docker-compose build
if errorlevel 1 (
    echo [ERROR] Docker イメージのビルドに失敗しました
    pause
    exit /b 1
)

docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Docker コンテナの起動に失敗しました
    pause
    exit /b 1
)

echo [SUCCESS] Docker コンテナが起動されました

:: データベースの準備待機
echo [INFO] データベースの準備を待機しています...
set /a counter=0
:wait_loop
set /a counter+=1
if !counter! gtr 60 (
    echo [ERROR] データベースの起動がタイムアウトしました
    pause
    exit /b 1
)

docker-compose exec -T mysql mysqladmin ping -h localhost >nul 2>&1
if errorlevel 1 (
    echo|set /p="."
    timeout /t 1 /nobreak >nul
    goto wait_loop
)

echo.
echo [SUCCESS] データベースの準備が完了しました

:: 少し待機（初期化スクリプトの実行完了を待つ）
echo [INFO] 初期化処理の完了を待機しています...
timeout /t 10 /nobreak >nul

:: データベースの状態確認
echo [INFO] データベースの状態を確認しています...
docker-compose exec -T mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db -e "SHOW TABLES;" 2>nul
if errorlevel 1 (
    echo [WARNING] データベースの状態確認でエラーが発生しましたが、セットアップは継続します
) else (
    echo [SUCCESS] データベースの状態確認が完了しました
)

:: 接続情報の表示
echo.
echo [SUCCESS] =========================
echo [SUCCESS] セットアップ完了
echo [SUCCESS] =========================
echo.
echo 📊 phpMyAdmin: http://localhost:8080
echo 🗄️  MySQL接続情報:
echo    ホスト: localhost
echo    ポート: 3307
echo    データベース: healthcare_db
echo    ユーザー: healthcare_user
echo    パスワード: healthcare_pass_2025
echo.
echo 🛠️  管理用コマンド:
echo    コンテナ停止: docker-compose down
echo    コンテナ再起動: docker-compose restart
echo    ログ確認: docker-compose logs mysql
echo.
echo 🌐 ブラウザで phpMyAdmin を開いています...

:: ブラウザでphpMyAdminを開く
start http://localhost:8080

echo.
echo セットアップが完了しました。任意のキーを押して終了してください。
pause >nul
