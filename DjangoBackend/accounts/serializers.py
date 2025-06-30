# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser 

User = get_user_model() 

class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = CustomUser 
        fields = ['first_name', 'last_name', 'phone', 'company', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        first_name = validated_data.get('first_name', '').strip()
        last_name = validated_data.get('last_name', '').strip()
        company = validated_data.get('company', '').strip()
        password = validated_data.get('password')

        validated_data.pop('password2')

        initials = ""
        if first_name:
            initials += first_name[0].lower()
        if last_name:
            initials += last_name[0].lower()

        company_part = ""
        if company:
            company_part = company.replace(" ", "").lower()[:3] 

        base_username = f"{initials}{company_part}" if initials or company_part else "usuario"
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(username=username, **validated_data)
        return user

