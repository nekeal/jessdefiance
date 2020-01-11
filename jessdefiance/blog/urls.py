from typing import Any, List

from rest_framework.routers import DefaultRouter

from jessdefiance.blog.views import PostViewSet

router = DefaultRouter()
router.register('posts', PostViewSet)

urlpatterns: List[Any] = [

]
