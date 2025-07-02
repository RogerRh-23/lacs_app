from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Define las opciones de rol
    ROLE_ADMIN = 'admin'
    ROLE_INSPECTOR = 'inspector'
    ROLE_SUPERVISOR = 'supervisor'
    ROLE_OPERATOR = 'operator'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Administrador'),
        (ROLE_INSPECTOR, 'Inspector'),
        (ROLE_SUPERVISOR, 'Supervisor'),
        (ROLE_OPERATOR, 'Operador'),
    ]

    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    
    # Campo para el rol del usuario
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_OPERATOR, # Por defecto, un nuevo usuario registrado será 'operador'
        verbose_name='Rol del Usuario'
    )

    # Añade related_name para evitar conflictos si ya usas grupos o permisos de usuario
    # (Estos son los related_name por defecto de AbstractUser, pero los incluimos explícitamente)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_groups", # Cambiado a un nombre único para evitar conflictos
        related_query_name="customuser",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_user_permissions", # Cambiado a un nombre único para evitar conflictos
        related_query_name="customuser",
    )

    def __str__(self):
        return self.username