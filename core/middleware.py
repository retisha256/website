import secrets

from django.db import DatabaseError
from django.shortcuts import render

# Paths that keep working while maintenance mode is on.
MAINTENANCE_EXEMPT = ("/admin/", "/django-admin/", "/api/", "/static/", "/media/")


class MaintenanceModeMiddleware:
    """Shows a 503 page to visitors (not staff) while maintenance mode is on."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.path.startswith(MAINTENANCE_EXEMPT):
            from .models import SiteSettings

            try:
                site = SiteSettings.objects.only("maintenance_mode", "maintenance_message", "site_title").first()
            except DatabaseError:  # tables not migrated yet
                site = None
            if site and site.maintenance_mode:
                user = getattr(request, "user", None)
                if not (user and user.is_authenticated and user.is_staff):
                    response = render(request, "maintenance.html", {"message": site.maintenance_message,
                                                                     "site_title": site.site_title}, status=503)
                    response["Retry-After"] = "3600"
                    return response
        return self.get_response(request)


class ContentSecurityPolicyMiddleware:
    """Strict CSP with a per-request nonce for the one inline <style> block."""

    SKIP_PREFIXES = ("/api/docs/", "/django-admin/")

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.csp_nonce = secrets.token_urlsafe(16)
        response = self.get_response(request)
        if request.path.startswith(self.SKIP_PREFIXES) or "Content-Security-Policy" in response:
            return response
        response["Content-Security-Policy"] = "; ".join([
            "default-src 'self'",
            f"style-src 'self' 'nonce-{request.csp_nonce}' https://fonts.googleapis.com",
            "style-src-attr 'unsafe-inline'",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "script-src 'self'",
            "connect-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
        ])
        response.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        return response
