@echo off
REM Hospital Management System - Windows Deployment Script

echo.
echo 🏥 Hospital Management System - Deployment Setup
echo ==================================================
echo.

REM Check if Node.js is installed
where /q node
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check if npm is installed
where /q npm
if errorlevel 1 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%

REM Create .env files if they don't exist
if not exist ".env" (
    echo.
    echo 📝 Creating frontend .env file...
    copy .env.example .env
    echo ⚠️  Please update .env with your API URL
)

if not exist "backend\.env" (
    echo.
    echo 📝 Creating backend .env file...
    copy backend\.env.example backend\.env
    echo ⚠️  Please update backend\.env with your credentials
)

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

REM Build frontend
echo.
echo 🔨 Building frontend for production...
call npm run build
if errorlevel 1 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)

echo.
echo ✅ Deployment setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env with your API URL
echo 2. Update backend\.env with Google Sheets credentials
echo 3. Choose a deployment platform:
echo    - Docker: docker-compose up
echo    - Heroku: git push heroku main
echo    - Self-hosted: npm start ^(backend^) + IIS/nginx ^(frontend^)
echo    - Vercel + Railway: Push to GitHub and deploy
echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
echo.
pause
