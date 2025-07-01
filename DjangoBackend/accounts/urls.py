from django.urls import path
from . import views # Asegúrate de que views.py contenga las funciones register_view, login_view, etc.

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('home/', views.home_view, name='home'),
]
