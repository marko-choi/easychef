from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class RecipeRating(models.Model):
    recipe_id = models.ForeignKey('Recipes.Recipe', on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(blank=True, null=True)

class RecipeLike(models.Model):
    recipe_id = models.ForeignKey('Recipes.Recipe', on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    like = models.BooleanField(default=True)

class RecipeComment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    recipe_id = models.ForeignKey('Recipes.Recipe', on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.CharField(max_length=1000)
    time = models.DateTimeField(auto_now_add=True)
    edited = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

class CommentMedia(models.Model):
    media = models.FileField(upload_to="SocialMedia/media/comments", blank=True, null=True, default=None)
    media_index = models.IntegerField()
    parent_comment = models.ForeignKey('RecipeComment', on_delete=models.CASCADE)