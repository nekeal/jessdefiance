import django_filters
from rest_framework import filters


class DynamicSearchFilter(filters.SearchFilter):

    def get_search_fields(self, view, request):
        search_fields = request.GET.getlist('search_fields')
        if search_fields:
            return search_fields
        return super().get_search_fields(view, request)


class PostFilterSet(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    content = django_filters.CharFilter(lookup_expr='icontains')
