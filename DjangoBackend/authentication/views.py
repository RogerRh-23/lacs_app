# DjangoBackend/authentication/views.py

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model # <-- ¡IMPORTANTE: Importa get_user_model!

# Serializadores (asegúrate de que este archivo exista y esté correcto)
from accounts.serializers import UserRegisterSerializer # <-- Asegúrate de que esta importación sea correcta

# Obtén el modelo de usuario personalizado
User = get_user_model() # <-- ¡Usa get_user_model() para obtener tu CustomUser!

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all() # <-- Ahora User es tu CustomUser
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer # <-- Usa tu UserRegisterSerializer de accounts

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save() # Guarda el nuevo usuario

        # Genera tokens JWT para el nuevo usuario
        refresh = RefreshToken.for_user(user)
        response_data = {
            'message': 'Registro exitoso',
            'username': user.username, 
            'token': str(refresh.access_token),
            'refresh_token': str(refresh),
        }
        return Response(response_data)
