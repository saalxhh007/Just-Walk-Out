from shared.camera_stream import CameraStream
from Detector.face_detector import drawRectangle, detectFaces

import cv2

from ultralytics.utils import LOGGER
LOGGER.setLevel("ERROR")
entrance_cam = CameraStream(0, "Entrance")
entrance_cam.start()

frame_count = 0
DETECT_INTERVAL = 5

try:
    while True:
        frame_enter = entrance_cam.read()

        if frame_enter is None:
            continue
        else:
            if frame_count % DETECT_INTERVAL == 0:
                (rx1, ry1, rx2, ry2) = drawRectangle(frame_enter)
                faces_enter = detectFaces(frame_enter, (rx1, ry1, rx2, ry2))

                for face in faces_enter:
                    (x1, y1, x2, y2) = face["bbox"]
                    name = face["name"]
                    timestamp = face["timestamp"]
                    cart = face["cart"]

                    cv2.rectangle(frame_enter, (x1, y1), (x2, y2), (255, 0, 0), 2)

                    if (x1 > rx1 and x2 < rx2 and y1 > ry1 and y2 < ry2):
                        cv2.rectangle(frame_enter, (x1, y1), (x2, y2), (0, 0, 255), 2)
                        cv2.putText(frame_enter, f"{name}", (x1, y1 - 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                        cv2.putText(frame_enter, "IN STORE", (x1, y1 - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                        cv2.putText(frame_enter, f"{timestamp}", (x1, y1 + 15),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
                        cv2.putText(frame_enter, f"{'Cart Is Empty' if len(cart) == 0 else len(cart)}", (x1, y1 + 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

                if frame_enter is not None and frame_enter.size > 0:
                    frame_enter_resized = cv2.resize(frame_enter, (640, 480))
                    cv2.imshow("Entrance Camera", frame_enter_resized)
                else:
                    print("[WARN] Skipping empty exit frame")
            
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("[INFO] Quit signal received")
            break
except KeyboardInterrupt:
    print("[INFO] Interrupted by user")
finally:
    entrance_cam.stop()
    cv2.destroyAllWindows()
    print("[INFO] Entrance Camera closed successfully")