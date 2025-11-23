import uuid
from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

def generate_session() -> str:
    session_id = str(uuid.uuid4())
    return session_id

qdrant = QdrantClient(host="localhost", port=6333)
collection_name = "face_embeddings"

collections = qdrant.get_collections().collections

if not any(c.name == collection_name for c in collections):
    qdrant.create_collection(
        collection_name = collection_name,
        vectors_config = qmodels.VectorParams(size=512, distance=qmodels.Distance.COSINE),
    )