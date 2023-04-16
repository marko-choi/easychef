from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views import View
from django.views.generic import FormView
from .forms import *
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.views import APIView
from .models import *
from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView
from .serializers import *
from django.contrib.auth.decorators import login_required


class AuthView(APIView):
    def get(self, request):
        print(request.user)
        if request.user.is_authenticated:
            return JsonResponse({"logged_in": True})
        else:
            return JsonResponse({"logged_in": False})
        

class SignUp(APIView):
    def post(self, request, *args, **kwargs):
        try:
            form = SignUpForm(request.POST)
            avatar_serializer = AvatarSerializer(data=request.FILES)
            avatar_serializer.is_valid(raise_exception=True)
            if form.is_valid() and avatar_serializer.is_valid():
                user = form.save()
                avatar_serializer.save(user=user)
                return Response({"message": "Success"}, status=200)
            else:
                msg = {}
                errors = form.errors.as_data()
                for error in errors:
                    msg[error] = []
                    for e in errors[error]:
                        msg[error].append(e)
                return Response({"message": msg}, status=400)    
        except:
            return Response(status=400)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)  # _ is the "created" attribute - true if the token was made on this login.
            return JsonResponse({'token': token.key})
        else:
            return Response({'message': 'Invalid username or password.'}, status=400)

class EditProfile(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request, *args, **kwargs):
        form = EditForm(request.POST)
        avatar_serializer = AvatarSerializer(data=request.FILES)
        avatar_serializer.is_valid(raise_exception=True)
        if form.is_valid():
            user = request.user
            easyuser = get_object_or_404(EasyUser, user=user)

            user.email = form.cleaned_data["email"]
            user.first_name = form.cleaned_data["first_name"]
            user.last_name = form.cleaned_data["last_name"]
            user.password1 = form.cleaned_data["password1"]
            user.password2 = form.cleaned_data["password2"]
            if ((user.password1 != "" or user.password2 != "") and (user.password1 != 'undefined' and user.password2 != 'undefined')):
                if user.password1 != user.password2:
                    return Response({"message": "Passwords do not match"}, status=400)
                else:
                    user.set_password(user.password1)
            user.save()

            easyuser.phone = form.cleaned_data["phone_num"]
            easyuser.save()
            
            if request.FILES.get('avatar'):
                avatar = get_object_or_404(AvatarModel, user=user)
                avatar.delete()
                avatar_serializer.save(user=user)

            return Response({"message": "Profile Edited"}, status=200) 
        else:
            msg = ""
            errors = form.errors.as_data()
            for error in errors:
                msg += error + ": "
                for e in errors[error]:
                    msg += str(e) + " "
            return Response({"message": msg}, status=400)


class ViewProfile(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        user = request.user
        response = {} # username email firstname lastname
        response["username"] = user.username
        response["email"] = user.email
        response["first_name"] = user.first_name
        response["last_name"] = user.last_name

        easyuser = get_object_or_404(EasyUser, user=user)
        response["phone_number"] = easyuser.phone
        try:
            avatar = get_object_or_404(AvatarModel, user=user)
            response["avatar"] = avatar.avatar.url
        except:
            response["avatar"] = ''

        return JsonResponse(response)


class Logout(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        # user = Token.objects.get(key='token string').user
        print('test')
        print(request.user)
        request.user.auth_token.delete()
        return Response({"message": "Successfully logged out."}, status=200)


