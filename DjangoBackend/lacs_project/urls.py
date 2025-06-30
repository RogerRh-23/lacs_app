# DjangoBackend/lacs_project/urls.py
from django.contrib import admin
from django.urls import path, include # Asegúrate de que 'include' esté importado

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')), # Esta línea es la clave
    # Puedes añadir otras URLs de tus APIs aquí
]
