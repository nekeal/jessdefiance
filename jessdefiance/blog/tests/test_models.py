from datetime import timedelta

import pytest
from django.utils import timezone

from ..factories import PostFactory
from ..models import Post


@pytest.mark.parametrize("published,expected", ((True, 0), (False, 0)))
def test_published_method_hides_future_posts(db, published, expected):
    PostFactory(publish_at=timezone.now() + timedelta(days=1), published=published)
    assert Post.objects.published().count() == expected


@pytest.mark.parametrize("published,expected", ((True, 1), (False, 0)))
def test_published_method_can_hide_post(db, published, expected):
    PostFactory(publish_at=timezone.now() - timedelta(days=1), published=published)
    assert Post.objects.published().count() == expected
