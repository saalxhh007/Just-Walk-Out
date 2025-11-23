from insightface.app import cv2
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .qdrant_client import qdrant, collection_name
import embeddings.qdrant_client as qc

import numpy as np
from insightface.app import FaceAnalysis 
import json

import embeddings.np_face_embeddings as npface
import embeddings.qdrant_client as qdrant

model = FaceAnalysis(name="buffalo_l")
model.prepare(ctx_id=0)

COSINE_THRESHOLD = 0.35
EUCLIDEAN_THRESHOLD = 0.7

# Create your views here.
# Save Embedding For a new client
def saveEmbedding(img_array, name, id):
    try:
        embedding = npface.get_image_embedding(img_array, npface.model)
        if embedding is None:
            return 
        qdrant.qdrant.upsert(
            collection_name=qdrant.collection_name,
            points=[
                qdrant.qmodels.PointStruct(
                    id=qdrant.generate_session(),
                    payload={
                        "id": id,
                        "name": name,
                    },
                    vector=embedding,
                ),
            ],
        )
    except Exception as e:
        print(f"Error in saveEmbedding for {name} (id={id}): {str(e)}")

async def get_image_embedding(img_array, model):
    faces = model.get(img_array)
    if len(faces) == 0:
        return None

    embedding = faces[0].embedding
    return embedding.tolist()

# Get Client Info From Embedding
@csrf_exempt
async def getClientFromImage(request):
    embedding = request.POST.get('embedding')
    
    if not embedding:
        return JsonResponse({"message": "No image file & no embedding was provided."}, status=400)
    try:
        embedding = json.loads(embedding)
        if isinstance(embedding, list) and isinstance(embedding[0], list):
            embedding = embedding[0]
        if isinstance(embedding, (float, int)):
            embedding = [embedding]
        elif not isinstance(embedding, list):
            return JsonResponse({"message": "Invalid embedding type."}, status=400)
    except Exception as e:
        return JsonResponse({"message": f"Failed to generate embedding: {str(e)}"}, status=500)
    if embedding is None:
        return JsonResponse({"message": "No face detected in image."}, status=404)

    try:
        result = qdrant.qdrant.search(
            collection_name=collection_name,
            query_vector=embedding,
            limit=1,
            with_vectors=True,
        )
    except Exception as e:
        return JsonResponse({"message": f"Vector search failed: {str(e)}"}, status=500)
    
    if not result:
        return JsonResponse({"message": "No matching embedding found."}, status=404)
    
    point = result[0]
    payload = point.payload or {}
    score = point.score
    if score < COSINE_THRESHOLD:
        return JsonResponse({"message": "No similar face found."}, status=404)
    data = {
        "id": point.id,
        "score": point.score,
        "vector": point.vector,
        "payload": payload,
    }

    return JsonResponse(data, status=200)

# Return All Embeddings
@csrf_exempt
def get_embeddings(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET requests are allowed."}, status=405)

    try:
        result = qc.qdrant.scroll(
            collection_name=collection_name,
            limit=100,
            with_vectors=True,
        )
        points, _ = result

        data = []
        for point in points:
            vector = [float(v) for v in point.vector] if point.vector else []
            data.append({
                "id": point.id,
                "vector": vector,
                "payload": point.payload
            })

        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Delete All Embeddings
@csrf_exempt
def delete_embeddings(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE requests are allowed."}, status=405)

    try:
        # ✅ Get ID from query params (?id=...)
        point_id = request.GET.get("id")
        if not point_id:
            return JsonResponse({"error": "Missing 'id' query parameter."}, status=400)

        # ✅ Perform deletion
        qc.qdrant.delete(
            collection_name=collection_name,
            points_selector=qc.qmodels.PointIdsList(points=[point_id])
        )

        return JsonResponse({"message": f"Embedding with ID {point_id} deleted successfully."}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)