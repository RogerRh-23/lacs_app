# Backend/accounts/urls.py

from django.urls import path
from .views import LoginView, AdminUserRegistrationView # Asegúrate de importar solo las vistas correctas

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('admin-register/', AdminUserRegistrationView.as_view(), name='admin-register'),
    # Si tenías alguna otra URL que apuntara a 'register_view' aquí, elimínala o coméntala.
    # Por ejemplo, si tenías: path('register/', register_view, name='register'), elimínala.
]
