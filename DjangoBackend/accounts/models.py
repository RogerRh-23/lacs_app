from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    company = models.CharField(max_length=100, blank=True, null=True, verbose_name="Empresa")
    email = models.EmailField(unique=True, blank=True, null=True, verbose_name="Correo Electrónico")

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Usuario Personalizado"
        verbose_name_plural = "Usuarios Personalizados"

