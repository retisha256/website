from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsStaffUser(BasePermission):
    """Active, authenticated staff only. Anonymous visitors never pass."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_active and user.is_staff)


class ReadOnlyPublic(BasePermission):
    """Anyone may read; nobody may write through the public API."""

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
