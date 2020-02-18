from enum import Enum

from django.db import models

from jessdefiance.blog.managers import PostManager


class CategoryChoices(Enum):
    NOTES = 'Notes'
    LOOKS = 'Looks'
    XD = 'xDˣᴰ'

    def __str__(self) -> str:
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self) -> str:
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.CharField(max_length=20, choices=((tag.name, tag.value) for tag in CategoryChoices))
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    publish_at = models.DateTimeField()
    published = models.BooleanField(default=False)

    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')

    objects = PostManager()
