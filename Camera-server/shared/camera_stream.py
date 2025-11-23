import cv2
import threading
import time

class CameraStream:
    def __init__(self, url, name="Enterance Camera", reconnect_interval=3):
        self.url = url
        self.name = name
        self.reconnect_interval = reconnect_interval

        self.frame = None
        self.frame_lock = threading.Lock()
        self.stop_flag = threading.Event()

        self.cap = None
        self.thread = None

    def connect_camera(self):
        """Try to connect to camera, retrying until successful"""
        while not self.stop_flag.is_set():
            if self.url:
                cap = cv2.VideoCapture(self.url, cv2.CAP_FFMPEG)
            else:
                cap = cv2.VideoCapture(0)
            if cap.isOpened():
                width, height = 640, 480
                cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
                cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
                print(f"[INFO] {self.name} connected successfully")
                return cap
            print(f"[WARN] Failed to connect to {self.name}")
            time.sleep(self.reconnect_interval)
        return None

    def capture_loop(self):
        """Continuously capture frames from the camera"""
        self.cap = self.connect_camera()
        if not self.cap:
            print(f"[ERROR] Unable to connect to {self.name}. Exiting capture loop")
            return

        while not self.stop_flag.is_set():
            for _ in range(2):
                self.cap.grab()
            ret, frame = self.cap.read()
            if not ret or frame is None:
                print(f"[WARN] Lost connection to {self.name}")
                print("Reconnecting...")
                self.cap.release()
                time.sleep(1)
                self.cap = self.connect_camera()
                continue

            with self.frame_lock:
                frame = cv2.flip(frame, 1)
                self.frame = frame

        if self.cap:
            self.cap.release()

    def start(self):
        """Start capturing in thread"""
        if self.thread and self.thread.is_alive():
            print(f"[INFO] {self.name} stream running")
            return

        self.stop_flag.clear()
        self.thread = threading.Thread(target=self.capture_loop, daemon=True)
        self.thread.start()
        print(f"[INFO] {self.name} thread started")

    def read(self):
        """Safely get the latest frame"""
        with self.frame_lock:
            return None if self.frame is None else self.frame.copy()

    def stop(self):
        """Stop capturing and release resources"""
        self.stop_flag.set()
        if self.thread:
            self.thread.join(timeout=3)
        if self.cap:
            self.cap.release()
        print(f"[INFO] {self.name} stopped.")