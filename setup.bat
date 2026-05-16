@echo off
setlocal enabledelayedexpansion
title Social Profile Intelligence — Setup

echo.
echo ============================================================
echo   SOCIAL PROFILE INTELLIGENCE — ONE-CLICK SETUP
echo ============================================================
echo.

:: ── 1. CHECK PYTHON ──────────────────────────────────────────
echo [1/6] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found.
    echo         Download Python 3.11+ from: https://www.python.org/downloads/
    echo         Make sure to check "Add Python to PATH" during install.
    pause & exit /b 1
)
for /f "tokens=2 delims= " %%v in ('python --version 2^>^&1') do set PYVER=%%v
echo [OK] Python %PYVER% found.

:: ── 2. CHECK NODE.JS ─────────────────────────────────────────
echo [2/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found.
    echo         Download Node.js 18+ from: https://nodejs.org/
    pause & exit /b 1
)
for /f %%v in ('node --version') do set NODEVER=%%v
echo [OK] Node.js %NODEVER% found.

:: ── 3. INSTALL OLLAMA ────────────────────────────────────────
echo [3/6] Checking Ollama...
ollama --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Ollama not found. Downloading installer...
    powershell -Command "Invoke-WebRequest -Uri 'https://ollama.com/download/OllamaSetup.exe' -OutFile '%TEMP%\OllamaSetup.exe'"
    if errorlevel 1 (
        echo [ERROR] Download failed. Check internet connection.
        echo         Or install manually: https://ollama.com/download
        pause & exit /b 1
    )
    echo [INFO] Running Ollama installer — follow the prompts...
    start /wait "%TEMP%\OllamaSetup.exe"
    :: Refresh PATH so ollama command works in this session
    set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Ollama"
    ollama --version >nul 2>&1
    if errorlevel 1 (
        echo [WARN] Ollama installed but needs PATH refresh.
        echo        Close this window, reopen, and run setup.bat again.
        pause & exit /b 1
    )
)
echo [OK] Ollama found.

:: ── 4. PULL LLM MODEL ────────────────────────────────────────
echo [4/6] Pulling LLM model (llama3.1:8b-instruct-q4_K_M)...
echo       This is ~5 GB — grab a coffee if first time.
echo       If already downloaded, this will be instant.
echo.
ollama pull llama3.1:8b-instruct-q4_K_M
if errorlevel 1 (
    echo [ERROR] Failed to pull model. Is Ollama running?
    echo         Try: ollama serve   (in a separate terminal)
    pause & exit /b 1
)
echo [OK] Model ready.

:: ── 5. PYTHON BACKEND SETUP ──────────────────────────────────
echo [5/6] Setting up Python backend...
cd /d "%~dp0backend"

if not exist venv (
    echo       Creating virtual environment...
    python -m venv venv
)
echo       Installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo [ERROR] pip install failed. See output above.
    pause & exit /b 1
)
echo [OK] Backend ready.

:: ── 6. FRONTEND SETUP ────────────────────────────────────────
echo [6/6] Setting up frontend...
cd /d "%~dp0frontend"
call npm install --silent
if errorlevel 1 (
    echo [ERROR] npm install failed. See output above.
    pause & exit /b 1
)
echo [OK] Frontend ready.

:: ── CREATE .env IF MISSING ───────────────────────────────────
cd /d "%~dp0"
if not exist .env (
    echo [INFO] Creating .env from .env.example...
    copy .env.example .env >nul
    echo [OK] .env created.
) else (
    echo [OK] .env already exists — skipping.
)

:: ── DONE ─────────────────────────────────────────────────────
echo.
echo ============================================================
echo   SETUP COMPLETE!
echo ============================================================
echo.
echo   To run the app, open 3 terminals:
echo.
echo   Terminal 1 — Ollama:
echo     ollama serve
echo.
echo   Terminal 2 — Backend:
echo     cd backend
echo     venv\Scripts\activate
echo     uvicorn app.main:app --port 8000 --reload
echo.
echo   Terminal 3 — Frontend:
echo     cd frontend
echo     npm run dev
echo.
echo   Then open: http://localhost:5173
echo.
pause
