# PowerShell script to deploy SkinSight AI to Hugging Face Spaces

Write-Host "🚀 Deploying SkinSight AI to Hugging Face Spaces..." -ForegroundColor Yellow

# Configuration
$SPACE_NAME = "skinsight-ai"
$HF_USERNAME = "zrn2003"
$SPACE_REPO = "https://huggingface.co/spaces/${HF_USERNAME}/${SPACE_NAME}"

Write-Host "`nStep 1: Cloning Space repository..." -ForegroundColor Yellow
if (Test-Path $SPACE_NAME) {
    Write-Host "Directory exists, pulling latest changes..." -ForegroundColor Yellow
    Set-Location $SPACE_NAME
    git pull
} else {
    git clone $SPACE_REPO
    Set-Location $SPACE_NAME
}

Write-Host "`nStep 2: Copying files..." -ForegroundColor Yellow
# Copy required files
Copy-Item -Path "..\app.py" -Destination "." -Force
Copy-Item -Path "..\requirements.txt" -Destination "." -Force
Copy-Item -Path "..\Dockerfile" -Destination "." -Force
Copy-Item -Path "..\SPACE_README.md" -Destination "README.md" -Force

# Copy models directory
if (Test-Path "..\models") {
    Write-Host "Copying models directory..." -ForegroundColor Yellow
    if (Test-Path "models") {
        Remove-Item -Path "models" -Recurse -Force
    }
    Copy-Item -Path "..\models" -Destination "." -Recurse -Force
} else {
    Write-Host "⚠️  Warning: models directory not found!" -ForegroundColor Red
}

Write-Host "`nStep 3: Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "Deploy SkinSight AI to Hugging Face Spaces"

Write-Host "`nStep 4: Pushing to Hugging Face..." -ForegroundColor Yellow
git push

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "Your Space will be available at: https://huggingface.co/spaces/${HF_USERNAME}/${SPACE_NAME}" -ForegroundColor Green
Write-Host "Note: It may take 5-10 minutes for the build to complete." -ForegroundColor Yellow
