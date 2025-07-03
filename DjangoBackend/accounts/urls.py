from django.urls import path
from .views import LoginView, AdminUserRegistrationView, HomeView # Importa HomeView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('admin-register/', AdminUserRegistrationView.as_view(), name='admin-register'),
    path('home/', HomeView.as_view(), name='home'),
]
