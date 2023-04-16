from rest_framework import serializers, pagination
from Recipes.models import *
from SocialMedia.models import *
from django.db.models import Avg

class CommentSerializer(serializers.ModelSerializer):
     user = serializers.SerializerMethodField()
     class Meta:
          model = RecipeComment
          fields = ['comment_id', 'user', 'comment', 'time', 'edited']
    
     def get_user(self, obj):
          return f"{obj.user_id.first_name} {obj.user_id.last_name}"
class RecipeSerializer(serializers.ModelSerializer):
     
     recipe_author = serializers.SerializerMethodField()
     
     # recipe aggregate like and rating
     ratings = serializers.SerializerMethodField()
     ratings_count = serializers.SerializerMethodField()
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
     date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False)
     class Meta:
          model = Recipe
          fields = ['recipe_id', 'recipe_name', 'recipe_author', 'ratings', 'ratings_count', 'likes', 'cuisines', 'diets', 'prep_time', 'cooking_time', 'images', 'comments', 'like', 'rating', 'like_status', 'rating_status', 'date']
    
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
    
     def get_ratings_count(self, obj):
         return RecipeRating.objects.filter(recipe_id=obj).count()
    
     def get_images(self, obj):
         image_models = ImageModel.objects.filter(parent_recipe=obj, parent_instruction=None)
         imgs = [img.main_image.url for img in image_models]
         return imgs
    
     def get_comments(self, obj):
         comments = RecipeComment.objects.filter(recipe_id=obj)
         comments = CommentSerializer(comments, many=True).data
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
    
    
class RecipeFilterSerializer(serializers.ModelSerializer):
        recipe_name = serializers.CharField(required=False, allow_blank=True, default="")
        creator = serializers.CharField(required=False, allow_blank=True, default="")
        ingredients = serializers.CharField(required=False, allow_blank=True, default="")
        cuisines = serializers.ListField(
             child=serializers.CharField(),
             allow_empty=True
        )
        diets = serializers.ListField(
             child=serializers.CharField(),
             allow_empty=True
        )
        cooking_time = serializers.IntegerField()

        class Meta:
          model = Recipe
          fields = ['recipe_name', 'ingredients', 'creator', 'cuisines', 'diets', 'cooking_time']

class RecipeSortSerializer(serializers.ModelSerializer):
     
     recipes_list = serializers.ListField(
          child=serializers.IntegerField(),
          allow_empty=True
     )
     sort_rating = serializers.CharField(required=False, allow_blank=True)
     sort_favorite = serializers.CharField(required=False, allow_blank=True)
     sort_cooking_time = serializers.CharField(required=False, allow_blank=True)
     class Meta:
          model = Recipe
          fields = ['recipes_list', 'sort_rating', 'sort_favorite', 'sort_cooking_time']