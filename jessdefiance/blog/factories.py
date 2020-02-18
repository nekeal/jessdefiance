from datetime import timedelta

import factory
from django.utils import timezone
from django.utils.text import slugify

from .models import Post, CategoryChoices, Tag


class TagFactory(factory.DjangoModelFactory):
    name = factory.Sequence(lambda n: f'tag {n}')

    class Meta:
        model = Tag


class PostFactory(factory.DjangoModelFactory):
    title = factory.Sequence(lambda n: f'Title {n}')
    slug = factory.LazyAttribute(lambda o: slugify(o.title))
    category = CategoryChoices.XD
    content = 'content'
    publish_at = factory.LazyFunction(lambda: timezone.now() - timedelta(days=1))
    published = True

    class Meta:
        model = Post
