@echo off
echo ========================================
echo ShareHub FYP Evaluation Setup
echo ========================================
echo.

echo Step 1: Starting Backend Server...
echo.
start "ShareHub Backend" cmd /k "cd backend && npm start"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Step 2: Opening Demo Data Setup Page...
echo.
start "" "setup-demo-page.html"

echo.
echo Step 3: Starting Frontend Server...
echo.
start "ShareHub Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Instructions:
echo 1. Wait for both servers to start
echo 2. Click "Setup Demo Data" in the opened webpage
echo 3. Your project will be ready for evaluation!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause