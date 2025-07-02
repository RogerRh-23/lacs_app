# Backend/lacs_project/urls.py

from django.contrib import admin
from django.urls import path, include # Asegúrate de que 'include' esté aquí
# No importes 'register_view' aquí si no lo usas directamente

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')), # Esta línea es crucial y debe apuntar a accounts.urls
    # Si tenías alguna otra URL que apuntara a 'register_view', elimínala o coméntala.
    # Por ejemplo, si tenías: path('register/', register_view, name='register'), elimínala.
]
