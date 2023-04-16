from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Recipe(models.Model):
    class Diets(models.TextChoices):
        VEGETARIAN = 'V', _('Vegetarian')
        VEGAN = 'VG', _('Vegan')
        GLUTEN_FREE = 'GF', _('Gluten Free')
        DAIRY_FREE = 'DF', _('Dairy Free')
        OTHER = 'O', _('Other')

    class Cuisines(models.TextChoices):
        CHINESE = 'C', _('Chinese')
        ITALIAN = 'I', _('Italian')
        MEXICAN = 'M', _('Mexican')
        JAPANESE = 'J', _('Japanese')
        OTHER = 'O', _('Other')

    recipe_id = models.AutoField(primary_key=True)
    recipe_name = models.CharField(max_length=100)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    average_rating = models.FloatField(null=True)
    likes = models.IntegerField(default=0)
    serving = models.IntegerField(default=1)
    cooking_time = models.IntegerField()
    preparation_time = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=1000)
    baseRecipe = models.ForeignKey('self', on_delete=models.CASCADE, null=True)


class CuisineTag(models.Model):
    # This represents one cuisine tag on one recipe
    class Cuisines(models.TextChoices):
        AMERICAN = 'A', _('American')
        BRAZILIAN = 'B', _('Brazilian')
        CHINESE = 'C', _('Chinese')
        KOREAN = 'K', _('Korean')
        JAPANESE = 'J', _('Japanese')
        OTHER = 'O', _('Other')
    cuisine = models.CharField(max_length=2, choices=Cuisines.choices)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, default=None)


class DietTag(models.Model):
    # This represents one diet tag on one recipe
    class Diets(models.TextChoices):
        VEGETARIAN = 'V', _('Vegetarian')
        VEGAN = 'VG', _('Vegan')
        GLUTEN_FREE = 'GF', _('Gluten Free')
        DAIRY_FREE = 'DF', _('Dairy Free')
        OTHER = 'O', _('Other')
    diet = models.CharField(max_length=2, choices=Diets.choices)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, default=None)


class Ingredient(models.Model):
    ingredients_id = models.AutoField(primary_key=True)
    ingredients_name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, default=None)


class ImageModel(models.Model): 
    main_image = models.FileField(upload_to='media/')
    parent_recipe = models.ForeignKey(
        'Recipe', on_delete=models.CASCADE, null=True)
    parent_instruction = models.ForeignKey(
        'RecipeInstruction', on_delete=models.CASCADE, null=True)


class RecipeInstruction(models.Model):
    # <recipe_id> actually refers to a Recipe object. DO NOT be fooled
    instruction_id = models.AutoField(primary_key=True)
    recipe_id = models.ForeignKey('Recipe', on_delete=models.CASCADE)
    instruction = models.CharField(max_length=1000)
    step_number = models.IntegerField()
    time = models.IntegerField()

# ShoppingList is actually a single item in the shopping list
# do not let this atrocious naming convention fool you


class ShoppingList(models.Model):
    recipe_id = models.ForeignKey('Recipe', on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['recipe_id', 'user_id'], name='unique_shopping_list'
            )
        ]
