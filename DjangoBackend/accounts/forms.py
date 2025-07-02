import datetime
from django import forms
from django.contrib.auth import get_user_model # Importa get_user_model para obtener el modelo de usuario activo
from django.core.validators import validate_email
from .models import CustomUser # Importa tu modelo CustomUser para las opciones de rol

# Obtén el modelo de usuario activo (CustomUser en este caso)
User = get_user_model()

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(widget=forms.PasswordInput)
    
    class Meta:
        model = User # Usa el modelo de usuario obtenido por get_user_model()
        # Incluye todos los campos que se esperan del formulario de registro público
        fields = ['first_name', 'last_name', 'phone', 'company', 'password'] 

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')
        
        if password and password_confirm and password != password_confirm:
            self.add_error('password_confirm', "Las contraseñas no coinciden.")
        
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)

        first_name = self.cleaned_data.get('first_name', '').strip()
        last_name = self.cleaned_data.get('last_name', '').strip()
        company = self.cleaned_data.get('company', '').strip()
        
        # Lógica para generar el nombre de usuario (sin cambios)
        first_name_initials = "".join([name_part[0].lower() for name_part in first_name.split() if name_part])
        last_name_initials = "".join([name_part[0].lower() for name_part in last_name.split() if name_part])
        company_slug = company.lower().replace(" ", "")
        current_year = str(datetime.datetime.now().year)

        base_username_raw = f"{first_name_initials}{last_name_initials}{company_slug}{current_year}"
        if not base_username_raw:
            base_username_raw = "usuario"

        base_username = f"_{base_username_raw.upper()}"
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists(): # Usa User (resultado de get_user_model())
            username = f"_{base_username_raw.upper()}{counter}"
            counter += 1
        
        user.username = username
        user.set_password(self.cleaned_data['password'])
        
        if commit:
            user.save()
        return user
