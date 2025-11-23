import cv2
import threading
from ultralytics import YOLO
from insightface.app import FaceAnalysis
from datetime import datetime

from shared.state_manager import get_all_faces, update_cart
from .pick_product import detect_products, link_product_to_person, get_hand_centers
from .cart_managment import add_to_cart, remove_from_cart

from shared.shared_state import face_info_cache
from shared.state_manager import listen_for_faces
from .face_tracker import reconizeFaces
from shared.camera_stream import CameraStream

from ultralytics.utils import LOGGER
LOGGER.setLevel("ERROR")

model = YOLO("C:/Users/ilisa/runs/detect/train8/weights/best.pt", verbose=False)
app = FaceAnalysis(name="buffalo_l", providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(320, 320))

prev_products = {} 

t3 = threading.Thread(target=listen_for_faces, args=(face_info_cache,), daemon=True)
t3.start()

tracker_cam = CameraStream("http://192.168.1.3:8080/video", "Tracker")
tracker_cam.start()

def trackProducts(frame):
    global prev_products

    faces = reconizeFaces(app, frame)
    products = detect_products(frame, model)
    hand_centers = get_hand_centers(frame)

    # print("detected hands with hand centers :", hand_centers)
    products_names = [p["name"] for p in products]
    prev_names = list(prev_products.keys())

    taken_products = [p for p in prev_names if p not in products_names]
    returned_products = [p for p in products_names if p not in prev_names]

    for product_name in taken_products:
        if prev_products[product_name]:
            product_bbox = prev_products[product_name][0]
            face_id = link_product_to_person(product_bbox, faces, hand_centers)
            if face_id:
                add_to_cart(face_id, product_name, face_info_cache)
                face_data = get_all_faces().get(face_id, {})
                update_cart(face_id, face_data.get("cart", []))
                print(f"{face_data.get('name')} taked {product_name}")

    for product_name in returned_products:
        if product_name in products_names:
            product_bbox = [p["bbox"] for p in products if p["name"] == product_name][0]
            face_id = link_product_to_person(product_bbox, faces, hand_centers)
            if face_id:
                remove_from_cart(face_id, product_name)
                face_data = get_all_faces().get(face_id, {})
                update_cart(face_id, face_data.get("cart", []))
                print(f"{face_data.get('name')} returned {product_name}")

    prev_products = {}
    for p in products:
        if p["name"] not in prev_products:
            prev_products[p["name"]] = []
        prev_products[p["name"]].append(p["bbox"])

    for p in products:
        (x1, y1, x2, y2) = p["bbox"]
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, p["name"], (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    for f in faces:
        if f.get("bbox") is not None and len(f["bbox"]) == 4:
            (x1, y1, x2, y2) = f["bbox"]
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
            cart = ", ".join(f["cart"]) if f["cart"] else "Cart: empty"
            cv2.putText(frame, f["name"], (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(frame, cart, (x1, y2 + 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    return frame

try:
    while True:
        frame_tracker = tracker_cam.read()

        if frame_tracker is not None:
            frame_tracker = trackProducts(frame_tracker)

            cv2.imshow("Smart Store Tracker", cv2.resize(frame_tracker, (640, 480)))
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
except KeyboardInterrupt:
    print("[INFO] Interrupted by user")
finally:
    tracker_cam.stop()
    cv2.destroyAllWindows()
    print("[INFO] Tracker stopped")