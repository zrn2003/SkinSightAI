# SkinSight: Technical Implementation Analysis

This document provides a detailed technical breakdown of the SkinSight application, specifically focusing on the machine learning pipeline, model architectures, and image processing strategies.

## 1. System Architecture: The Two-Stage Pipeline

SkinSight employs a sequential **Filter-then-Diagnose** architecture. This design decision was made to maximize robustness in real-world scenarios where users might upload irrelevant images.

### Stage 1: The Filter Model (Data Rejection)
*   **Objective:** To determine if an input image is a valid dermoscopic skin image or a random object.
*   **Model Architecture:** **ResNet18**.
    *   *Why ResNet18?* It is lightweight and fast, making it ideal for a "gatekeeper" model that needs to process every single input efficiently before passing it to heavier diagnostic models.
*   **Classes:** `Random Object` (0), `Skin` (1).
*   **Key Preprocessing:**
    *   **Hair Removal:** OpenCV Inpainting ($7 \times 7$ kernel).
    *   **CLAHE:** Contrast Limited Adaptive Histogram Equalization (Clip Limit: 2.0).
    *   **Shades of Grey:** A color constancy algorithm used to normalize lighting variabilities (Power: 6). This is **exclusive** to the filter stage to force the model to learn structural features rather than relying on color biases of non-skin images.

### Stage 2: The Diagnostic Model (Fusion Ensemble)
*   **Objective:** To classify a validated skin image into specific disease categories.
*   **Model Architecture:** **Feature-Level Fusion Ensemble**.
    *   **Backbone A:** **ResNet50** (Captures deep, hierarchical features).
    *   **Backbone B:** **InceptionV3** (Captures multi-scale features via inception modules).
    *   **Fusion Strategy:** The feature vectors from both backbones (after the global average pooling layer) are concatenated.
    *   **Classifier Head:**
        *   Linear (Combined Features $\to$ 1024)
        *   ReLU Activation
        *   Dropout ($p=0.6$) for regularization
        *   Linear (1024 $\to$ Num Classes)
*   **Classes:** `Melanoma`, `Tinea` (and potentially others).
*   **Key Preprocessing:**
    *   **Hair Removal:** Same as Stage 1.
    *   **CLAHE:** Same as Stage 1.
    *   *Note:* **Shades of Grey is NOT applied** in this stage. Color is a critical diagnostic feature for dermatology (e.g., the variegated colors of melanoma), so we preserve the original color distribution after CLAHE.

## 2. Image Preprocessing Pipelines

Consistency between training and inference data is paramount. We implement identical preprocessing chains in `app.py`.

### A. Digital Hair Removal
Hair often occludes lesion details. We use a **Blackhat Morphological Operation** to detect dark hair structures against the lighter skin background, creating a mask. **Telea Inpainting** is then used to fill in the masked areas based on the surrounding pixels.

```python
# Pseudo-implementation
gray = rgb_to_gray(image)
kernel = structural_element((17, 17))
blackhat = morphology(gray, BLACKHAT, kernel)
mask = threshold(blackhat)
clean_image = inpaint(image, mask)
```

### B. CLAHE (Contrast Enhancement)
Dermoscopic images often suffer from poor lighting or low contrast. CLAHE improves the local contrast of the image, enhancing the visibility of lesion boundaries and texture patterns without amplifying noise excessively.

### C. Shades of Grey (Color Constancy)
This algorithm estimates the illuminant of the scene and corrects it. It generalizes the "Gray World" hypothesis.
$$ \left( \frac{\int (f(x)^p dx)}{\int dx} \right)^{1/p} = k \cdot e $$
It ensures that the "Filter Model" is not easily fooled by the overall color cast of an image (e.g., a reddish sunset vs. reddish skin).

## 3. Training & Validation

*   **Loss Function:** CrossEntropyLoss (for both stages).
*   **Optimizer:** Adam / SGD with momentum.
*   **Imbalance Handling:** Implemented `WeightedRandomSampler` during training to ensure the model sees an equal distribution of rare classes (like Melanoma) vs common ones during training batches.

## 4. Performance Metrics (Recent Validation)

Based on recent testing (`TEST_REPORT.md`):
*   **Filter Accuracy:** ~100% on test samples (Robust rejection of random images).
*   **Diagnostic Accuracy:** High confidence (>90%) on correct predictions.
*   **Latency:** Real-time inference capability on GPU-enabled endpoints.

## 5. Future Roadmap
*   **Segmentation:** Add a UNet semantic segmentation branch to isolate the lesion area for explainability.
*   **Metadata Integration:** Fuse patient metadata (age, sex, anatomic site) into the fully connected layer of the ensemble model for improved context-aware diagnosis.
