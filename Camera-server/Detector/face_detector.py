from ultralytics import YOLO
from insightface.app import FaceAnalysis
import cv2

import uuid
import json
import requests
import threading
import numpy as np
from datetime import datetime

from shared.state_manager import save_face, publish_embedding
from shared.shared_state import face_info_cache

# detects & reconizes faces
model = YOLO(r"C:\Users\ilisa\Desktop\Market-amazon-tracking\Camera-server\Detector\yolov8n-face.pt")
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0, det_size=(320, 320))

model_lock = threading.Lock()

# Avoiding ID regeneration
face_cache = {}

# threads to avoid multi-tasking
curr_frame = None
frame_lock = threading.Lock()
stop_flag = False

def capture_frame(cap, frame_dict, key, source=None):
    global stop_flag
    while not stop_flag:
        ret, frame = cap.read()     
        if not ret or frame is None:
            print(f"[WARN] Lost connection to {key} camera. Reconnecting...")
            try:
                cap.release()
                cap = cv2.VideoCapture(source if source else 0)
            except Exception as e:
                print(f"[ERROR] Reconnection failed for {key}: {e}")
            continue

        with frame_lock:
            frame_dict[key] = frame

def cosine_similarity(a, b):
    a = np.asarray(a, dtype=np.float32).ravel()
    b = np.asarray(b, dtype=np.float32).ravel()
    na = np.linalg.norm(a)
    nb = np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))

def find_similar_face(embedding, threshold=0.6):
    embedding = embedding / np.linalg.norm(embedding)
    for face_id, data in face_cache.items():
        cached_embedding = data["embedding"]
        sim = cosine_similarity(embedding, cached_embedding)
        if sim > threshold:
            return face_id
    return None

def drawRectangle(frame, status="detect enterance"):
    height, width, _ = frame.shape

    x1 = int(width * 0.2)
    x2 = int(width * 0.8)
    y1 = int(height / 2)
    y2 = height - 10

    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.putText(
        frame,
        status,
        (x1, y1 - 10),
        cv2.FONT_HERSHEY_COMPLEX,
        0.8,
        (0, 255, 0),
        2
    )
    return (x1, y1, x2, y2)

def detectFaces(frame, rect):
    (rx1, ry1, rx2, ry2) = rect
    roi = frame[ry1:ry2, rx1:rx2]
    with model_lock:
        results = model.predict(source=roi, imgsz=320, conf=0.7, verbose=False)
        boxes = results[0].boxes.xyxy.cpu().numpy().astype(int) if len(results) > 0 else []
        faces = []

        for (x1, y1, x2, y2) in boxes:
            x1 += rx1
            x2 += rx1
            y1 += ry1
            y2 += ry1
            bbox = x1, y1, x2, y2
            face_crop = frame[y1:y2, x1:x2]
            if face_crop.size == 0:
                continue

            embedding = get_face_embedding(frame, bbox)   
            if embedding is None:
                name = f"Unknown_{uuid.uuid4().hex[:5]}"
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            else:
                name, timestamp = reconizeFace(embedding)
            faces.append({
                "bbox": (x1, y1, x2, y2),
                "face": face_crop,
                "name": name,
                "cart": [],
                "timestamp": timestamp 
            })

        return faces

def reconizeFace(embedding):
    existing_id = find_similar_face(embedding)
    if existing_id:
        name = face_cache[existing_id]["name"]
        timestamp = face_cache[existing_id].get("timestamp", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        return name, timestamp
    try:
        url = "http://127.0.0.1:8000/api/v1/embeddings/get-client-from-image/"

        data = {
            "embedding": json.dumps(embedding.tolist())
        }
        response = requests.post(url, data=data, timeout=3)
        # print(response.json())
        if response.status_code == 200:
            result = response.json()
            name = result["payload"].get("name", None)
        else:
            name = None
    except Exception as e:
        name = None
    
    if not name:
        name = f"Unknown_{uuid.uuid4().hex[:5]}"

    face_id = str(uuid.uuid4())
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    face_info_cache[face_id] = {
        "embedding": embedding,
    }
    face_cache[face_id] = {
        "embedding": embedding,
        "name": name,
        "cart": [],
        "timestamp": timestamp
        }
    
    face_data = {
        "name": name,
        "timestamp": timestamp
    }
    save_face(face_id, face_data)
    publish_embedding(face_id, embedding, name, timestamp)
    return name, timestamp

def get_face_embedding(frame, bbox):
    x1, y1, x2, y2 = bbox

    h, w, _ = frame.shape
    pad = 50
    x1 = max(0, x1 - pad)
    y1 = max(0, y1 - pad)
    x2 = min(w, x2 + pad)
    y2 = min(h, y2 + pad)

    face_crop = frame[y1:y2, x1:x2]
    if face_crop is None or face_crop.size == 0:
        return None

    face_rgb = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)

    faces = app.get(face_rgb)
    if len(faces) == 0:
        return None

    embedding = faces[0].embedding
    return embedding
