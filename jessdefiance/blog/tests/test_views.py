import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from ..models import Post
from ..serializers import PostSerializer
from ..views import PostViewSet, TagViewSet, PostImageViewSet
from ...common.factories import UserFactory


@pytest.fixture
def post_detail_view():
    return PostViewSet.as_view({'get': 'retrieve'})


@pytest.fixture
def post_list_view():
    return PostViewSet.as_view({'get': 'list', 'post': 'create'})


@pytest.fixture
def post_image_list_view():
    return PostImageViewSet.as_view({'get': 'list', 'post': 'create'})


@pytest.fixture
def tag_list_view():
    return TagViewSet.as_view({'get': 'list', 'post': 'create'})


# --- Post ViewSet ---

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


def test_admin_can_create_post_with_images(api_rf, admin_user, post_list_view, post_with_image_data):
    request = api_rf.post(reverse('api:post-list'), data=post_with_image_data, user=admin_user)
    force_authenticate(request, admin_user)
    response = post_list_view(request)
    assert response.status_code == status.HTTP_201_CREATED
    assert Post.objects.get().images.all().get().id == post_with_image_data['images'][0]


# --- Tag ViewSet ---

def test_admin_can_create_tags(api_rf, admin_user, tag_list_view):
    data = {'name': 'tag'}
    request = api_rf.post(reverse('api:tag-list'), data=data)
    force_authenticate(request, admin_user)
    response = tag_list_view(request)
    assert response.status_code == status.HTTP_201_CREATED


# --- PostImage ViewSet ---

@pytest.mark.django_db
@pytest.mark.parametrize("user,expected_status", [(UserFactory.build(is_staff=True), status.HTTP_200_OK),
                                                  (UserFactory.build(is_staff=False), status.HTTP_403_FORBIDDEN)
                                                  ])
def test_access_to_post_image_viewset(user, expected_status, api_rf, post_image_list_view):
    request = api_rf.get(reverse('api:image-list'))
    force_authenticate(request, user)
    response = post_image_list_view(request)
    assert response.status_code == expected_status
