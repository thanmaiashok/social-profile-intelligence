@echo off
echo ===================================================
echo   SOCIAL PROFILE INTELLIGENCE - STOPPING
echo ===================================================

echo.
echo Killing Backend and Frontend processes...

taskkill /FI "WINDOWTITLE eq SPI_Backend" /T /F
taskkill /FI "WINDOWTITLE eq SPI_Frontend" /T /F

echo.
echo Cleaning up Python and Node processes...
taskkill /F /IM python.exe
taskkill /F /IM node.exe

echo.
echo STOPPED.
pause
