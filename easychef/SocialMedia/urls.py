from django.urls import path
from .views import *

urlpatterns = [
    path('my-recipes/', RecipeCreatedListView.as_view(), name='my-recipes'),
    path('favorite-recipes/', RecipeFavoriteListView.as_view(), name='favorite-recipes'),
    path('interacted-recipes/', RecipeInteractedListView.as_view(), name='interacted-recipes'),
    path('popular-recipes/', PopularRecipeListView.as_view(), name='popular-recipes'),
    path('recipe-comment/', RecipeCommentView.as_view(), name='recipe-comment'),
    path('recipe-comment/<int:comment_id>/', RecipeCommentView.as_view(), name='recipe-comment-patch'),
    path('recipe-favorite/', RecipeFavoriteView.as_view(), name='recipe-favorite'),
    path('recipe-favorite/<int:recipe_id>/', GetRecipeFavoriteView.as_view(), name='get-recipe-favorite'),
    path('recipe-rating/', RecipeRatingView.as_view(), name='recipe-rating'),
    path('recipe-rating/<int:recipe_id>/', GetRecipeRatingView.as_view(), name='get-recipe-rating')
]
