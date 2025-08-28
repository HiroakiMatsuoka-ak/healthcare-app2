@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo Healthcare MySQL Database Setup for Windows
echo ===========================================
echo.

:: Environment check
echo [INFO] Checking requirements...

:: Docker check
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker not found. Please install Docker Desktop.
    pause
    exit /b 1
)

:: Docker Compose check
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose not found.
    pause
    exit /b 1
)

echo [SUCCESS] Requirements check completed

:: Create .env file
if not exist "..\\.env" (
    echo [INFO] Creating .env file...
    copy "..\\.env.example" "..\\.env" >nul
    echo [SUCCESS] .env file created
    echo [WARNING] Please modify .env file settings if needed
) else (
    echo [INFO] .env file already exists
)

:: Create log directory
echo [INFO] Creating log directory...
if not exist "..\\logs" mkdir "..\\logs"
echo [SUCCESS] Log directory created

:: Build Docker image and start containers
echo [INFO] Building Docker image and starting containers...
cd /d "%~dp0..\\docker"

docker-compose build
if errorlevel 1 (
    echo [ERROR] Docker image build failed
    pause
    exit /b 1
)

docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Docker container startup failed
    pause
    exit /b 1
)

echo [SUCCESS] Docker containers started

:: Wait for database to be ready
echo [INFO] Waiting for database to be ready...
set /a counter=0
:wait_loop
set /a counter+=1
if !counter! gtr 60 (
    echo [ERROR] Database startup timeout
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
echo [SUCCESS] Database is ready

:: Wait for initialization
echo [INFO] Waiting for initialization to complete...
timeout /t 10 /nobreak >nul

:: Check database status
echo [INFO] Checking database status...
docker-compose exec -T mysql mysql -u root -phealthcare_root_pass_2025 healthcare_db -e "SHOW TABLES;" 2>nul
if errorlevel 1 (
    echo [WARNING] Database status check had errors but setup continues
) else (
    echo [SUCCESS] Database status check completed
)

:: Display connection info
echo.
echo [SUCCESS] =========================
echo [SUCCESS] Setup Completed
echo [SUCCESS] =========================
echo.
echo phpMyAdmin: http://localhost:8080
echo MySQL Connection Info:
echo    Host: localhost
echo    Port: 3307
echo    Database: healthcare_db
echo    User: healthcare_user
echo    Password: healthcare_pass_2025
echo.
echo Management Commands:
echo    Stop containers: docker-compose down
echo    Restart containers: docker-compose restart
echo    View logs: docker-compose logs mysql
echo.
echo Opening phpMyAdmin in browser...

:: Open phpMyAdmin in browser
start http://localhost:8080

echo.
echo Setup completed. Press any key to exit.
pause >nul
