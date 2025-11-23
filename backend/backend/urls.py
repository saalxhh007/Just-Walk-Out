from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('clients.urls')),
    path('api/v1/', include('embeddings.urls')),
    path('api/v1/', include('cart.urls')),
    path('api/v1/', include('store_in_out.urls'))
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)