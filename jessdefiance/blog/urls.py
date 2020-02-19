from typing import Any, List

from rest_framework.routers import DefaultRouter

from .views import PostViewSet, TagViewSet, PostImageViewSet

router = DefaultRouter()
router.register('posts', PostViewSet)
router.register('tags', TagViewSet)
router.register('images', PostImageViewSet, basename='image')

urlpatterns: List[Any] = [

]
