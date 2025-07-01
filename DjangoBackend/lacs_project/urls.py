from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')), # Esta línea es crucial
    # Puedes añadir otras URLs aquí si las tienes
]
