from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import *


class SignUpForm(UserCreationForm):
    username = forms.CharField(max_length=30)
    password1 = forms.CharField(max_length=30)
    password2 = forms.CharField(max_length=30)
    email = forms.EmailField(max_length=254)
    phone_num = forms.CharField(max_length=20, required=False)
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'phone_num', 'first_name', 'last_name')

    def save(self, commit=True):
        user = super(SignUpForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        user.phone_num = self.cleaned_data['phone_num']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        if commit:
            user.save()
        return user

class AvatarForm(forms.Form):
    avatar = forms.ImageField()
    class Meta:
        model = AvatarModel
        fields = ['avatar']
    
    def save(self, user, commit=True,):
        avatar = AvatarModel()
        avatar.avatar = self.cleaned_data['avatar']
        avatar.user = user
        if commit:
            avatar.save()
        return avatar



class LoginForm(forms.Form):
    username = forms.CharField(max_length=30)
    password = forms.CharField(max_length=30)

class EditForm(forms.Form):
    email = forms.EmailField(max_length=254, required=False)
    phone_num = forms.CharField(max_length=20, required=False)
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)
    password1 = forms.CharField(max_length=30, required=False)
    password2 = forms.CharField(max_length=30, required=False)