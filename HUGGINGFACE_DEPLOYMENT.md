# Deploying SkinSight AI on Hugging Face Spaces

This guide explains how to deploy your SkinSight AI model as a continuously running server on Hugging Face Spaces.

## 🚀 Quick Start

### Option 1: Hugging Face Spaces (Recommended - Free)

Hugging Face Spaces allows you to deploy your FastAPI application with Docker. Your model will run 24/7 as a public API endpoint.

#### Step 1: Create a Space on Hugging Face

1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Fill in:
   - **Space name**: `skinsight-ai` (or your preferred name)
   - **SDK**: Select **"Docker"**
   - **Visibility**: Public or Private
   - **Hardware**: Select **"GPU"** (CPU T4 small is free, GPU T4 small requires payment)
4. Click **"Create Space"**

#### Step 2: Upload Your Files

You need to upload these files to your Space repository:

1. **Dockerfile** (provided below)
2. **app.py** (your existing FastAPI app - may need minor modifications)
3. **requirements.txt** (your existing requirements)
4. **models/** folder (containing your `.pth` model files)
5. **README.md** (for the Space description)

#### Step 3: Push Files to Your Space

```bash
# Clone your Space repository
git clone https://huggingface.co/spaces/zrn2003/skinsight-ai
cd skinsight-ai

# Copy your files
cp ../SkinSight-AI/app.py .
cp ../SkinSight-AI/requirements.txt .
cp -r ../SkinSight-AI/models .

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

Hugging Face will automatically build and deploy your Docker container!

---

### Option 2: Hugging Face Inference Endpoints (Production - Paid)

For production workloads with guaranteed uptime and better performance:

1. Go to https://huggingface.co/inference-endpoints
2. Click **"New Endpoint"**
3. Select your model repository: `zrn2003/SkinSight`
4. Choose instance type (GPU recommended)
5. Deploy

**Note**: Inference Endpoints work best with models in Hugging Face format. You may need to convert your PyTorch models.

---

## 📁 Required Files for Spaces Deployment

### 1. Dockerfile

Create a `Dockerfile` in your Space repository:

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install PyTorch with CUDA support (for GPU Spaces)
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Copy application code
COPY app.py .
COPY models/ ./models/

# Expose port (Hugging Face Spaces uses port 7860)
EXPOSE 7860

# Run the application
CMD python app.py
```

### 2. Modified app.py for Spaces

Your `app.py` needs minor modifications to work with Hugging Face Spaces:

```python
# Add at the end of app.py, replace the if __name__ == "__main__" block:

if __name__ == "__main__":
    import os
    # Hugging Face Spaces uses port 7860 and host 0.0.0.0
    port = int(os.getenv("PORT", 7860))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
```

### 3. README.md for Your Space

Create a `README.md` in your Space repository:

```markdown
---
title: SkinSight AI
emoji: 🏥
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
---

# SkinSight AI - Skin Disease Detection

AI-powered skin disease analysis using deep learning. Upload a dermoscopic image to get instant diagnosis.

## API Endpoints

- `POST /predict` - Upload an image for prediction
- `GET /ping` - Health check endpoint

## Example Usage

```python
import requests

url = "https://zrn2003-skinsight-ai.hf.space/predict"
files = {"file": open("skin_image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```
```

---

## 🔧 Configuration for Spaces

### Environment Variables

Hugging Face Spaces automatically sets:
- `PORT=7860` (always use this port)
- `HOST=0.0.0.0` (required for external access)

### Hardware Selection

- **CPU Basic**: Free, slower inference
- **CPU Upgrade**: Paid, faster CPU inference
- **GPU T4 Small**: Paid, GPU acceleration (recommended for PyTorch models)

### Model File Size

- Free Spaces: Up to 50GB storage
- Your models: ~257MB total ✅ (well within limits)

---

## 📡 Accessing Your Deployed API

Once deployed, your API will be available at:

```
https://zrn2003-skinsight-ai.hf.space
```

### Endpoints:
- **Health Check**: `GET https://zrn2003-skinsight-ai.hf.space/ping`
- **Prediction**: `POST https://zrn2003-skinsight-ai.hf.space/predict`

### Example cURL:

```bash
curl -X POST https://zrn2003-skinsight-ai.hf.space/predict \
  -F "file=@skin_image.jpg"
```

### Example Python:

```python
import requests

# Health check
response = requests.get("https://zrn2003-skinsight-ai.hf.space/ping")
print(response.json())

# Prediction
with open("skin_image.jpg", "rb") as f:
    files = {"file": f}
    response = requests.post(
        "https://zrn2003-skinsight-ai.hf.space/predict",
        files=files
    )
    print(response.json())
```

---

## 🔄 Auto-Deployment

Hugging Face Spaces automatically:
- ✅ Rebuilds when you push changes
- ✅ Keeps your server running 24/7
- ✅ Handles restarts on failure
- ✅ Provides logs and monitoring

### View Logs:

1. Go to your Space page
2. Click **"Logs"** tab
3. Monitor startup and runtime logs

---

## 🛠️ Troubleshooting

### Model Files Not Found

Ensure your `models/` folder is uploaded:
```bash
# Check files in Space
ls -la models/
```

### Port Issues

Always use port `7860` for Hugging Face Spaces:
```python
port = int(os.getenv("PORT", 7860))
```

### GPU Not Available

If GPU is not available, models will run on CPU (slower but functional):
```python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
```

### Build Failures

Check the **Logs** tab in your Space for build errors. Common issues:
- Missing dependencies in `requirements.txt`
- Incorrect Dockerfile syntax
- Model files not found

---

## 💡 Best Practices

1. **Use GPU Hardware**: Your models benefit significantly from GPU acceleration
2. **Monitor Logs**: Regularly check logs for errors or warnings
3. **Test Locally First**: Test your Dockerfile locally before pushing:
   ```bash
   docker build -t skinsight-test .
   docker run -p 7860:7860 skinsight-test
   ```
4. **Add Error Handling**: Ensure your app handles missing models gracefully
5. **Rate Limiting**: Consider adding rate limiting for public APIs

---

## 📊 Monitoring & Analytics

Hugging Face Spaces provides:
- **Uptime monitoring**: Automatic restart on failure
- **Logs**: Real-time application logs
- **Usage metrics**: View API call statistics (if enabled)

---

## 🔐 Security Considerations

1. **CORS**: Your current CORS allows all origins (`allow_origins=["*"]`). Consider restricting:
   ```python
   allow_origins=["https://your-frontend-domain.com"]
   ```

2. **API Keys**: Consider adding authentication for production:
   ```python
   from fastapi import Header, HTTPException
   
   API_KEY = os.getenv("API_KEY", "your-secret-key")
   
   @app.post("/predict")
   async def predict(
       file: UploadFile = File(...),
       x_api_key: str = Header(None)
   ):
       if x_api_key != API_KEY:
           raise HTTPException(status_code=401, detail="Invalid API key")
       # ... rest of your code
   ```

3. **Rate Limiting**: Add rate limiting to prevent abuse:
   ```python
   from slowapi import Limiter, _rate_limit_exceeded_handler
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
   
   @app.post("/predict")
   @limiter.limit("10/minute")
   async def predict(...):
       # ... your code
   ```

---

## 🎯 Next Steps

1. ✅ Create your Hugging Face Space
2. ✅ Upload all required files
3. ✅ Wait for automatic build (5-10 minutes)
4. ✅ Test your API endpoints
5. ✅ Update your frontend to use the new API URL
6. ✅ Share your Space URL!

---

## 📚 Additional Resources

- [Hugging Face Spaces Documentation](https://huggingface.co/docs/hub/spaces)
- [Docker SDK Guide](https://huggingface.co/docs/hub/spaces-sdks-docker)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

**Your API will be live at**: `https://zrn2003-skinsight-ai.hf.space` 🚀
