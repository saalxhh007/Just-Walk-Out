from django.urls import path
from . import views

urlpatterns = [
    path('embeddings/get-all/', views.get_embeddings, name='get_embeddings'),
    path('embeddings/delete/', views.delete_embeddings, name='delete_embedding'),
    path('embeddings/save/', views.saveEmbedding, name='saveEmbedding'),
    path('embeddings/get-client-from-image/', views.getClientFromImage, name='getClientFromImage'),
]