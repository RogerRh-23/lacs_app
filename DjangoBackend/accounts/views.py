from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import AdminUserRegistrationSerializer

class HomeView(APIView):
    permission_classes = [AllowAny] 

    def get(self, request):
        return Response({"message": "¡Bienvenido a la página de inicio!"}, status=status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        username_or_email = request.data.get('username')
        password = request.data.get('password')

        if not username_or_email or not password:
            return Response(
                {"detail": "Por favor, proporciona un nombre de usuario/correo electrónico y una contraseña."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = None
        user = authenticate(username=username_or_email, password=password)

        if user:
            print(f"DEBUG: Autenticación exitosa por username: {user.username}")
        else:
            print(f"DEBUG: Autenticación fallida por username: {username_or_email}")

        if not user:
            try:
                custom_user = CustomUser.objects.get(email=username_or_email)
                user = authenticate(username=custom_user.username, password=password)
                if user:
                    print(f"DEBUG: Autenticación exitosa por email: {user.email}")
                else:
                    print(f"DEBUG: Autenticación fallida por email (contraseña incorrecta para {custom_user.username})")
            except CustomUser.DoesNotExist:
                print(f"DEBUG: Usuario no encontrado por email: {username_or_email}")
                pass

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'email': user.email,
                'role': user.role
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_401_UNAUTHORIZED
            )

class AdminUserRegistrationView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = AdminUserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Usuario registrado exitosamente por el administrador.",
                 "username": serializer.validated_data['username'],
                 "role": serializer.validated_data['role']},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
