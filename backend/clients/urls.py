from django.urls import path
from . import views

urlpatterns = [
    path('clients/', views.allClients, name='allClients'),
    path('clients/<int:client_id>/', views.getClient, name='getClient'),
    path("clients/create/", views.createClient, name="createClient"),
    path('clients/update/<int:client_id>/', views.updateClient, name="updateClient"),
    path('clients/delete/<int:client_id>/', views.deleteClient, name="deleteClient")
]