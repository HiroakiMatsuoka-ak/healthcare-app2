#!/bin/bash

# Healthcare MySQL Database Setup Script
# このスクリプトはDockerを使用してMySQLデータベース環境を構築します

set -e

# カラーコードの定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ関数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 環境チェック
check_requirements() {
    log_info "環境要件をチェックしています..."
    
    # Docker のチェック
    if ! command -v docker &> /dev/null; then
        log_error "Docker が見つかりません。Docker をインストールしてください。"
        exit 1
    fi
    
    # Docker Compose のチェック
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose が見つかりません。Docker Compose をインストールしてください。"
        exit 1
    fi
    
    log_success "環境要件チェック完了"
}

# .env ファイルの作成
create_env_file() {
    if [ ! -f "../.env" ]; then
        log_info ".env ファイルを作成しています..."
        cp "../.env.example" "../.env"
        log_success ".env ファイルが作成されました"
        log_warning "必要に応じて .env ファイル内の設定を変更してください"
    else
        log_info ".env ファイルは既に存在します"
    fi
}

# ログディレクトリの作成
create_log_directory() {
    log_info "ログディレクトリを作成しています..."
    mkdir -p ../logs
    chmod 755 ../logs
    log_success "ログディレクトリが作成されました"
}

# Docker イメージのビルド
build_docker_image() {
    log_info "Docker イメージをビルドしています..."
    cd ../docker
    docker-compose build
    log_success "Docker イメージのビルドが完了しました"
}

# コンテナの起動
start_containers() {
    log_info "Docker コンテナを起動しています..."
    docker-compose up -d
    log_success "Docker コンテナが起動されました"
}

# データベースの準備待機
wait_for_database() {
    log_info "データベースの準備を待機しています..."
    
    # 最大60秒待機
    for i in {1..60}; do
        if docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD:-healthcare_root_pass} -e "SELECT 1" > /dev/null 2>&1; then
            log_success "データベースの準備が完了しました"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    
    log_error "データベースの起動がタイムアウトしました"
    return 1
}

# データベースの状態確認
check_database_status() {
    log_info "データベースの状態を確認しています..."
    
    # テーブルの存在確認
    docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD:-healthcare_root_pass} healthcare_db -e "SHOW TABLES;"
    
    # データ件数の確認
    docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD:-healthcare_root_pass} healthcare_db -e "
        SELECT 'users' as table_name, COUNT(*) as count FROM users
        UNION ALL
        SELECT 'meal_master', COUNT(*) FROM meal_master
        UNION ALL
        SELECT 'exercise_master', COUNT(*) FROM exercise_master;
    "
    
    log_success "データベースの状態確認が完了しました"
}

# 接続情報の表示
show_connection_info() {
    echo ""
    log_success "=== Healthcare MySQL Database セットアップ完了 ==="
    echo ""
    echo "📊 phpMyAdmin: http://localhost:${PHPMYADMIN_PORT:-8080}"
    echo "🗄️  MySQL接続情報:"
    echo "   ホスト: localhost"
    echo "   ポート: ${MYSQL_PORT:-3306}"
    echo "   データベース: ${MYSQL_DATABASE:-healthcare_db}"
    echo "   ユーザー: ${MYSQL_USER:-healthcare_user}"
    echo "   パスワード: ${MYSQL_PASSWORD:-healthcare_pass}"
    echo ""
    echo "🛠️  管理用コマンド:"
    echo "   コンテナ停止: docker-compose down"
    echo "   コンテナ再起動: docker-compose restart"
    echo "   ログ確認: docker-compose logs mysql"
    echo "   バックアップ: ./backup.sh"
    echo ""
}

# クリーンアップ関数
cleanup() {
    log_info "セットアップを中断しています..."
    cd ../docker
    docker-compose down
    log_warning "セットアップが中断されました"
}

# シグナルトラップ
trap cleanup INT TERM

# メイン実行
main() {
    echo "🏥 Healthcare MySQL Database Setup"
    echo "=================================="
    echo ""
    
    check_requirements
    create_env_file
    create_log_directory
    build_docker_image
    start_containers
    
    if wait_for_database; then
        sleep 5  # 初期化スクリプトの実行完了を待機
        check_database_status
        show_connection_info
    else
        log_error "データベースのセットアップに失敗しました"
        cleanup
        exit 1
    fi
}

# .env ファイルの読み込み
if [ -f "../.env" ]; then
    source "../.env"
fi

# スクリプト実行
main "$@"
