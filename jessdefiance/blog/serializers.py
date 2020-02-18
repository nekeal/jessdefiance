from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers

from .models import Post, Tag


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'name')


class PostSerializer(FlexFieldsModelSerializer):

    class Meta:
        model = Post
        fields = ("title", 'slug', 'category', 'content', 'created_at', 'updated_at', 'publish_at', 'published', 'tags')
        expandable_fields = {
            'tags': (TagSerializer, {'many': True})
        }
