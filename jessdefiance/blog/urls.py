from typing import Any, List

from rest_framework.routers import DefaultRouter

from .views import PostViewSet, TagViewSet

router = DefaultRouter()
router.register('posts', PostViewSet)
router.register('tags', TagViewSet)

urlpatterns: List[Any] = [

]
