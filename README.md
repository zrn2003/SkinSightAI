# SkinSight: AI-Powered Skin Disease Analysis

SkinSight is an advanced AI application designed to assist in the early detection and classification of skin conditions. It utilizes a robust **two-stage deep learning pipeline** to first verify the presence of skin in an image and then accurately diagnose conditions, distinguishing between critical issues like **Melanoma** and common infections like **Tinea**.

## 🚀 Features

-   **Two-Stage Inference Pipeline:**
    1.  **Filter Stage:** Automatically rejects non-skin images (random objects) to prevent false positives.
    2.  **Diagnostic Stage:** Classifies valid skin images into specific disease categories.
-   **Advanced Preprocessing:** Incorporates clinical-grade image enhancement techniques:
    -   **Digital Hair Removal:** Using morphological operations and inpainting to remove obstructions.
    -   **CLAHE:** Contrast Limited Adaptive Histogram Equalization for enhancing texture details.
    -   **Color Constancy:** "Shades of Grey" algorithm (used in the filter stage) to normalize lighting conditions.
-   **Ensemble Deep Learning:** combines the power of **ResNet50** and **InceptionV3** for high-accuracy diagnosis.
-   **Modern Frontend:** A professional, responsive dashboard built with **React, Vite, and Tailwind CSS**.
-   **FastAPI Backend:** High-performance, asynchronous API for real-time inference.

## 🛠️ Tech Stack

-   **Backend:** Python, FastAPI, PyTorch, Torchvision, OpenCV, NumPy.
-   **Frontend:** React (TypeScript), Vite, Tailwind CSS, Lucide Icons.
-   **Models:** ResNet18 (Filter), ResNet50 + InceptionV3 (Fusion Ensemble).

## 📦 Installation & Setup

### Prerequisites
-   Python 3.8+ (with CUDA support recommended)
-   Node.js & npm

### 1. Backend Setup

```bash
# Navigate to the project root
cd "e:\Final YR project\skinsight\backend\New folder\Skin_disease"

# Create and activate virtual environment (already created as venv_new)
.\venv_new\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Backend Server
python app.py
```
*The backend runs on `http://localhost:8000`*

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Development Server
npm run dev
```
*The frontend runs on `http://localhost:8080` (or similar)*

## 🔍 Usage

1.  Open the frontend dashboard in your browser.
2.  Click the **Upload Area** to select a dermoscopic image (or drag and drop).
3.  The system will analyze the image:
    -   If it's **not skin**, it will be rejected.
    -   If it is skin, it will provide a diagnosis (Melanoma or Tinea) with a confidence score.
4.  Results are displayed in a clean, modal interface with severity indicators.

## 📁 Project Structure

-   `app.py`: Main FastAPI backend application.
-   `models/`: Stores trained PyTorch models (`filter_model.pth`, `fusion_ensemble.pth`).
-   `frontend/`: React application source code.
-   `TECHNICAL_IMPLEMENTATION.md`: Detailed breakdown of the model architectures and training logic.
