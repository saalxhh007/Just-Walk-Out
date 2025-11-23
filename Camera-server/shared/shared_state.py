import threading

face_cache = {}
face_info_cache = {}

cache_lock = threading.Lock()