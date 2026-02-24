from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import cv2

app = FastAPI()

cap = cv2.VideoCapture("http://192.168.1.2:8080/video")

def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            continue

        # --- HERE your detector logic can run ---
        # frame = drawRectangle(frame)
        # faces = detectFaces(frame)
        # ----------------------------------------

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.get("/camera/entrance")
def camera_feed():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
