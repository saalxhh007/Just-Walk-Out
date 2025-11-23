from django.shortcuts import render

# Create your views here.
# def get_all():

# def create_cart():

# def delete_cart():

# def get_client_cart():
def add_to_cart(face_id, product_name, face_cache):
    if face_id in face_cache:
        if product_name not in face_cache[face_id]["cart"]:
            face_cache[face_id]["cart"].append(product_name)
            print(f"🛒 Added {product_name} to {face_cache[face_id]['name']}'s cart.")


def remove_from_cart(face_id, product_name, face_cache):
    if face_id in face_cache:
        if product_name in face_cache[face_id]["cart"]:
            face_cache[face_id]["cart"].remove(product_name)
            print(f"❌ Removed {product_name} from {face_cache[face_id]['name']}'s cart.")