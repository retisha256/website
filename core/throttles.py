from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class LoginThrottle(AnonRateThrottle):
    scope = "login"


class UploadThrottle(UserRateThrottle):
    """Limits file uploads only; ordinary JSON edits are not counted."""

    scope = "upload"

    def allow_request(self, request, view):
        if not (request.content_type or "").startswith("multipart/"):
            return True
        return super().allow_request(request, view)
