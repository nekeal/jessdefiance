from django.db.models import QuerySet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAdminUser

from .filters import PostFilterSet, DynamicSearchFilter
from .models import Post, Tag, PostImage
from .serializers import PostSerializer, TagSerializer, PostImageSerializer


class PostImageViewSet(viewsets.ModelViewSet):
    serializer_class = PostImageSerializer
    queryset = PostImage.objects.all()
    permission_classes = (IsAdminUser,)


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
    filter_backends = (SearchFilter, )
    search_fields = ('name', )


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    lookup_field = 'slug'
    filter_backends = (DjangoFilterBackend, DynamicSearchFilter, OrderingFilter)
    search_fields = ('title',)
    ordering_fields = ['title', 'publish_at', 'created_at']
    filterset_class = PostFilterSet
    anonymous_user_omit_fields = ['created_at', 'updated_at', 'published']

    def get_serializer(self, *args, **kwargs):
        omit_fields = self.anonymous_user_omit_fields if not self.request.user.is_staff else []
        return super().get_serializer(*args, **kwargs, omit=omit_fields)
    def paginate_queryset(self, queryset):
        return super(PostViewSet, self).paginate_queryset(queryset)   
    def get_queryset(self) -> 'QuerySet[Post]':
        if self.request.user.is_staff:
            return Post.objects.order_by('-publish_at')
        return Post.objects.published().order_by('-publish_at')
