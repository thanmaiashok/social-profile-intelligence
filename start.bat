@echo off
echo ===================================================
echo   SOCIAL PROFILE INTELLIGENCE - STARTING
echo ===================================================

echo.
echo [1/3] Starting Backend (Port 8000)...
start "SPI_Backend" cmd /k "cd backend && python run.py"

echo.
echo [2/3] Starting Frontend (Port 5173)...
start "SPI_Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo [3/3] Opening Browser...
timeout /t 5 >nul
start http://localhost:5173

echo.
echo DONE! System is running.
echo Use kill.bat to stop everything.
pause
