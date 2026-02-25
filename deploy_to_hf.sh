#!/bin/bash
# Script to deploy SkinSight AI to Hugging Face Spaces

echo "🚀 Deploying SkinSight AI to Hugging Face Spaces..."

# Configuration
SPACE_NAME="skinsight-ai"
HF_USERNAME="zrn2003"
SPACE_REPO="https://huggingface.co/spaces/${HF_USERNAME}/${SPACE_NAME}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Cloning Space repository...${NC}"
if [ -d "$SPACE_NAME" ]; then
    echo "Directory exists, pulling latest changes..."
    cd "$SPACE_NAME"
    git pull
else
    git clone "$SPACE_REPO"
    cd "$SPACE_NAME"
fi

echo -e "${YELLOW}Step 2: Copying files...${NC}"
# Copy required files
cp ../app.py .
cp ../requirements.txt .
cp ../Dockerfile .
cp ../SPACE_README.md README.md

# Copy models directory
if [ -d "../models" ]; then
    echo "Copying models directory..."
    rm -rf models
    cp -r ../models .
else
    echo "⚠️  Warning: models directory not found!"
fi

echo -e "${YELLOW}Step 3: Committing changes...${NC}"
git add .
git commit -m "Deploy SkinSight AI to Hugging Face Spaces"

echo -e "${YELLOW}Step 4: Pushing to Hugging Face...${NC}"
git push

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}Your Space will be available at: https://huggingface.co/spaces/${HF_USERNAME}/${SPACE_NAME}${NC}"
echo -e "${YELLOW}Note: It may take 5-10 minutes for the build to complete.${NC}"
