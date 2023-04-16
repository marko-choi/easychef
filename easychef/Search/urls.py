from django.urls import path
from .views import *

urlpatterns = [
    path('recipe-filter/', RecipeFilterView.as_view(), name='recipe-filter'),
    path('recipe-sort/', RecipeSortView.as_view(), name='recipe-sort')
]
