from django.http import HttpRequest
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request: HttpRequest, view):
        return bool(
            request.method in SAFE_METHODS
            or request.user
            and request.user.is_staff
        )
