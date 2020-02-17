import pytest

from unittest import mock

from django.urls import reverse
from rest_framework.test import force_authenticate

from ..serializers import PostSerializer
from ..views import PostViewSet


@pytest.fixture
def post_detail_view():
    return PostViewSet.as_view({'get': 'retrieve'})


@pytest.fixture
def post_list_view():
    return PostViewSet.as_view({'get': 'list'})


def test_non_admin_user_cant_see_all_fields(post, api_rf, post_list_view):
    request = api_rf.get(reverse('api:post-list'))
    response = post_list_view(request)
    assert set(response.data.get('results')[0]) & {'created_at', 'updated_at', 'published'} == set(),\
        'does not have this fields'


def test_admin_can_see_all_fields(post, api_rf, admin_user, post_list_view):
    request = api_rf.get(reverse('api:post-list'))
    force_authenticate(request, admin_user)
    response = post_list_view(request)
    assert set(response.data.get('results')[0]) == set(PostSerializer().fields), \
        'have all fields defined in serializer'

