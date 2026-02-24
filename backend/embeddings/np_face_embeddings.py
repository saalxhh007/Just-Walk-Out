from insightface.app import FaceAnalysis
import numpy as np
from PIL import Image
import cv2

model = FaceAnalysis(name="buffalo_l")
model.prepare(ctx_id=0, det_size=(320, 320))

def get_np_array(file):
    image = Image.open(file).convert("RGB")
    img_array = np.array(image)
    return img_array

# Function to get embeddings from an uploaded image (in-memory)
def get_image_embedding(img_array, model):
    # print(img_array.shape, img_array.dtype)

    # Ensure correct type and memory layout
    img_array = np.ascontiguousarray(img_array, dtype=np.uint8)

    # Convert RGB → BGR
    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

    # print("Processed image shape:", img_bgr.shape, img_bgr.dtype)

    # Get face embeddings
    faces = model.get(img_bgr)

    if len(faces) == 0:
        return None

    embedding = faces[0].embedding
    return embedding.tolist()

if __name__ == "__main__":
    print(get_image_embedding(get_np_array("img.jpeg"), model))