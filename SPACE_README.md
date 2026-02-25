---
title: SkinSight AI
emoji: 🏥
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
---

# SkinSight AI - Skin Disease Detection

AI-powered skin disease analysis using deep learning. Upload a dermoscopic image to get instant diagnosis of skin conditions including Melanoma and Tinea.

## 🚀 Features

- **Two-Stage Pipeline**: First filters non-skin images, then diagnoses valid skin conditions
- **Advanced Preprocessing**: Digital hair removal, CLAHE enhancement, color normalization
- **Ensemble Deep Learning**: Combines ResNet50 and InceptionV3 for high accuracy
- **Real-time Inference**: Fast API responses for immediate results

## 📡 API Endpoints

### Health Check
```bash
GET /ping
```

Response:
```json
{
  "status": "alive",
  "filter_loaded": true,
  "fusion_loaded": true,
  "device": "cuda"
}
```

### Prediction
```bash
POST /predict
Content-Type: multipart/form-data
```

**Request**: Upload an image file

**Response**:
```json
{
  "class": "Melanoma",
  "confidence": 0.95,
  "stage": "Diagnosis",
  "filter_check": "Passed (Skin)",
  "filter_confidence": 0.98
}
```

## 💻 Example Usage

### Python
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
    result = response.json()
    print(f"Diagnosis: {result['class']}")
    print(f"Confidence: {result['confidence']:.2%}")
```

### cURL
```bash
# Health check
curl https://zrn2003-skinsight-ai.hf.space/ping

# Prediction
curl -X POST https://zrn2003-skinsight-ai.hf.space/predict \
  -F "file=@skin_image.jpg"
```

### JavaScript/TypeScript
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('https://zrn2003-skinsight-ai.hf.space/predict', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

## 🔬 Model Architecture

- **Filter Model**: ResNet18 - Filters out non-skin images
- **Fusion Ensemble**: ResNet50 + InceptionV3 - Diagnoses skin conditions
- **Classes**: Melanoma, Tinea

## 📊 Performance

- Filter Accuracy: ~100% on test samples
- Diagnostic Accuracy: High confidence (>90%) on correct predictions
- Latency: Real-time inference on GPU

## ⚠️ Medical Disclaimer

This tool is for research and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions regarding medical conditions.

## 📚 Citation

If you use this model in your research, please cite:

```bibtex
@software{skinsight2025,
  title={SkinSight AI: Deep Learning for Skin Disease Detection},
  author={Your Name},
  year={2025},
  url={https://huggingface.co/zrn2003/SkinSight}
}
```

## 🔗 Links

- **Model Repository**: [zrn2003/SkinSight](https://huggingface.co/zrn2003/SkinSight)
- **Space API**: `https://zrn2003-skinsight-ai.hf.space`
