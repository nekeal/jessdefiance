from datetime import timedelta

import factory
from django.utils import timezone
from django.utils.text import slugify

from jessdefiance.blog.models import Post, CategoryChoices


class PostFactory(factory.DjangoModelFactory):
    title = factory.Sequence(lambda n: f'Title {n}')
    slug = factory.LazyAttribute(lambda o: slugify(o.title))
    category = CategoryChoices.XD
    content = 'content'
    publish_at = factory.LazyFunction(lambda: timezone.now() - timedelta(days=1))

    class Meta:
        model = Post
