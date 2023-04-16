from rest_framework import serializers, pagination
from .models import *
from Recipes.models import *
from django.db.models import Avg

class RecipeRatingSerializer(serializers.ModelSerializer):
     
     recipe_id = serializers.IntegerField(required=True)
     rating = serializers.IntegerField(required=True)
     class Meta:
        model = RecipeRating
        fields = ['recipe_id', 'rating']

     def validate_rating(self, value):
          """
          Checks that the rating is a value between 0 and 5.
          """
          if 0 > value or value > 5:
               raise serializers.ValidationError("Rating should be between 0 and 5")
          return value

class RecipeLikeSerializer(serializers.ModelSerializer):
        
     recipe_id = serializers.IntegerField(required=True)
     like = serializers.BooleanField(required=True)
     class Meta:
          model = RecipeLike
          fields = ['recipe_id', 'like']

class RecipeCommentSerializer(serializers.ModelSerializer):

     images = serializers.ListField(
          child=serializers.FileField(max_length=100000),
          allow_empty=True,
          required=False
     )
     class Meta:
          model = RecipeComment
          fields = ['recipe_id', 'comment', 'images']

class CommentMediaSerializer(serializers.ModelSerializer):
     class Meta:
          model = CommentMedia
          fields = ['media', 'media_index', 'parent_comment']

class RecipeSerializer(serializers.ModelSerializer):
     
    recipe_author = serializers.SerializerMethodField()
    ratings = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
#     cuisines = serializers.CharField(source='get_cuisines_display')
#     diets = serializers.CharField(source='get_diets_display')
    cuisines = serializers.SerializerMethodField()
    diets = serializers.SerializerMethodField()
    prep_time = serializers.IntegerField(source='preparation_time')
    cooking_time = serializers.IntegerField()
    images = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    # user like and rating
    like = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    # True if exists, otherwise False
    like_status = serializers.SerializerMethodField()
    rating_status = serializers.SerializerMethodField()
    description = serializers.CharField()
    class Meta:
          model = Recipe
          fields = ['recipe_id', 'recipe_name', 'recipe_author', 'ratings', 'likes', 'cuisines', 'diets', 'prep_time', 'cooking_time', 'images', 'like', 'rating', 'like_status', 'rating_status', 'comments', 'description']
    
    def get_recipe_author(self, obj):
        return f"{obj.user_id.first_name} {obj.user_id.last_name}"
    
    def get_cuisines(self, obj):
        return [(cuisine_tag.cuisine, cuisine_tag.get_cuisine_display()) for cuisine_tag in obj.cuisinetag_set.all()]
    
    def get_diets(self, obj):
         return [(diet_tag.diet, diet_tag.get_diet_display()) for diet_tag in obj.diettag_set.all()]
    
    def get_likes(self, obj):
        qs = RecipeLike.objects.filter(recipe_id=obj, like=True)
        count = qs.count()
        return count
    
    def get_ratings(self, obj):
         return RecipeRating.objects.filter(recipe_id=obj).aggregate(Avg('rating'))['rating__avg']
    
    def get_images(self, obj):
         image_models = ImageModel.objects.filter(parent_recipe=obj, parent_instruction=None)
         imgs = [img.main_image.url for img in image_models]
         return imgs
    
    def get_comments(self, obj):
         comments = RecipeComment.objects.filter(recipe_id=obj).count()
         return comments
    
    def get_like(self, obj):
         if self.context['request'].user.is_authenticated:
              user = self.context['request'].user
              qs = RecipeLike.objects.filter(recipe_id=obj, user_id=user)
              if qs.exists():
                   return qs.first().like
              return None
         return None
     
    def get_like_status(self, obj):
          if self.context['request'].user.is_authenticated:
               user = self.context['request'].user
               qs = RecipeLike.objects.filter(recipe_id=obj, user_id=user)
               if qs.exists():
                    return True
               return False
          return None


    def get_rating(self, obj):
          if self.context['request'].user.is_authenticated:
               user = self.context['request'].user
               qs = RecipeRating.objects.filter(recipe_id=obj, user_id=user)
               if qs.exists():
                    return qs.first().rating
               return None
          return None
     
    def get_rating_status(self, obj):
          if self.context['request'].user.is_authenticated:
               user = self.context['request'].user
               qs = RecipeRating.objects.filter(recipe_id=obj, user_id=user)
               if qs.exists():
                    return True
               return False
          return None
    
class CustomRecipePagination(pagination.PageNumberPagination):
     page_size = 10
     page_size_query_param = 'page_size'
     max_page_size = 100
