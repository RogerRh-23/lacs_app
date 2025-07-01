import datetime
from django import forms
from .models import User
from django.contrib.auth import get_user_model

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
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
        while get_user_model().objects.filter(username=username).exists():
            username = f"_{base_username_raw.upper()}{counter}"
            counter += 1
        
        user.username = username 
        user.set_password(self.cleaned_data['password'])

        if commit:
            user.save() 
        return user
