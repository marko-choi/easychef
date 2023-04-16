from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name']

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvatarModel
        fields = ['avatar']
