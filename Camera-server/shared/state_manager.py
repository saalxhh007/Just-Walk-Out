import redis
import json
import numpy as np

r = redis.StrictRedis(host="localhost", port=6379, db=0, decode_responses=True)
pubsub = r.pubsub()

def save_face(face_id, face_data):
    if "embedding" in face_data and not isinstance(face_data["embedding"], list):
        face_data["embedding"] = face_data["embedding"].tolist()
    r.hset("faces", face_id, json.dumps(face_data))

def get_all_faces():
    faces_raw = r.hgetall("faces")
    faces = {}
    for fid, data in faces_raw.items():
        face_data = json.loads(data)
        if "embedding" in face_data:
            face_data["embedding"] = np.array(face_data["embedding"])
        faces[fid] = face_data
    return faces

def get_face(face_id):
    data = r.hget("faces", face_id)
    return json.loads(data) if data else None

def update_cart(face_id, cart):
    if r.hexists("faces", face_id):
        face_data = json.loads(r.hget("faces", face_id))
        face_data["cart"] = cart
        r.hset("faces", face_id, json.dumps(face_data))

def publish_embedding(face_id, embedding, name, timestamp):
    r.publish("new_face", json.dumps({
        "id": face_id,
        "embedding": embedding.tolist(),
        "name": name,
        "timestamp": timestamp
    }))

def listen_for_faces(face_info_cache):
    pubsub.subscribe("new_face")
    for message in pubsub.listen():
        if message["type"] == "message":
            data = json.loads(message["data"])
            face_info_cache[data["id"]] = {
                "embedding": np.array(data["embedding"]),
                "name": data["name"],
                "timestamp": data["timestamp"],
                "cart": []
            }
