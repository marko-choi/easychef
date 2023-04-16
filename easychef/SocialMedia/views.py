from django.utils import timezone
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest, HttpResponseForbidden
from django.contrib.auth.models import User
from django.template.response import TemplateResponse
from django.urls import reverse
from django.views import View
from django.views.generic import FormView
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import get_object_or_404

from django.db.models import Count, Avg, F, Q, Max
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from .models import RecipeRating
from django.db.models import Avg
from .serializers import *
from Recipes.models import *
from Authentication.models import *

# Create your views here.
"""
Recipe Rating: POST/UPDATE

  POST/UPDATE:
  Request:
  - user_id: int
  - recipe_id: int
  - rating: int

  Reponse:
  - 200 OK
  - 401 UNAUTHORIZED
  - 403 FORBIDDEN
  - 404 NOT FOUND
"""
class GetRecipeRatingView(APIView):
  permission_classes = [IsAuthenticated]
  serializer_class = RecipeRatingSerializer
  qs = RecipeRating.objects.all()

  def update_recipe_avg_rating(self, recipe_id):
    average_rating = RecipeRating.objects.filter(recipe_id=recipe_id).aggregate(Avg('rating'))['rating__avg']
    recipe_id.average_rating = average_rating
    recipe_id.save()
  
  def get(self, request, recipe_id):
    user = get_object_or_404(User, id=self.request.user.id)
    try:
      recipe = get_object_or_404(Recipe, recipe_id=recipe_id)
    except:
      return JsonResponse({"message": "Recipe not found."}, status=404)
    rating = get_object_or_404(RecipeRating, recipe_id=recipe, user_id=user)
    res = {
      "recipe_id": recipe_id,
      "rating": rating.rating
    }
    return Response(res, status=200)
  
  def patch(self, request, recipe_id):
    try:
      recipe = get_object_or_404(Recipe, recipe_id=recipe_id)
    except:
      return Response({"message": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
      easyuser = get_object_or_404(User, id=request.user.id)
    except:
      return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
      rating = get_object_or_404(RecipeRating, recipe_id=recipe_id, user_id=easyuser)
      old_rating = rating.rating
    except:
      return Response({"message": "Recipe rating not found."}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = RecipeRatingSerializer(rating, data=request.data, partial=True, context={'request': request})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    self.update_recipe_avg_rating(recipe)

    res = {
      "recipe_id": recipe_id,
      "old_rating": old_rating,
      "new_rating": int(request.data.get('rating', 0))
    }
    return Response(res)  
      

  
class RecipeRatingView(CreateAPIView):
  """
  RecipeRating endpoint.
  
  POST: only inserts a rating that is associated with a user and a recipe if
  the rating has never existed.
  """
  authentication_classes = [authentication.TokenAuthentication]
  permission_classes = [IsAuthenticated]
  serializer_class = RecipeRatingSerializer 
  queryset = RecipeRating.objects.all()

  def get_object(self, recipe):
    user = get_object_or_404(User, id=self.request.user.id)
    obj, created = RecipeRating.objects.get_or_create(
      recipe_id=recipe,
      user_id=user
    )
    return obj
  
  def update_recipe_avg_rating(self, recipe_id):
    average_rating = RecipeRating.objects.filter(recipe_id=recipe_id).aggregate(Avg('rating'))['rating__avg']
    recipe_id.average_rating = average_rating
    recipe_id.save()

  def post(self, request):
    # try:
      recipe_id = request.data.get('recipe_id', '')
      try:
        recipe = get_object_or_404(Recipe, recipe_id=recipe_id)
      except:
        return Response({"message": "Recipe not found."}, status=status.HTTP_404_NOT_FOUND)
      
      try:
        user = get_object_or_404(User, id=request.user.id)
      except:
        return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

      serializer = RecipeRatingSerializer(data=request.data)
      try:
        serializer.is_valid(raise_exception=True)
      except:
        return Response(serializer.errors, status=400)
      
      try:
        obj = get_object_or_404(RecipeRating, user_id=user, recipe_id=recipe_id)
      except:
        recipe_rating = RecipeRating.objects.create(recipe_id=recipe, user_id=user, rating=serializer['rating'].value)
        self.update_recipe_avg_rating(recipe)

        res = {
          "recipe_rating_id": recipe_rating.id,
          "recipe_id": int(recipe_id),
          "rating": recipe_rating.rating
        }
        return Response(res, status=200)

      return Response({"message": "Recipe rating already exists."}, status=400)
    # except:
    #   return Response({"error": "Bad request."}, status=400)

"""
Recipe Favorite: 
POST/UPDATE:
  Request:
  - user_id: int
  - recipe_id: int
  - like: bool

  Reponse:
  - 200 OK
  - 401 UNAUTHORIZED
  - 403 FORBIDDEN
  - 404 NOT FOUND
"""
class GetRecipeFavoriteView(APIView):
  permission_classes = [IsAuthenticated]
  serializer_class = RecipeLikeSerializer
  qs = RecipeLike.objects.all()
  
  def get(self, request, recipe_id):
    user = get_object_or_404(User, id=self.request.user.id)
    try:
      recipe = get_object_or_404(Recipe, recipe_id=recipe_id)
    except:
      return Response({"message": "Recipe not found."}, status=404)
    like = get_object_or_404(RecipeLike, recipe_id=recipe, user_id=user)
    
    res = {
      "recipe_id": recipe_id,
      "like": like.like
    }
    return Response(res, status=200)
  
  def patch(self, request, recipe_id):
    try:
      recipe = get_object_or_404(Recipe, recipe_id=recipe_id)
    except:
      return Response({"message": "Recipe not found"}, status=404)
    
    try:
      easyuser = get_object_or_404(User, id=request.user.id)
    except:
      return Response({"message": "User not found"}, status=404)
    
    try:
      recipe_like = get_object_or_404(RecipeLike, recipe_id=recipe_id, user_id=easyuser)
    except:
      return Response({"message": "Recipe like not found."}, status=404)
    
    if 'like' not in request.data.keys():
      return Response({"message": "Missing field: like"}, status=400)
    
    prior = recipe_like.like

    serializer = RecipeLikeSerializer(recipe_like, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    like = serializer.validated_data['like']
    serializer.save()

    # Update total like count for the recipe
    if prior and not(like):
      recipe.likes -= 1
    elif not(prior) and like:
      recipe.likes += 1
    recipe.save()

    return Response({"message": "Successfully updated recipe like."})


    
class RecipeFavoriteView(CreateAPIView, UpdateAPIView):
  """
  RecipeFavorite endpoint:

  POST: only inserts a like/favorite that is associated with a user and a recipe if
  the like/favorite has never existed.

  PATCH: updates a like/favorite that is associated with a user and a recipe if
  the like/favorite exists.
  """
  permission_classes = [IsAuthenticated]
  serializer_class = RecipeLikeSerializer
  
  def post(self, request): 
    try:
      serializer = RecipeLikeSerializer(data=request.data, context={'request':request})
      serializer.is_valid(raise_exception=True)

      recipe_id = request.data.get('recipe_id', '')
      try:
        recipe = get_object_or_404(Recipe, recipe_id=recipe_id)
      except:
        return Response({"message": f"Recipe Like record not found for corresponding user for recipe {recipe_id}."}, status=404)
      try:
        user = get_object_or_404(User, id=request.user.id)
      except:
        return Response({"message": "User not found."}, status=404)
      
      try:
        recipe_like = get_object_or_404(RecipeLike, user_id=user, recipe_id=recipe)
      except:
        recipe_like = RecipeLike.objects.create(user_id=user, recipe_id=recipe, like=serializer['like'].value)
        recipe.likes += 1
        recipe.save()

        res = {
          "recipe_like_id": recipe_like.id,
          "recipe_id": int(recipe_id),
          "like": recipe_like.like
        }

        return Response(res, status=200)
      return Response({"message": "Recipe Like record already exists."}, status=400)
    except:
      return Response({"error": "Bad request."}, status=400)
    

"""
Recipe Comment

NOTE: if comment is updated, should have a flag that checks that it has been edited.
Also, update the time if the comment has been updated.

POST/UPDATE:
  Request:
  - user_id: int
  - recipe_id: int
  - parent_msg_id: int | null
  - msg: 
  - images: [] (photos/videos)

  Reponse:
  - 200 OK
  - 401 UNAUTHORIZED
  - 403 FORBIDDEN (Patch only)
  - 404 NOT FOUND
"""
class RecipeCommentView(APIView):
  permission_classes= [IsAuthenticated]
  serializer_class = RecipeCommentSerializer

  def post(self, request):
    try:
      serializer = self.serializer_class(data=request.data)

      if serializer.is_valid():
        recipe_id = serializer.validated_data.get('recipe_id', '')
        comment = serializer.validated_data.get('comment', '')
        images = serializer.validated_data.get('images', [])

        user = get_object_or_404(User, id=self.request.user.id)

        # Creates a new RecipeComment instance
        comment = RecipeComment.objects.create(user_id=user, recipe_id=recipe_id, comment=comment)

        # Create CommentImage instances for each uploaded image
        media_urls = []
        for i, media in enumerate(images):
          comment_media = CommentMedia.objects.create(media=media, media_index=i, parent_comment=comment)
          media_urls.append(comment_media.media.url)

        res = {
          "message": "Recipe comment posted successfully.",
          "result": {
            "comment_id": comment.comment_id,
            "recipe_id": recipe_id.recipe_id,
            "comment": comment.comment,
            "images": media_urls,
            "time": comment.time,
            "edited": comment.edited
          }
        }

        return JsonResponse(res, status=status.HTTP_201_CREATED)
    except:
      return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
  def patch(self, request, comment_id):
    try:
      comment = get_object_or_404(RecipeComment, comment_id=comment_id)
    except:
      return Response({"message": "Comment not found"}, status=404)

    if comment.user_id.id != request.user.id:
      return HttpResponseForbidden()

    serializer = self.serializer_class(comment, data=request.data, partial=True)
    if serializer.is_valid():

      serializer.validated_data['time'] = timezone.now()
      serializer.validated_data['edited'] = True
      
      serializer.save()
      return JsonResponse({'message': 'Recipe comment updated successfully.'}, status=status.HTTP_200_OK)
    return HttpResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""
Recipe Create List: GET
NOTE: this endpoint requires pagination.

GET:
  param: user_id
  Response: 
    - recipes: [
    {
      - recipe_name
      - recipe_author
      - ratings
      - likes
      - comments (number)
      - cuisine
      - prep time
      - cooking time
      - image(s)   
    }
  ]
"""
class RecipeCreatedListView(ListAPIView):
  permission_classes = [IsAuthenticated]
  serializer_class = RecipeSerializer
  pagination_class = CustomRecipePagination

  def get_queryset(self):
    user = self.request.user
    queryset = Recipe.objects.filter(user_id=user.id)
    return queryset
  
  def list(self, request, *args, **kwargs):
      queryset = self.get_queryset()
      page = self.paginate_queryset(queryset)
      if page is not None:
        serializer = self.get_serializer(page, many=True)
        data = {
          'recipes': serializer.data
        }
        return self.get_paginated_response(data)
      
      serializer = self.get_serializer(queryset, many=True)
      data = {
          'recipes': serializer.data
        }
      return JsonResponse(data, safe=False)

"""
Recipe Favorite List: GET
NOTE: this endpoint requires pagination.

GET:
  param: user_id
  Response: 
    - recipes: [
    {
      - recipe_name
      - recipe_author
      - ratings
      - likes
      - comments (number)
      - cuisine
      - prep time
      - cooking time
      - image(s)   
    }
  ]
"""
class RecipeFavoriteListView(ListAPIView):
  permission_classes = [IsAuthenticated]
  serializer_class = RecipeSerializer
  pagination_class = CustomRecipePagination

  def get_queryset(self):
    user = get_object_or_404(User, id=self.request.user.id)
    liked_recipes = RecipeLike.objects.filter(user_id=user, like=True).values_list('recipe_id', flat=True)
    queryset = Recipe.objects.filter(recipe_id__in=liked_recipes)
    return queryset
  
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    serializer = self.get_serializer(queryset, many=True)
    page = self.paginate_queryset(queryset)

    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)
    
    return JsonResponse(serializer.data, safe=False)
  
"""
Recipe Interacted: GET
NOTE: this endpoint requires pagination.

Interaction includes:
- created recipes
- liked recipes
- rated recipes
- commented recipes

GET:
  param: user_id
  Response: 
    - recipes: [
    {
      - recipe_name
      - recipe_author
      - ratings
      - likes
      - comments (number)
      - cuisine
      - prep time
      - cooking time
      - image(s)   
    }
  ]
"""
class RecipeInteractedListView(ListAPIView):
  permission_classes = [IsAuthenticated]
  serializer_class = RecipeSerializer
  pagination_class = CustomRecipePagination

  def get_queryset(self):
    user_id = self.request.user.id
    user = get_object_or_404(User, id=user_id)

    post_qs = Recipe.objects.filter(user_id=user_id)
    comment_qs = RecipeComment.objects.filter(user_id=user_id)
    like_qs = RecipeLike.objects.filter(user_id=user_id).filter(like=True)
    rate_qs = RecipeRating.objects.filter(user_id=user_id)
    recipe_qs = Recipe.objects.filter(
        Q(recipecomment__in=comment_qs) | Q(recipelike__in=like_qs) | Q(reciperating__in=rate_qs) | Q(recipe_id__in=post_qs)
      ).distinct()

    return recipe_qs
  
  def list(self, request, *args, **kwargs):
    qs = self.get_queryset()
    page = self.paginate_queryset(qs)
    
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)
    
    serializer = self.get_serializer(qs, many=True)
    data = {'recipes': serializer.data }
    return JsonResponse(data)

"""
Popular Recipe List: GET
NOTE: this endpoint requires pagination.
NOTE: does not require authentication

GET:
  Response: 
    - recipes: [
    {
      - recipe_name
      - recipe_author
      - ratings
      - likes
      - comments (number)
      - cuisine
      - prep time
      - cooking time
      - image(s)   
    }
  ]
"""
class PopularRecipeListView(ListAPIView):
  serializer_class = RecipeSerializer
  pagination_class = CustomRecipePagination

  def get_queryset(self):
    queryset = Recipe.objects.annotate(
      num_likes=Count('recipelike', filter=Q(recipelike__like=True)),
    ).order_by('-num_likes', '-average_rating')
    return queryset
  
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)
    
    serializer = self.get_serializer(queryset, many=True)
    data = []
    for recipe in serializer.data:
      image_url = request.build_absolute_uri(recipe['image'])
      recipe['image'] = image_url
      data.append(recipe)
    print(data)
    return JsonResponse({'recipes': data}, safe=False)
