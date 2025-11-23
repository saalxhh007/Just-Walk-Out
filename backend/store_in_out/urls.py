from django.urls import path
from . import views

urlpatterns = [
    path('store-in/', views.storeIn, name='storeIn'),
    path('store-out/', views.storeOut, name='storeOut')
]