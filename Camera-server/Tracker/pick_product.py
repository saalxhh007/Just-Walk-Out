import mediapipe as mp
import cv2
import math

def detect_products(frame, model):
    results = model(frame, stream=True)
    detections = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            cls = int(box.cls[0])
            name = result.names[cls]
            detections.append({
                "name": name,
                "bbox": (x1, y1, x2, y2),
                "confidence": conf
            })
    return detections

hands = mp.solutions.hands
draw = mp.solutions.drawing_utils
hands_detector = hands.Hands(static_image_mode=False,
                            max_num_hands=4,
                            min_detection_confidence=0.5,
                            min_tracking_confidence=0.5)    

def get_center(bbox):
    x1, y1, x2, y2 = bbox
    center_x = int((x1 + x2) / 2)
    center_y = int((y1 + y2) / 2)
    return center_x, center_y

def get_hand_centers(frame):
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands_detector.process(frame_rgb)
    hand_centers = []

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            draw.draw_landmarks(
                frame,
                hand_landmarks,
                hands.HAND_CONNECTIONS
            )

            x = int(sum([lm.x for lm in hand_landmarks.landmark]) / 21 * frame.shape[1])
            y = int(sum([lm.y for lm in hand_landmarks.landmark]) / 21 * frame.shape[0])
            hand_centers.append((x, y))

            cv2.circle(frame, (x, y), 8, (0, 0, 255), -1)

    return hand_centers

def link_product_to_person(product_bbox, faces, hand_centers):
    px, py = get_center(product_bbox)

    min_dist_hand = float("inf")
    closet_hand = None

    for hx, hy in hand_centers:
        dist = math.sqrt((px - hx)**2 + (py - hy)**2)
        if dist < min_dist_hand:
            min_dist_hand = dist
            closet_hand = (hx, hy)

    if closet_hand is None:
        return None
    
    min_dist_face = float("inf")
    closest_face_id = None

    for face in faces:
        fx, fy = get_center(face["bbox"])
        dist = math.sqrt(((closet_hand[0] - fx)**2 + (closet_hand[1] - fy)**2))

        if dist < min_dist_face:
            min_dist_face = dist
            closest_face_id = face["face_id"]
    if closest_face_id is None:
        return None
    
    return closest_face_id  
    