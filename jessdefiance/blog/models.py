from enum import Enum
from typing import Tuple, List

from django.db import models
from easy_thumbnails.fields import ThumbnailerImageField

from jessdefiance.blog.managers import PostManager


class CategoryChoices(Enum):
    NOTES = 'Notes'
    LOOKS = 'Looks'
    XD = 'xDˣᴰ'

    def __str__(self) -> str:
        return self.name

    @classmethod
    def choices(cls) -> List[Tuple[str, str]]:
        return [(tag.name, tag.value) for tag in cls]


class Tag(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self) -> str:
        return self.name


class PostImage(models.Model):
    name = models.CharField(max_length=100, blank=True)
    image = ThumbnailerImageField(upload_to='images')


class Post(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.CharField(max_length=20, choices=CategoryChoices.choices())
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    publish_at = models.DateTimeField()
    published = models.BooleanField(default=False)

    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    images = models.ManyToManyField(PostImage, blank=True, related_name='posts')
    background_image = models.ForeignKey('PostImage', on_delete=models.PROTECT, related_name='posts_with_background')

    objects = PostManager()
