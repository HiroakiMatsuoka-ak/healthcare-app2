FROM mysql:8.0

# 日本語環境の設定
ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

# MySQLの文字セット設定
ENV MYSQL_CHARSET=utf8mb4
ENV MYSQL_COLLATION=utf8mb4_unicode_ci

# ログディレクトリの作成権限設定
RUN mkdir -p /var/log/mysql && \
    chown mysql:mysql /var/log/mysql

# ポート開放
EXPOSE 3306
