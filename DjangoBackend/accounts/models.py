from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    telefono = models.CharField(max_length=20, blank=True, null=True)
    empresa = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username

