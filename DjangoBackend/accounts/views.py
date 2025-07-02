from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import AdminUserRegistrationSerializer

class LoginView(APIView):
    def post(self, request):
        username_or_email = request.data.get('username')
        password = request.data.get('password')

        # --- IMPRESIONES DE DEPURACIÓN ---
        print(f"DEBUG: Intento de login para: {username_or_email}")
        print(f"DEBUG: Contraseña recibida (no imprimir en producción): {password}")
        # --- FIN IMPRESIONES DE DEPURACIÓN ---

        if not username_or_email or not password:
            return Response(
                {"detail": "Por favor, proporciona un nombre de usuario/correo electrónico y una contraseña."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = None
        # Intenta autenticar por nombre de usuario
        user = authenticate(username=username_or_email, password=password)

        # --- IMPRESIONES DE DEPURACIÓN ---
        if user:
            print(f"DEBUG: Autenticación exitosa por username: {user.username}")
        else:
            print(f"DEBUG: Autenticación fallida por username: {username_or_email}")
        # --- FIN IMPRESIONES DE DEPURACIÓN ---

        if not user:
            # Si no se autenticó por nombre de usuario, intenta por correo electrónico
            try:
                custom_user = CustomUser.objects.get(email=username_or_email)
                user = authenticate(username=custom_user.username, password=password)
                # --- IMPRESIONES DE DEPURACIÓN ---
                if user:
                    print(f"DEBUG: Autenticación exitosa por email: {user.email}")
                else:
                    print(f"DEBUG: Autenticación fallida por email (contraseña incorrecta para {custom_user.username})")
                # --- FIN IMPRESIONES DE DEPURACIÓN ---
            except CustomUser.DoesNotExist:
                # --- IMPRESIONES DE DEPURACIÓN ---
                print(f"DEBUG: Usuario no encontrado por email: {username_or_email}")
                # --- FIN IMPRESIONES DE DEPURACIÓN ---
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
