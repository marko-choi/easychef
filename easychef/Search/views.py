from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.contrib.auth.models import User
from django.template.response import TemplateResponse
from django.views import View
from django.views.generic import FormView
from django.contrib.auth.forms import UserCreationForm
from django.db.models import Count, Avg, F, Q

from rest_framework import status
from rest_framework.response import Response

from rest_framework import filters
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.views import APIView
from SocialMedia.serializers import *
from rest_framework.permissions import IsAuthenticated
from Recipes.models import *

from .serializers import *
# from ..SocialMedia.serializers import *

# Create your views here.
"""
As a user, I want to search through recipes by their name, ingredients, 
or creator. Moreover, I should be able to filter recipes based on cuisine, 
diet, or cooking time

As a user, I want the search result to be sorted based on a reasonable combination 
of overall rating and the number of users who marked them as favorite.
"""

"""
Recipe Filter: GET/POST

  GET:
    Responses:
    - ingredients: []
    - cuisine: { id: bool }
    - diet: { id: bool }
    - cooking_time: { id: bool }
    - prep_time: { id: bool }

    - sorting: [
      rating: ASC / DESC
      favorite: ASC / DESC
      prep: ASC / DESC
      cooking: ASC / DESC
    ]

  POST:
    Request:

    - name: str
    - creator: str
    - ingredients: str        # AUTOCOMPLETE (get list from DB)

    - cuisine: { id: bool }
    - diet: { id: bool }
    - cooking_time: { id: bool }
    - prep_time: { id: bool }

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
class RecipeFilterView(GenericAPIView):
    
    # serializer_class = RecipeFilterSerializer
    serializer_class = RecipeSerializer
    pagination_class = CustomRecipePagination

    def get_queryset(self, data, sort_data):
      """
      Returns a query set with filters applied to recipe name, ingredients,
      cuisine, diet and cooking time.

      parameter(s): 
      - data: a serialized request that consists of recipe_name, creator, 
            ingredients, cuisine, diet, cooking_time.
      """
      recipe_name = data.get('recipe_name', '')
      ingredients = data.get('ingredients', '')
      cuisine = data.get('cuisines', [])
      diet = data.get('diets', [])
      cooking_time = data.get('cooking_time', 1000000000000000)

      # Match recipes by creator
      users = User.objects.filter(
        Q(first_name__icontains=data.get('creator'))  |
        Q(last_name__icontains=data.get('creator'))
      )

      recipe = Recipe.objects.all().filter(user_id__in=users)
      # print(recipe_name)
      if recipe_name: # Match by recipe name
        recipe = recipe.filter(recipe_name__icontains=recipe_name)
        
      if cuisine: # Match by cuisine
        recipe = recipe.filter(cuisinetag__cuisine__in=cuisine)

      if diet: # Match by diet
        recipe = recipe.filter(diettag__diet__in=diet)

      # Match by less than a cooking time
      recipe = recipe.filter(cooking_time__lte=cooking_time)
      

      if ingredients: # Match recipes by ingredients
        ingredients = Ingredient.objects.filter(ingredients_name__icontains=data.get('ingredients'))
        recipe_ids = ingredients.values_list('recipe_id', flat=True).distinct()
        recipe = recipe.filter(recipe_id__in=recipe_ids)

      for item in sort_data:
        if "priority" in item and item["priority"] == 0:
            item["priority"] = 100
      sort = sorted(sort_data, key=lambda x: x["priority"])
      sort.reverse()

      # Sort by rating, favorite, prep_time, cooking_time
      sort_order = []
      for item in sort:
        
        if item["value"] == "avg_ratings" and item['active']:
          if item["order"] == "asc": sort_order.append('average_rating')
          elif item["order"] == "desc": sort_order.append('-average_rating')
        
        elif item["value"] == "likes" and item['active']:
          if item["order"] == "asc": sort_order.append('likes')
          elif item["order"] == "desc": sort_order.append('-likes')
        
        elif item["value"] == "cooking_time" and item['active']:
          if item["order"] == "asc": sort_order.append('cooking_time')
          elif item["order"] == "desc": sort_order.append('-cooking_time')

        elif item["value"] == "prep_time" and item['active']:
          if item["order"] == "asc": sort_order.append('preparation_time')
          elif item["order"] == "desc": sort_order.append('-preparation_time')
      # print("Sorting order: ", sort_order)
      recipe = recipe.order_by(*sort_order)
      # print(recipe)
      return recipe

    def get(self, request):
      """
      GET endpoint handler for RecipeFilterView.

      Returns a JSON response of possible filters for cuisines, diets and cooking time, 
      where each category of filter has a total number of matching recipes.
      """
      cuisines = CuisineTag.Cuisines.choices
      diets = DietTag.Diets.choices
      # print("Cuisines: ", cuisines)
      # print("Diets: ", diets)
      cooking_time = [5, 10, 15, 20, 30, 40, 50, 60, 90]

      response = {
        'cuisines': [],
        'diets': [],
        'cooking_time': []
      }

      for cuisine in cuisines:
        response['cuisines'].append({
          "value": cuisine[0], 
          "label": cuisine[1], 
          "amount": CuisineTag.objects.filter(cuisine=cuisine[0]).count()
          })

      for diet in diets:
        response['diets'].append({
          "value":diet[0], 
          "label":diet[1], 
          "amount": DietTag.objects.filter(diet=diet[0]).count()
          })

      for time in cooking_time:
        response['cooking_time'].append({
          "value":time,
          "label":"≤" + str(time) + " minutes", 
          "amount":Recipe.objects.filter(cooking_time__lte=time).count()
        })

      return JsonResponse(response)

    def post(self, request):
      """
      POST endpoint handler for RecipeFilterView. 

      Returns a JSON response of paginated recipes given a set of filters.
      """
      # Serialize data
      # print('Request data: ', request.data)
      # print(request.data.keys())

      # check if request data is empty (no filters applied)
      not_filtered = False
      is_sorted = False
      data = request.data
      if not data['creator'] and not data['ingredients'] and not data['cuisines'] and not data['diets']:
        if 'recipe_name' in data.keys() and not data['recipe_name']:
          if 'cooking_time' not in data.keys():
            for item in data['sort']:
              # check that all of the sort options are inactive
              if item['active']: # if it is active then it is filtered
                is_sorted = True
                break  
            if not(is_sorted):
              not_filtered = True
        elif 'recipe_name' not in data.keys():
          if 'cooking_time' not in data.keys():
            for item in data['sort']:
              # check that all of the sort options are inactive
              if item['active']: # if it is active then it is filtered
                is_sorted = True
                break  
            if not(is_sorted):
              not_filtered = True
      
      # print("Is it not filtered?\n\n")
      # print(not_filtered, end="\n\n")
      # print(request.data, end="\n\n")

      cooking_time = request.data.get('cooking_time', 1000000000000000)
      request.data['cooking_time'] = cooking_time

      serializer = RecipeFilterSerializer(data=request.data)

      if serializer.is_valid():
        sort_data = request.data.get('sort', [])

        if not(sort_data): 
          raise serializers.ValidationError("No sorting data provided")

        # Acquire and paginante filtered queryset 
        if not(not_filtered):
          queryset = self.get_queryset(serializer.data, sort_data)
        else:
          queryset = Recipe.objects.annotate(
            num_likes=Count('recipelike', filter=Q(recipelike__like=True)),
          ).order_by('-num_likes', '-average_rating')
        # print(queryset)
        # recipe_ids = list(queryset.values_list('recipe_id', flat=True)) 
        page = self.paginate_queryset(queryset)
        # print(page)
        
        if page is not None:
          serializer = self.get_serializer(page, many=True)
          return self.get_paginated_response(serializer.data)

        # Return paginated response 
        serializer = self.get_serializer(queryset, many=True)
        # Return JSONified non-paginated response
        return JsonResponse(serializer.data, safe=False)
      # print(serializer.errors)
      # except:
      #   return JsonResponse(serializer.errors, status=400)
      # return HttpResponseBadRequest()

class RecipeSortView(ListAPIView):
  """
  RecipeSort endpoint.

  Given a list of recipe_ids, sort them based on likes, cooking time or average rating.

  Query Params:
  recipes: List[recipe_ids:str]
  ordering: comma-separated list of fields to order by with a prefix of '-' if ordered descendingly.

  Accepted ordering fields:
  - likes
  - cooking_time
  - average_rating
  """
  pagination_class = CustomRecipePagination
  serializer_class = RecipeSerializer

  def get_queryset(self):
    """
    Returns a queryset of Recipe objects ordered by the <ordering> parameter.
    """
    queryset = Recipe.objects.all()

    recipe_ids = self.request.query_params.get('recipes', None)
    if recipe_ids:
      try:
        recipe_ids = [int(recipe_id) for recipe_id in recipe_ids.split(',')]
      except:
        raise Exception() 
      queryset = queryset.filter(recipe_id__in=recipe_ids)
  
    ordering = self.request.query_params.get('ordering', None).split(',')
    if ordering:
      for order in ordering:
        if order in ['likes', '-likes', 'cooking_time', '-cooking_time', 'average_rating', '-average_rating']:
          queryset = queryset.order_by(order)
      return queryset

    return queryset
        
  
  def list(self, request, *args, **kwargs):
      """
      Returns a paginated list of sorted recipe objects.
      """
      try:
        queryset = self.get_queryset()
        serializer = RecipeSerializer(queryset, many=True)
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = RecipeSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        return JsonResponse(serializer.data, safe=False)
      except:
        return Response({"message": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)