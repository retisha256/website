from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # Django's built-in admin stays available as an emergency fallback (users,
    # raw data). The friendly CMS dashboard lives at /admin/ (see core.urls).
    path("django-admin/", admin.site.urls),
    path("api/", include("core.api_urls")),
    path("", include("core.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
