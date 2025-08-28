#!/bin/bash

echo "Starting healthcare database initialization..."

# スキーマファイルの実行
for file in /docker-entrypoint-initdb.d/schema/*.sql; do
    if [ -f "$file" ]; then
        echo "Executing schema file: $file"
        mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < "$file"
    fi
done

# データファイルの実行
for file in /docker-entrypoint-initdb.d/data/*.sql; do
    if [ -f "$file" ]; then
        echo "Executing data file: $file"
        mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < "$file"
    fi
done

echo "Healthcare database initialization completed."
