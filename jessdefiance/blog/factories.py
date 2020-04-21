from datetime import timedelta

import factory
from django.utils import timezone
from django.utils.text import slugify

from .models import Post, CategoryChoices, Tag, PostImage


class PostImageFactory(factory.DjangoModelFactory):
    image = factory.django.ImageField(width=1, height=1)

    class Meta:
        model = PostImage


class TagFactory(factory.DjangoModelFactory):
    name = factory.Sequence(lambda n: f'tag {n}')

    class Meta:
        model = Tag


class PostFactory(factory.DjangoModelFactory):
    title = factory.Sequence(lambda n: f'Title {n}')
    slug = factory.LazyAttribute(lambda o: slugify(o.title))
    category = CategoryChoices.TRENDS
    content = 'content'
    publish_at = factory.LazyFunction(lambda: timezone.now() - timedelta(days=1))
    published = True
    background_image = factory.SubFactory(PostImageFactory)

    class Meta:
        model = Post
