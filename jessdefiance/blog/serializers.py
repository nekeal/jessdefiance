from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers

from .models import Post, Tag, PostImage


class PostImageSerializer(serializers.ModelSerializer):
    thumbnails = serializers.SerializerMethodField()

    def get_thumbnails(self, obj):
        thumbnails = ('small', 'medium', 'large')
        return {name: self.context['request'].build_absolute_uri(obj.image[name].url) for name in thumbnails}

    class Meta:
        model = PostImage
        fields = ('id', 'name', 'image', 'thumbnails')


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'name')


class PostSerializer(FlexFieldsModelSerializer):

    class Meta:
        model = Post
        fields = ("title", 'subtitle', 'slug', 'category', 'content', 'created_at', 'updated_at', 'publish_at', 'published', 'tags',
                  'background_image', 'images')
        expandable_fields = {
            'tags': (TagSerializer, {'many': True}),
            'images': (PostImageSerializer, {'many': True})
        }
