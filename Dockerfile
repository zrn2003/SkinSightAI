# Read the doc: https://huggingface.co/docs/hub/spaces-sdks-docker
# Dockerfile optimized for Hugging Face Spaces with GPU support

FROM python:3.11-slim

# Install system dependencies for OpenCV and image processing (requires root)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user (Hugging Face best practice)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Copy requirements and install Python dependencies
COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Install PyTorch with CUDA support (for GPU Spaces)
# For CPU-only, use: pip install torch torchvision torchaudio
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Copy application code
COPY --chown=user . /app

# Expose port (Hugging Face Spaces uses port 7860)
EXPOSE 7860

# Run the application using uvicorn directly (Hugging Face recommended)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
