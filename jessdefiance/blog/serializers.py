from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers

from .models import Post, Tag, PostImage


class PostImageSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    def get_thumbnail(self, obj):
        return self.context['request'].build_absolute_uri(obj.image['thumbnail'].url)

    class Meta:
        model = PostImage
        fields = ('id', 'name', 'image', 'thumbnail')


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'name')


class PostSerializer(FlexFieldsModelSerializer):

    class Meta:
        model = Post
        fields = ("title", 'slug', 'category', 'content', 'created_at', 'updated_at', 'publish_at', 'published', 'tags',
                  'images')
        expandable_fields = {
            'tags': (TagSerializer, {'many': True}),
            'images': (PostImageSerializer, {'many': True})
        }
