from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
     list_display = ('username', 'email', 'first_name', 'last_name', 'phone', 'company', 'role', 'is_staff', 'is_active')
     fieldsets = BaseUserAdmin.fieldsets + (
         ('Información Personal Adicional', {'fields': ('phone', 'company', 'role')}),
     )
     add_fieldsets = BaseUserAdmin.add_fieldsets + (
         (None, {'fields': ('phone', 'company', 'role', 'email')}),
     )
     search_fields = ('username', 'email', 'first_name', 'last_name', 'company', 'phone')
     list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'role')