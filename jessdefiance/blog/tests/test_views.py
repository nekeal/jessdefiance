import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from ..serializers import PostSerializer
from ..views import PostViewSet, TagViewSet


@pytest.fixture
def post_detail_view():
    return PostViewSet.as_view({'get': 'retrieve'})


@pytest.fixture
def post_list_view():
    return PostViewSet.as_view({'get': 'list', 'post': 'create'})


@pytest.fixture
def tag_list_view():
    return TagViewSet.as_view({'get': 'list', 'post': 'create'})

def test_non_admin_user_cant_see_all_fields(post, api_rf, post_list_view):
    request = api_rf.get(reverse('api:post-list'))
    response = post_list_view(request)
    assert set(response.data.get('results')[0]) & {'created_at', 'updated_at', 'published'} == set(),\
        'does not have this fields'


def test_admin_can_see_all_fields(post, api_rf, admin_user, post_list_view):
    request = api_rf.get(reverse('api:post-list'))
    force_authenticate(request, admin_user)
    response = post_list_view(request)
    assert response.status_code == status.HTTP_200_OK
    assert set(response.data.get('results')[0]) == set(PostSerializer().fields), \
        'have all fields defined in serializer'


def test_admin_can_create_post_without_tags(api_rf, admin_user, post_list_view, post_without_tags_data):
    request = api_rf.post(reverse("api:post-list"), data=post_without_tags_data)
    force_authenticate(request, admin_user)
    response = post_list_view(request)
    assert response.status_code == status.HTTP_201_CREATED


def test_admin_can_create_post_with_tags(api_rf, admin_user, post_list_view, post_with_tags_data):
    request = api_rf.post(reverse("api:post-list"), data=post_with_tags_data)
    force_authenticate(request, admin_user)
    response = post_list_view(request)
    assert response.status_code == status.HTTP_201_CREATED


def test_admin_can_create_tags(api_rf, admin_user, tag_list_view):
    data = {'name': 'tag'}
    request = api_rf.post(reverse('api:tag-list'), data=data)
    force_authenticate(request, admin_user)
    response = tag_list_view(request)
    assert response.status_code == status.HTTP_201_CREATED
