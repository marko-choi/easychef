from rest_framework import serializers
from .models import *


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['ingredients_id', 'ingredients_name', 'quantity', 'recipe']

class RecipeInstructionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeInstruction
        fields = ['instruction_id', 'instruction', 'step_number', 'time']

class ImageModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageModel
        fields = ['main_image']

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['recipe_id', 'recipe_name', 'cooking_time', 'preparation_time', 'serving', 'description', 'baseRecipe']

class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['recipe_id', 'quantity']

class DietTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietTag
        fields = ['diet', 'recipe']

class CuisineTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuisineTag
        fields = ['cuisine', 'recipe']