from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from .models import Post
from .serializers import PostSerializer
from .filters import PostFilterSet, DynamicSearchFilter


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    filter_backends = (DjangoFilterBackend, DynamicSearchFilter)
    search_fields = ('title',)
    filterset_class = PostFilterSet
    anonymous_user_omit_fields = ['created_at', 'updated_at', 'published']

    def get_serializer(self, *args, **kwargs):
        omit_fields = self.anonymous_user_omit_fields if not self.request.user.is_staff else []
        return super().get_serializer(*args, **kwargs, omit=omit_fields)
