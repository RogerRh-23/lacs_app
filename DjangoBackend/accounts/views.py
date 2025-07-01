from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import UserRegistrationForm
from django.contrib import messages
from django.http import JsonResponse # Importar JsonResponse
from django.views.decorators.csrf import csrf_exempt # Para permitir peticiones POST sin CSRF token en desarrollo

# @csrf_exempt es para desarrollo y pruebas. En producción, considera usar
# rest_framework o csrf_protect si sigues con vistas basadas en funciones.
@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        # Los datos JSON vienen en request.body, no en request.POST
        import json
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON"}, status=400)

        # Crea un objeto QueryDict a partir de los datos JSON para que el formulario pueda procesarlos
        from django.http import QueryDict
        q = QueryDict('', mutable=True)
        q.update(data)

        form = UserRegistrationForm(q) # Pasa los datos como si vinieran de un POST normal
        if form.is_valid():
            user = form.save()
            # Devuelve una respuesta JSON con el nombre de usuario generado
            return JsonResponse({
                "message": "Registro exitoso. Ahora puedes iniciar sesión.",
                "username": user.username # Envía el nombre de usuario generado
            }, status=201) # 201 Created
        else:
            # Devuelve errores de validación en formato JSON
            return JsonResponse({"errors": form.errors}, status=400)
    else:
        # Si la solicitud no es POST, puedes redirigir o devolver un error
        return JsonResponse({"message": "GET method not allowed for registration."}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        import json
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON"}, status=400)

        # AuthenticationForm espera un QueryDict o un diccionario similar a request.POST
        from django.http import QueryDict
        q = QueryDict('', mutable=True)
        q.update(data)

        form = AuthenticationForm(request, data=q)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({
                    "message": f"Has iniciado sesión como {username}.",
                    "username": username # Puedes devolver el username aquí también
                }, status=200)
            else:
                return JsonResponse({"message": "Nombre de usuario o contraseña inválidos."}, status=400)
        else:
            return JsonResponse({"errors": form.errors, "message": "Nombre de usuario o contraseña inválidos."}, status=400)
    else:
        return JsonResponse({"message": "GET method not allowed for login."}, status=405)

# Las siguientes vistas no necesitan cambios si no interactúan con el frontend vía fetch/JSON
def logout_view(request):
    logout(request)
    # Para una API, podrías devolver un JsonResponse
    return JsonResponse({"message": "Has cerrado sesión exitosamente."}, status=200)

def home_view(request):
    # Esta es una vista para renderizar una plantilla HTML, no una API.
    # Si tu frontend es una SPA, esta vista podría no ser necesaria o podría devolver JSON.
    return render(request, 'home.html')
