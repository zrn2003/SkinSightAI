# 🚀 Quick Deploy Guide - Hugging Face Spaces

## One-Command Deployment

### Option 1: Using PowerShell Script (Windows)

```powershell
.\deploy_to_hf.ps1
```

### Option 2: Manual Deployment

1. **Create Space on Hugging Face**
   - Go to https://huggingface.co/spaces
   - Click "Create new Space"
   - Name: `skinsight-ai`
   - SDK: **Docker**
   - Hardware: **GPU T4 Small** (recommended) or **CPU Basic** (free)

2. **Clone Your Space**
   ```bash
   git clone https://huggingface.co/spaces/zrn2003/skinsight-ai
   cd skinsight-ai
   ```

3. **Copy Files**
   ```bash
   # From your SkinSight-AI directory
   cp app.py ../skinsight-ai/
   cp requirements.txt ../skinsight-ai/
   cp Dockerfile ../skinsight-ai/
   cp SPACE_README.md ../skinsight-ai/README.md
   cp -r models ../skinsight-ai/
   ```

4. **Push to Hugging Face**
   ```bash
   cd ../skinsight-ai
   git add .
   git commit -m "Initial deployment"
   git push
   ```

5. **Wait for Build** (5-10 minutes)
   - Check build logs in your Space page
   - Your API will be live at: `https://zrn2003-skinsight-ai.hf.space`

## ✅ Verify Deployment

```bash
# Health check
curl https://zrn2003-skinsight-ai.hf.space/ping

# Test prediction
curl -X POST https://zrn2003-skinsight-ai.hf.space/predict \
  -F "file=@test_image.jpg"
```

## 📝 Required Files Checklist

- [x] `Dockerfile` ✅ Created
- [x] `app.py` ✅ Updated (port 7860)
- [x] `requirements.txt` ✅ Exists
- [x] `SPACE_README.md` ✅ Created
- [x] `models/` folder ✅ Needs to be uploaded
- [x] `.dockerignore` ✅ Created

## 🔧 Troubleshooting

**Build fails?**
- Check logs in Space page
- Ensure all files are in root directory
- Verify Dockerfile syntax

**Models not loading?**
- Check `models/` folder is uploaded
- Verify file paths in `app.py`

**Port errors?**
- Ensure `app.py` uses port 7860 (already updated)

## 📚 Full Documentation

See `HUGGINGFACE_DEPLOYMENT.md` for complete guide.
