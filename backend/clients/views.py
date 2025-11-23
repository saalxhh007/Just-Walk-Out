from .models import Client
from embeddings.views import saveEmbedding

from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from PIL import Image
import numpy as np
import asyncio
import json

# Fetch the clients page by page
def allClients(request):
    clients = Client.objects.all()

    page = int(request.GET.get("page", 1))
    limit = int(request.GET.get("limit", 10))
    
    paginator = Paginator(clients, limit)
    current_page = paginator.get_page(page)

    data = [
        {
            "id": client.id,
            "name": client.name,
            "email": client.email,
            "phone": client.phone,
            "photo": client.photo.url if client.photo else "/media/client-avatars/avatar.jpg"
        }
        for client in current_page
    ]
    return JsonResponse({
        "results": data,
        "total": paginator.count,
        "page": current_page.number,
        "num_pages": paginator.num_pages,
    })

# Fetch a client by ID
def getClient(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
        data = {
            "id": client.id,
            "name": client.name,
            "email": client.email,
            "phone": client.phone,
            "photo": client.photo.url if client.photo else "/media/client-avatars/avatar.jpg"
        }
        return JsonResponse(data)
    except Client.DoesNotExist:
        return JsonResponse({"error": "Client not found"}, status=404)

# Create a new client by ID
@csrf_exempt
def createClient(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)
    
    required_fields = ["name", "email", "phone"]
    for field in required_fields:
        if field not in request.POST:
            return JsonResponse({"error": f"Missing field: {field}"}, status=400)

    if "photo" not in request.FILES:
        return JsonResponse({"error": "Missing field: photo"}, status=400)

    try:
        name = request.POST["name"]
        client = Client.objects.create(
            name = name,
            email = request.POST["email"],
            phone = request.POST["phone"],
            photo = request.FILES["photo"],
        )

        image = Image.open(request.FILES["photo"]).convert("RGB")
        img_array = np.array(image)
        saveEmbedding(img_array, name, client.id)

        return JsonResponse(
            {
                "message": "Client created successfully.",
                "employee": {
                    "id": client.id,
                    "name": client.name,
                    "email": client.email,
                    "photo": client.photo.url if client.photo else None,
                },
            }
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Update a client based on ID
def updateClient(request, client_id):
    if request.method == "PUT":
        try:
            client = Client.objects.get(id=client_id)
            data = json.loads(request.body)
            
            client.name = data.get("name", client.name)
            client.email = data.get("email", client.email)
            client.phone = data.get("phone", client.phone)
            client.photo = data.get("photo", client.photo)

            client.save()
            return JsonResponse({ "message": "Client updated successfully."})
        
        except Client.DoesNotExist:
            return JsonResponse({"error": "Client not found."}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        
    return JsonResponse({"error": "Invalid request method."}, status=405)

# Delete a client based on ID
@csrf_exempt
def deleteClient(request, client_id):
    if request.method == "DELETE":
        try:
            client = Client.objects.get(id=client_id)
            client.delete()

            return JsonResponse({"message": "Client deleted successfully."})
        except Client.DoesNotExist:
            return JsonResponse({"error": "Client not found."}, status=404)
        
    return JsonResponse({"error": "Invalid request method."}, status=405)