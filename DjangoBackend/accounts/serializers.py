from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class AdminUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'role', 'phone', 'company')
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Ambas contraseñas deben coincidir."})
        
        requested_role = data.get('role')
        valid_roles = [choice[0] for choice in CustomUser.ROLE_CHOICES]
        if requested_role and requested_role not in valid_roles:
            raise serializers.ValidationError({"role": "El rol proporcionado no es válido."})

        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data['role'],
            phone=validated_data.get('phone', ''),
            company=validated_data.get('company', '')
        )
        return user
