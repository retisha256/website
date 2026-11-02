from django.conf import settings
from django.db import DatabaseError

from .models import ContactLink, Profile, SiteSettings


def _rgb(hex_value: str, fallback: str) -> str:
    value = (hex_value or fallback).lstrip("#")
    if len(value) != 6:
        value = fallback.lstrip("#")
    try:
        return " ".join(str(int(value[i:i + 2], 16)) for i in (0, 2, 4))
    except ValueError:
        return _rgb(fallback, fallback)


def absolute_url(path_or_url: str) -> str:
    if not path_or_url:
        return ""
    if path_or_url.startswith(("http://", "https://")):
        return path_or_url
    return f"{settings.SITE_URL}{path_or_url}"


def site(request):
    """Branding, navigation, footer and contact details for every public template."""
    if request.path.startswith(("/admin/", "/django-admin/", "/api/")):
        return {}
    try:
        site_settings = SiteSettings.load()
        profile = Profile.load()
        links = list(ContactLink.objects.filter(is_published=True))
    except DatabaseError:
        return {}

    theme = (
        f":root{{--c-bg:{_rgb(site_settings.color_background, '#F8F9FA')};"
        f"--c-ink:{_rgb(site_settings.color_text, '#0A192F')};"
        f"--c-accent:{_rgb(site_settings.color_accent, '#64FFDA')};"
        f"--c-muted:{_rgb(site_settings.color_muted, '#52606D')};}}"
    )
    nav = [
        {"label": site_settings.nav_home, "href": "/", "key": "home"},
        {"label": site_settings.nav_about, "href": "/about/", "key": "about"},
        {"label": site_settings.nav_services, "href": "/services/", "key": "services"},
        {"label": site_settings.nav_portfolio, "href": "/portfolio/", "key": "portfolio"},
        {"label": site_settings.nav_contact, "href": "/contact/", "key": "contact"},
    ]
    return {
        "site": site_settings,
        "profile": profile,
        "links": links,
        "nav": nav,
        "theme_css": theme,
        "csp_nonce": getattr(request, "csp_nonce", ""),
        "site_url": settings.SITE_URL,
        "canonical_url": f"{settings.SITE_URL}{request.path}",
        "og_image_url": absolute_url(
            site_settings.og_image.url if site_settings.og_image else (profile.photo.url if profile.photo else "")
        ),
    }
