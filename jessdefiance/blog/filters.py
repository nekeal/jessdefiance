import django_filters
from rest_framework import filters

from .models import Post, Tag, CategoryChoices


class DynamicSearchFilter(filters.SearchFilter):

    def get_search_fields(self, view, request):
        search_fields = request.GET.getlist('search_fields')
        if search_fields:
            return search_fields
        return super().get_search_fields(view, request)


class PostFilterSet(django_filters.FilterSet):
    tag = django_filters.ModelMultipleChoiceFilter(queryset=Tag.objects.all(), field_name='tags', conjoined=True)
    category = django_filters.MultipleChoiceFilter(choices=CategoryChoices.choices())

    class Meta:
        model = Post
        fields = ('category',)
