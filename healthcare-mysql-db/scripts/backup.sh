#!/bin/bash

# Healthcare MySQL Database Backup Script
# このスクリプトはMySQLデータベースのバックアップを作成します

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

# 設定値
BACKUP_DIR="../backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME=${MYSQL_DATABASE:-healthcare_db}
BACKUP_FILE="${BACKUP_DIR}/healthcare_db_backup_${TIMESTAMP}.sql"

# .env ファイルの読み込み
if [ -f "../.env" ]; then
    source "../.env"
fi

# バックアップディレクトリの作成
create_backup_directory() {
    log_info "バックアップディレクトリを作成しています..."
    mkdir -p "${BACKUP_DIR}"
    log_success "バックアップディレクトリが作成されました: ${BACKUP_DIR}"
}

# データベースバックアップの実行
backup_database() {
    log_info "データベースのバックアップを開始しています..."
    
    cd ../docker
    
    # mysqldump を使用してバックアップ
    docker-compose exec -T mysql mysqldump \
        -u root \
        -p${MYSQL_ROOT_PASSWORD:-healthcare_root_pass} \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        --add-drop-database \
        --add-drop-table \
        --create-options \
        --quick \
        --lock-tables=false \
        ${DB_NAME} > "${BACKUP_FILE}"
    
    if [ $? -eq 0 ]; then
        log_success "データベースのバックアップが完了しました: ${BACKUP_FILE}"
    else
        log_error "データベースのバックアップに失敗しました"
        return 1
    fi
}

# バックアップファイルの圧縮
compress_backup() {
    log_info "バックアップファイルを圧縮しています..."
    
    gzip "${BACKUP_FILE}"
    
    if [ $? -eq 0 ]; then
        log_success "バックアップファイルが圧縮されました: ${BACKUP_FILE}.gz"
    else
        log_warning "バックアップファイルの圧縮に失敗しました"
    fi
}

# 古いバックアップファイルの削除
cleanup_old_backups() {
    log_info "古いバックアップファイルを削除しています..."
    
    # 7日以上古いバックアップファイルを削除
    find "${BACKUP_DIR}" -name "healthcare_db_backup_*.sql.gz" -mtime +7 -delete
    
    log_success "古いバックアップファイルの削除が完了しました"
}

# バックアップファイルの情報表示
show_backup_info() {
    echo ""
    log_success "=== バックアップ完了 ==="
    echo ""
    echo "📁 バックアップファイル: ${BACKUP_FILE}.gz"
    echo "📊 ファイルサイズ: $(du -h "${BACKUP_FILE}.gz" | cut -f1)"
    echo "🕒 作成日時: $(date)"
    echo ""
    echo "🔄 リストア方法:"
    echo "   1. バックアップファイルを展開: gunzip ${BACKUP_FILE}.gz"
    echo "   2. データベースにリストア: "
    echo "      docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD:-healthcare_root_pass} < ${BACKUP_FILE}"
    echo ""
}

# メイン実行
main() {
    echo "💾 Healthcare Database Backup"
    echo "============================="
    echo ""
    
    # Dockerコンテナの状態確認
    cd ../docker
    if ! docker-compose ps mysql | grep -q "Up"; then
        log_error "MySQLコンテナが起動していません。先にコンテナを起動してください。"
        exit 1
    fi
    
    cd ../scripts
    
    create_backup_directory
    
    if backup_database; then
        compress_backup
        cleanup_old_backups
        show_backup_info
    else
        log_error "バックアップに失敗しました"
        exit 1
    fi
}

# スクリプト実行
main "$@"
