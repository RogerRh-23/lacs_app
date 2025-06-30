# DjangoBackend/accounts/urls.py
from django.urls import path
from . import views # Importa las vistas de tu aplicación accounts

urlpatterns = [
    # Estas son las rutas para las vistas de autenticación basadas en funciones
    # que te he proporcionado antes.
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('home/', views.home_view, name='home'), # La página a la que redirige después del login
]
