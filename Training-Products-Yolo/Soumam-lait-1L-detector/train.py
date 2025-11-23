from ultralytics import YOLO
import cv2

model = YOLO(r"C:\Users\ilisa\runs\detect\train8\weights\best.pt")

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("[ERROR] Cannot access webcam.")
    exit()

print("[INFO] Press 'q' to quit the window.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("[WARN] Failed to grab frame.")
        break

    results = model(frame)

    for box in results[0].boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls = int(box.cls[0])
        label = model.names[cls]
        conf = box.conf[0]

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    cv2.imshow("Milk Box Detector", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("[INFO] Detection stopped successfully.")