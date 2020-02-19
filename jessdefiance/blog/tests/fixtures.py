from datetime import timedelta

import pytest
from django.utils import timezone

from ..factories import PostFactory, TagFactory, PostImageFactory
from ..models import CategoryChoices


@pytest.fixture
def post(db):
    return PostFactory(title='Title', slug='title', category=CategoryChoices.XD,
                       publish_at=timezone.now() - timedelta(days=1))


@pytest.fixture
def post_image(db):
    return PostImageFactory.create(name='name')


@pytest.fixture
def post_without_tags_data():
    return {
        'title': 'title',
        'slug': 'title',
        'category': CategoryChoices.XD,
        'content': 'content',
        'publish_at': timezone.now()
    }


@pytest.fixture
def post_with_tags_data(db):
    tag1, tag2 = TagFactory.create_batch(2)
    return {
        'title': 'title',
        'slug': 'title',
        'category': CategoryChoices.XD,
        'content': 'content',
        'publish_at': timezone.now(),
        'tags': [tag1.id, tag2.id]
    }


@pytest.fixture
def post_with_image_data(post_without_tags_data, post_image):
    post_without_tags_data['images'] = [post_image.id,]
    return post_without_tags_data
