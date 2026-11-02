from django.conf import settings
from django.contrib.sitemaps.views import sitemap
from django.urls import path, re_path
from django.views.static import serve

from . import views

sitemaps = {"pages": views.StaticPagesSitemap, "projects": views.ProjectSitemap}

urlpatterns = [
    path("", views.home, name="home"),
    path("about/", views.about, name="about"),
    path("services/", views.services, name="services"),
    path("portfolio/", views.portfolio, name="portfolio"),
    path("portfolio/<slug:slug>/", views.project_detail, name="project-detail"),
    path("contact/", views.contact, name="contact"),
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="sitemap"),
    path("robots.txt", views.robots_txt, name="robots"),
    # The CMS dashboard (a TypeScript single-page app). Any sub-path loads the same shell.
    path("admin/", views.cms_shell, name="cms"),
    re_path(r"^admin/(?P<path>.+)$", views.cms_shell),
]

# Uploaded media. In production this is only needed when using local disk storage
# (e.g. a Render persistent disk); with S3 the files are served by the bucket instead.
if not settings.DEBUG and not getattr(settings, "AWS_STORAGE_BUCKET_NAME", None):
    urlpatterns += [
        re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
    ]

handler404 = "core.views.not_found"
