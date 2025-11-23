from face_detector import frame_lock
from face_detector import drawRectangle, detectFaces, capture_frame

import cv2
import threading
import time

frame = { "exit": None }

def connect_camera(url, name):
    while True:
        cap = cv2.VideoCapture(url)
        if cap.isOpened():
            print(f"[INFO] {name} camera connected successfully")
            return cap
        print(f"[WARN] Failed to connect to {name} camera. Retrying...")
        time.sleep(3)

cap_exit = connect_camera("http://192.168.1.4:8080/video", "Exit")

width, height = 640, 480
cap_exit.set(cv2.CAP_PROP_FRAME_WIDTH, width)
cap_exit.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
cap_exit.set(cv2.CAP_PROP_BUFFERSIZE, 1)

t2 = threading.Thread(target=capture_frame, args=(cap_exit, frame, "exit", "http://192.168.1.4:8080/video"), daemon=True)
t2.start()

try:
    while True:
        with frame_lock:
            frame_exit = frame["exit"].copy() if frame["exit"] is not None else None

        if frame_exit is not None:
            (rx1, ry1, rx2, ry2) = drawRectangle(frame_exit, "detect Exit")
            faces_exit = detectFaces(frame_exit)

            for face in faces_exit :
                (x1, y1, x2, y2) = face["bbox"]
                name = face["name"]

                cv2.rectangle(frame_exit, (x1, y1), (x2, y2), (255, 0, 0), 2)

                if (x1 > rx1 and x2 < rx2 and y1 > ry1 and y2 < ry2):
                    cv2.rectangle(frame_exit, (x1, y1), (x2, y2), (0, 0, 255), 2)
                    cv2.putText(frame_exit, f"{name} EXIT / PAYMENT", (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

            if frame_exit is not None and frame_exit.size > 0:
                frame_exit_resized = cv2.resize(frame_exit, (640, 480))
                cv2.imshow("Exit Camera", frame_exit_resized)
            else:
                print("[WARN] Skipping empty exit frame")

        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("[INFO] Quit signal received")
            stop_flag = True
            break
except KeyboardInterrupt:
    print("[INFO] Interrupted by user")
finally:
    cv2.destroyAllWindows()
    print("[INFO] Camera closed successfully")