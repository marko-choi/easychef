from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.template.response import TemplateResponse
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView
from Authentication.models import *

from .models import *
from .serializers import *
from SocialMedia.models import *


def MissingFieldsResponse(req, fields):
    errors = {}
    for field in fields:
        if field not in req.data.keys():
            errors[field] = "Required field."
    return JsonResponse(errors, status=400)


# Create your views here.
"""
1. Create Recipe Endpoint: /POST

  Creates a recipe for an authorized user.

  Request:
    - recipe_name: str
    - diet: enum
    - cuisine: enum
    - ingredients: [
      ingredients_name: str,
      quantity: int
    ]
    - servings: int
    - prep time (overall recipe)
    - cook time (overall recipe)
    - steps: [
        - instruction: str,
        - step_number: int,
        - time: int
      ]
  
  Response:
  - 200 OK
  - 401 UNAUTHORIZED
  - 403 FORBIDDEN
  - 404 NOT FOUND
"""


class RecipeCreationView(CreateAPIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = RecipeSerializer

    def post(self, request):
        print(request.data)
        recipe_serializer = RecipeSerializer(
            data=request.data, context={'request': request})
        ingredients_list = []
        instruction_list = []
        if recipe_serializer.is_valid(raise_exception=True):
            ingredients = request.data.get('ingredients', [])
            instructions = request.data.get('steps', [])
            diets = request.data.get('diets', [])
            cuisines = request.data.get('cuisines', [])
            recipe = recipe_serializer.save(user_id=request.user)

            for ingredient in ingredients:
                ingredient_serializer = IngredientSerializer(data=ingredient)
                ingredient_serializer.is_valid(raise_exception=True)
                ingredients_list.append(
                    ingredient_serializer.save(recipe=recipe))

            # Copy images over from old recipe
            if (base_recipe_id := request.data.get('baseRecipe', "")):
                base_recipe = get_object_or_404(
                    Recipe, recipe_id=base_recipe_id)
                old_instructions = list(
                    RecipeInstruction.objects.filter(recipe_id=base_recipe))
                old_images = []

                for index, instruction in enumerate(old_instructions):
                    old_images.append(list(ImageModel.objects.filter(
                        parent_instruction=old_instructions[index])))

            for instruction in instructions:
                instruction_serializer = RecipeInstructionSerializer(
                    data=instruction)
                instruction_serializer.is_valid(raise_exception=True)
                instruction_list.append(
                    instruction_serializer.save(recipe_id=recipe))

            if (base_recipe_id):
                for index, instruction in enumerate(instruction_list):
                    if (index < len(old_instructions)):
                        for image in old_images[index]:
                            image.id = None
                            image.parent_instruction = instruction
                            image.parent_recipe=recipe
                            image.save()

            for diet in diets:
                diet_serializer = DietTagSerializer(data={"diet": diet})
                diet_serializer.is_valid(raise_exception=True)
                diet_serializer.save(recipe=recipe)

            for cuisine in cuisines:
                cuisine_serializer = CuisineTagSerializer(
                    data={"cuisine": cuisine})
                cuisine_serializer.is_valid(raise_exception=True)
                cuisine_serializer.save(recipe=recipe)

            response = {}
            response["recipe_id"] = recipe.recipe_id
            ingredients_id = []
            for ingredient in ingredients_list:
                ingredients_id.append(ingredient.ingredients_id)
            response["ingredients_id"] = ingredients_id
            instruction_id = []
            for instruction in instruction_list:
                instruction_id.append(instruction.instruction_id)
            response["instruction_id"] = instruction_id
            return JsonResponse(response, status=200)
        else:
            return Response({"message": "Recipe creation failed."}, status=400)


class AddImageView(APIView):
    """
    Adds images to either a recipe or a recipe's instruction.
    """
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            images = request.data.getlist('images')
            parent_recipe_id = request.data.get(
                "parent_recipe", 0)  # defaults to recipe
            
            parent_instruction_id = request.data.get(
                "parent_instruction", "0")
            
            try:
                parent_recipe = Recipe.objects.get(recipe_id=parent_recipe_id)
            except:
                return Response({"error": "Recipe not found."}, status=404)
            if parent_recipe.user_id != request.user:
                return Response({"error": "Forbidden"}, status=403)

            parent_instruction = None  

            if parent_instruction_id != "0":
                try:
                    parent_instruction = RecipeInstruction.objects.get(
                        instruction_id=parent_instruction_id)
                except Exception as e:
                    print(e)
                    return Response({"error": "Instruction not found."}, status=404)

            for image in images:
                new_dict = {"main_image": image}
                image_serializer = ImageModelSerializer(data=new_dict)
                image_serializer.is_valid(raise_exception=True)
                image_serializer.save(parent_instruction=parent_instruction, parent_recipe=parent_recipe)
            return JsonResponse({"message": "Successfully added file."}, status=201)
        except:
            return MissingFieldsResponse(request, ['images'])


class DeleteImageView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = (permissions.IsAuthenticated,)
    """request: {
    main_image: "image url or sumn idk"
    parent_id: recipe id 
    }"""

    def delete(self, request):
        main_image = request.data.get("main_image")
        parent_id = request.data.get("parent_id", 0)
        main_image = main_image[7:]
        print(main_image)
        images = ImageModel.objects.filter(parent_recipe=parent_id)

        image = get_object_or_404(images, main_image=main_image)
        image.delete()
        return Response({"message": "Image deleted."}, status=200)


"""
2. Ingredients Autocomplete Endpoint: \GET

  Returns a list of all of the distinct ingredients in the database.

  Response:
  - ingredients: [
    ingredient_name: strs
  ]
"""


class IngredientAutocompleteView(APIView):

    def post(self, request):
        ingredient = request.data.get('ingredient', '')
        ingredients = sorted(list(set(Ingredient.objects.filter(
            ingredients_name__icontains=ingredient).values_list('ingredients_name', flat=True))))
        res = {"ingredients": ingredients}
        return JsonResponse(res)


"""
MyRecipe Update/Delete: 

  /PATCH
  Request:
  - recipe_id: int
  - recipe_name: str
  - diet: enum
  - cuisine: enum
  - ingredients: [
    ingredients_name: str,
    quantity: int
  ]
  - serving: int
  - prep time (overall recipe)
  - cook time (overall recipe)
  - base_recipe: id (blankable)
  - images: []
  - steps: [
      - instruction: str
      - images: []
      - prep time
      - cook time
    ]

  Response:
  - 200 OK
  - 401 UNAUTHORIZED
  - 403 FORBIDDEN
  - 404 NOT FOUND
  
  /DELETE
  Request:
  - recipe_id: int

  Response:
  - 200 OK
  - 401 UNAUTHORIZED
  - 403 FORBIDDEN
  - 404 NOT FOUND
"""


class EditRecipe(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(recipe_id=recipe_id)
        except:
            return Response({"error": "Recipe not found."}, status=404)

        if recipe.user_id.id != request.user.id:
            return Response({"error": "Forbidden"}, status=403)

        ingredients = request.data.get('ingredients', [])
        instructions = request.data.get('steps', [])
        recipe_serializer = RecipeSerializer(
            recipe, data=request.data, partial=True, context={'request': request})
        recipe_serializer.is_valid(raise_exception=True)
        recipe_serializer.save()

        ingredients_list = []
        instruction_list = []

        diets = request.data.get('diets', [])
        cuisines = request.data.get('cuisines', [])

        DietTag.objects.filter(recipe=recipe).delete()
        for diet in diets:
            diet_serializer = DietTagSerializer(data={"diet": diet})
            diet_serializer.is_valid(raise_exception=True)
            diet_serializer.save(recipe=recipe)

        CuisineTag.objects.filter(recipe=recipe).delete()
        for cuisine in cuisines:
            cuisine_serializer = CuisineTagSerializer(
                data={"cuisine": cuisine})
            cuisine_serializer.is_valid(raise_exception=True)
            cuisine_serializer.save(recipe=recipe)

        Ingredient.objects.filter(recipe=recipe).delete()
        for ingredient in ingredients:
            ingredient_serializer = IngredientSerializer(data=ingredient)
            ingredient_serializer.is_valid(raise_exception=True)
            ingredients_list.append(ingredient_serializer.save(recipe=recipe))

        # Move the old instruction images over to the new ones
        old_instructions = list(
            RecipeInstruction.objects.filter(recipe_id=recipe))
        old_images = []

        for index, instruction in enumerate(old_instructions):
            old_images.append(list(ImageModel.objects.filter(
                parent_instruction=old_instructions[index])))

        for instruction in instructions:
            instruction_serializer = RecipeInstructionSerializer(
                data=instruction)
            instruction_serializer.is_valid(raise_exception=True)
            instruction_list.append(
                instruction_serializer.save(recipe_id=recipe))

        # old_instructions contains the previous instructions, new_instructions contains the new ones

        for index, instruction in enumerate(instruction_list):
            if (index < len(old_instructions)):
                for image in old_images[index]:
                    image.parent_instruction = instruction
                    image.parent_recipe = recipe
                    image.save()

        # Now delete the old instructions
        for instruction in old_instructions:
            instruction.delete()

        # Generate response for frontend
        response = {}
        response["recipe_id"] = recipe.recipe_id
        ingredients_id = []
        for ingredient in ingredients_list:
            ingredients_id.append(ingredient.ingredients_id)
        response["ingredients_id"] = ingredients_id
        instruction_id = []
        for instruction in instruction_list:
            instruction_id.append(instruction.instruction_id)
        response["instruction_id"] = instruction_id
        return JsonResponse(response, status=200)

    def delete(self, request, recipe_id):
        recipe = get_object_or_404(Recipe, recipe_id=recipe_id)
        recipe.delete()
        return Response({"message": "Recipe deleted."}, status=200)


"""
Recipe Details

  Request:
  - recipe_id: int

  Response:
  - recipe_id: int
  - recipe_name: str
  - diet: enum
  - cuisine: enum
  - ingredients: [
    ingredients_name: str,
    quantity: int
  ]
  - serving: int
  - prep time (overall recipe)
  - cook time (overall recipe)
  - base_recipe: id (blankable)
  - images: []
  - steps: [
      - instruction: str
      - images: []
      - prep time
      - cook time
    ] 
  - comments: [
     - user_id: int
     - comment: str
     - time: datetime
    ]
"""


class RecipeDetailsView(APIView):
    def get(self, request, recipe_id):
        recipe_details = {}
        try:
            recipe = Recipe.objects.get(recipe_id=recipe_id)
        except:
            return Response({"error": "Recipe not found."}, status=404)
        ingredients = list(Ingredient.objects.filter(recipe=recipe))
        instructions = list(RecipeInstruction.objects.filter(
            recipe_id=recipe).order_by('step_number'))
        recipe_images = list(ImageModel.objects.filter(parent_recipe=recipe, parent_instruction=None))
        comments = list(RecipeComment.objects.filter(recipe_id=recipe))
        diets = list(DietTag.objects.filter(recipe=recipe))
        cuisines = list(CuisineTag.objects.filter(recipe=recipe))

        diet_list = []
        for diet in diets:
            diet_list.append(diet.diet)

        cuisines_list = []
        for cuisine in cuisines:
            cuisines_list.append(cuisine.cuisine)

        # Acquire all image's urls
        image_list = []
        for image in recipe_images:
            image_list.append(image.main_image.url)

        # Acquire all of the ingredients
        ingredient_list = []
        for ingredient in ingredients:
            new = {}
            new["ingredients_name"] = ingredient.ingredients_name
            new["quantity"] = ingredient.quantity
            ingredient_list.append(new)

        # Acquire all recipe instructions
        instruction_list = []
        for instruction in instructions:
            step_images = list(ImageModel.objects.filter(
                parent_instruction=instruction))
            new = {}
            new["instruction"] = instruction.instruction
            new["step_number"] = instruction.step_number
            new["time"] = instruction.time
            steps_image_list = []
            for image in step_images:
                steps_image_list.append(image.main_image.url)
            new["images"] = steps_image_list
            instruction_list.append(new)

        comment_list = []
        for comment in comments:
            comment_images = list(CommentMedia.objects.filter(
                parent_comment=comment).order_by('media_index'))
            new = {}
            new["user_id"] = comment.user_id.id
            new['username'] = comment.user_id.first_name + \
                " " + comment.user_id.last_name
            try:
                avatar = get_object_or_404(AvatarModel, user=comment.user_id)
                new["avatar"] = avatar.avatar.url
            except:
                new["avatar"] = ''
            new["comment"] = comment.comment
            new["time"] = comment.time
            comment_image_list = []
            for image in comment_images:
                comment_image_list.append(image.media.url)
            new["images"] = comment_image_list
            comment_list.append(new)

        ratings = list(RecipeRating.objects.filter(recipe_id=recipe))
        average_rating = 0
        for rating in ratings:
            average_rating += rating.rating
        if len(ratings) != 0:
            average_rating = average_rating / len(ratings)

        liked = list(RecipeLike.objects.filter(
            recipe_id=recipe, user_id=request.user.id))
        recipe_details['liked'] = False
        for like in liked:
            if like.like:
                recipe_details['liked'] = True
            else:
                recipe_details['liked'] = False

        liked_in_db = RecipeLike.objects.filter(
            recipe_id=recipe, user_id=request.user.id)
        if liked_in_db:
            recipe_details['liked_in_db'] = True
        else:
            recipe_details['liked_in_db'] = False

        recipe_details['recipe_id'] = recipe.recipe_id
        recipe_details['recipe_name'] = recipe.recipe_name
        recipe_details['diet'] = diet_list
        recipe_details['cuisine'] = cuisines_list
        recipe_details['ingredients'] = ingredient_list
        recipe_details['steps'] = instruction_list
        recipe_details['serving'] = recipe.serving
        recipe_details['preparation_time'] = recipe.preparation_time
        recipe_details['cooking_time'] = recipe.cooking_time
        recipe_details['images'] = image_list
        recipe_details['comments'] = comment_list
        recipe_details['num_comments'] = len(comment_list)
        recipe_details['average_rating'] = average_rating
        recipe_details['author'] = recipe.user_id.first_name + \
            " " + recipe.user_id.last_name
        recipe_details['date'] = recipe.date
        recipe_details['description'] = recipe.description
        recipe_details['is_owner'] = recipe.user_id.id == request.user.id
        recipe_details['base_recipe'] = recipe.baseRecipe.recipe_name if recipe.baseRecipe else None
        recipe_details['base_recipe_id'] = recipe.baseRecipe.recipe_id if recipe.baseRecipe else None
        recipe_details['total_likes'] = len(
            RecipeLike.objects.filter(recipe_id=recipe, like=True))
        return JsonResponse(recipe_details)


"""
Shopping Cart: UPDATE/GET/POST/DELETE

  GET:
    Request:
    - user_id: int

    Response:
    - recipes: [
      - recipe_id: int
      - quantity: int
      - ingredients: [
        - ingredients_name: str
        - quantity: int
        ]
    ]

  UPDATE/POST:
    Request:
    - user_id: int
    - recipe_id: int
    - quantity: int

    Response: 
    - 200 OK
    - 401 UNAUTHORIZED
    - 403 FORBIDDEN
    - 404 NOT FOUND

  DELETE:
    Request:
    - user_id: int
    - recipe_id: int

    Response: 
    - 200 OK
    - 401 UNAUTHORIZED
    - 403 FORBIDDEN
    - 404 NOT FOUND
"""


class ShoppingCartView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        shopping_list = []
        recipes = []
        response = {}
        entries = list(ShoppingList.objects.filter(user_id=user.id))

        for entry in entries:
            recipe = entry.recipe_id
            servings = entry.quantity
            ingredient = list(Ingredient.objects.filter(recipe=recipe))
            recipe_ingredients = []
            ingredient_list = []
            for item in ingredient:
                recipe_ingredients.append(
                    {"ingredients_name": item.ingredients_name, "quantity": item.quantity})
                item.quantity = item.quantity * entry.quantity
                ingredient_list.append(
                    {"ingredients_name": item.ingredients_name, "quantity": item.quantity})

            recipes.append({"recipe_id": recipe.recipe_id, "recipe_name": recipe.recipe_name,
                           "servings": servings, "ingredients": recipe_ingredients})

            for item in ingredient_list:
                found = False
                for i in shopping_list:
                    if item["ingredients_name"] == i["ingredients_name"]:
                        i["quantity"] += item["quantity"]
                        i["recipe"] += ", " + recipe.recipe_name
                        found = True
                if not found:
                    shopping_list.append(
                        {"ingredients_name": item["ingredients_name"], "quantity": item["quantity"], "recipe": recipe.recipe_name})

        response["recipes"] = recipes
        response["ingredients"] = shopping_list

        return JsonResponse(response, safe=False)

    def post(self, request):
        try:
            user = request.user
            recipe_id = request.POST.get("recipe_id", "")
            entries = list(ShoppingList.objects.filter(
                recipe_id=recipe_id, user_id=user.id))

            # Check if recipe exists, make sure there is only one instance of recipe
            try:
                recipe = Recipe.objects.get(recipe_id=recipe_id)
            except:
                return Response({"error": "Recipe does not exist"}, status=404)
            if entries != []:
                # print(entries)
                return JsonResponse({"message": "Recipe already exists"}, status=400)

            shopping_list_serializer = ShoppingListSerializer(
                data=request.data)
            shopping_list_serializer.is_valid(raise_exception=True)
            # MUST BE A USER INSTANCE. OF COURSE.
            shopping_list_serializer.save(user_id=user)

            return Response({"message": "Success"}, status=200)
        except:
            return MissingFieldsResponse(request, ["recipe_id"])

    def patch(self, request):
        user = request.user
        recipe_id = request.POST.get("recipe_id")
        entries = ShoppingList.objects.filter(
            recipe_id=recipe_id, user_id=user.id)

        try:
            recipe = Recipe.objects.get(recipe_id=recipe_id)
        except:
            return Response({"error": "Recipe does not exist in shopping list"}, status=404)

        if not entries.exists:
            return Response({"error": "Cannot edit nonexistent entry"}, status=403)

        list_item = get_object_or_404(ShoppingList, recipe_id=recipe_id)
        list_item.delete()

        shopping_list_serializer = ShoppingListSerializer(data=request.data)
        shopping_list_serializer.is_valid(raise_exception=True)
        shopping_list_serializer.save(user_id=user)

        return Response({"message": "Successfully edited"}, status=200)

    def delete(self, request):
        recipe_id = request.POST.get("recipe_id")
        user = request.user
        try:
            list_item = ShoppingList.objects.get(
                recipe_id=recipe_id, user_id=user.id)
        except:
            return Response({"message": "Recipe does not exist in shopping list"}, status=404)
        list_item.delete()

        return Response({"message": "Successfully removed recipe"}, status=200)
