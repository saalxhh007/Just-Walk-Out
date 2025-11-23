import numpy as np

from shared.state_manager import get_all_faces
from shared.shared_state import face_info_cache

SIMILARITY_THRESHOLD = 0.3

def cosine_similarity(a, b):
    a = np.asarray(a, dtype=np.float32).ravel()
    b = np.asarray(b, dtype=np.float32).ravel()
    na = np.linalg.norm(a)
    nb = np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))

def reconizeFaces(app, frame):
    faces = app.get(frame)
    known_faces = get_all_faces()
    embedding_cache = face_info_cache 

    recognized_faces = []

    for face in faces:
        embedding = face.normed_embedding
        bbox = face.bbox.astype(int)
        # print(f"[DEBUG] embedding: {embedding.shape}")

        best_score = 0
        matched_face_id = None
        
        for face_id, cached_face in embedding_cache.items():
            cached_embedding = cached_face["embedding"]
            score = cosine_similarity(cached_embedding, embedding)

            # print(f"[DEBUG] {face_id} score={score:.4f}")
            if score >= best_score:
                best_score = score
                matched_face_id  = face_id
        
        if best_score > SIMILARITY_THRESHOLD and matched_face_id in known_faces:
            if matched_face_id in known_faces:
                face_data = known_faces[matched_face_id ]
                recognized_faces.append({
                    "id": matched_face_id ,
                    "name": face_data["name"],
                    "bbox": bbox,
                    "cart": face_data.get("cart", [])
                    })
                print(f"[INFO] name={face_data.get('name')} ")
            else:
                print(f"[WARN] {matched_face_id} not found in known_faces best_score={best_score:.3f}")   
        else:
            print("[INFO] No match found for this face")
    return recognized_faces
