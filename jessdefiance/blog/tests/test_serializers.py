import pytest

from ..models import Post
from ..serializers import PostSerializer


@pytest.mark.django_db
def test_can_create_post_without_tags(post_without_tags_data):

    serializer = PostSerializer(data=post_without_tags_data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    assert Post.objects.count() == 1


@pytest.mark.django_db
def test_can_create_post_with_tags(post_with_tags_data):
    serializer = PostSerializer(data=post_with_tags_data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    assert Post.objects.count() == 1
    assert tuple(Post.objects.get().tags.values('id')) == ({'id': post_with_tags_data['tags'][0]},
                                                           {'id': post_with_tags_data['tags'][1]})
