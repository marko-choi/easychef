from django.urls import path
from SocialMedia.views import *
from Recipes.views import *

urlpatterns = [
    path('recipe-create/', RecipeCreationView.as_view()),
    path('recipe-edit/<int:recipe_id>/', EditRecipe.as_view()),
    path('recipe-detail/<int:recipe_id>/', RecipeDetailsView.as_view()),
    path('add-image/', AddImageView.as_view()),
    path('delete-image/', DeleteImageView.as_view()),
    path('ingredient-autocomplete/', IngredientAutocompleteView.as_view()),
    path('shopping-list/', ShoppingCartView.as_view())
]
