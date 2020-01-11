from rest_flex_fields import FlexFieldsModelSerializer

from jessdefiance.blog.models import Post


class PostSerializer(FlexFieldsModelSerializer):

    class Meta:
        model = Post
        fields = ("title", 'slug', 'category', 'content', 'created_at', 'updated_at', 'publish_at', 'published')
