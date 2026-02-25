# SkinSight AI Model Server - Background Service Script
# This PowerShell script runs the server in the background

$ErrorActionPreference = "Stop"

Write-Host "Starting SkinSight AI Model Server in background..." -ForegroundColor Green

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Activate virtual environment if it exists
if (Test-Path "venv_new\Scripts\Activate.ps1") {
    & "venv_new\Scripts\Activate.ps1"
    Write-Host "Virtual environment activated." -ForegroundColor Cyan
}

# Start the server in a new window
$process = Start-Process python -ArgumentList "app.py" -PassThru -WindowStyle Normal

Write-Host "Server started with PID: $($process.Id)" -ForegroundColor Green
Write-Host "Server is running at http://localhost:8000" -ForegroundColor Cyan
Write-Host "To stop the server, close the window or run: Stop-Process -Id $($process.Id)" -ForegroundColor Yellow

# Keep script running
Read-Host "Press Enter to exit (server will continue running)"
