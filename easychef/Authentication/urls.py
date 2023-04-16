from django.urls import path
from Authentication.views import *


urlpatterns = [
    path('login/', LoginView.as_view()),
    path('logout/', Logout.as_view()),
    path('signup/', SignUp.as_view()),
    path('editprofile/', EditProfile.as_view()),
    path('viewprofile/', ViewProfile.as_view()),
    path('', AuthView.as_view()),
]
