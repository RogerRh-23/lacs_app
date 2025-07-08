from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
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
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_OPERATOR,
        verbose_name='Rol del Usuario'
    )

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_groups",
        related_query_name="customuser",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_user_permissions", 
        related_query_name="customuser",
    )

    def __str__(self):
        return self.username