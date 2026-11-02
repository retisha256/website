"""Django's built-in admin lives at /django-admin/ as a fallback for raw data and user accounts."""
from django.contrib import admin

from .models import ContactLink, Profile, SiteSettings

admin.site.site_header = "Portfolio — raw data admin"
admin.site.register(SiteSettings)
admin.site.register(Profile)
admin.site.register(ContactLink)
