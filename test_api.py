import requests
import os
import sys

URL = "http://localhost:8000/predict"

def test_image(image_path, expected_label=None):
    if not os.path.exists(image_path):
        print(f"File not found: {image_path}")
        return

    with open(image_path, "rb") as f:
        files = {"file": f}
        try:
            response = requests.post(URL, files=files)
            if response.status_code == 200:
                data = response.json()
                print(f"File: {os.path.basename(image_path)[:20]}...")
                print(f"  Expected: {expected_label}")
                print(f"  Got: {data.get('class', 'Unknown')}")
                print(f"  Stage: {data.get('stage', 'Unknown')}")
                print(f"  Conf: {data.get('confidence', 0):.4f}")
                print("-" * 30)
            else:
                print(f"Error {response.status_code}")
        except Exception as e:
            print(f"Request failed: {e}")

if __name__ == "__main__":
    base_dir = r"e:\Final YR project\skinsight\backend\New folder\Skin_disease\Dataset"
    
    # Random
    test_image(os.path.join(base_dir, "random", "-0D39FCF1-152A-4C52-A0F2-64670E54DB6D-png_jpg.rf.9e0a82fb2c7ea3c44f18bc9b70ddff98.jpg"), "Random Object")
    test_image(os.path.join(base_dir, "random", "-1D5949D1-5187-454E-8ACC-924AD82CAC9C-png_jpg.rf.5c4be3999168c464f3ecb7e8a985f332.jpg"), "Random Object")

    # Melanoma
    test_image(os.path.join(base_dir, "Melanoma", "ISIC_6652978.jpg"), "Melanoma")
    
    # Tinea
    test_image(os.path.join(base_dir, "Tinea", "0_11.jpg"), "Tinea")
