@echo off
REM SkinSight AI Model Server Startup Script
REM This script starts the FastAPI server and keeps it running

echo Starting SkinSight AI Model Server...
echo.

REM Activate virtual environment if it exists
if exist "venv_new\Scripts\activate.bat" (
    call venv_new\Scripts\activate.bat
    echo Virtual environment activated.
)

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Start the server
echo Starting FastAPI server on http://0.0.0.0:8000
echo Press Ctrl+C to stop the server
echo.

python app.py

pause
