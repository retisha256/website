"""Server-rendered page shells. Page content is fetched from the API by the frontend."""
from django.conf import settings
from django.contrib.sitemaps import Sitemap
from django.http import Http404, HttpResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.cache import never_cache

from projects.models import Project

from .models import Profile, SiteSettings

PAGES = {
    "home": {"title": None, "label": "Home"},
    "about": {"title": "About", "label": "About"},
    "services": {"title": "Services", "label": "Services"},
    "portfolio": {"title": "Portfolio & Case Studies", "label": "Portfolio"},
    "contact": {"title": "Contact", "label": "Contact"},
}


def _meta(request, page: str, extra_title: str | None = None, extra_description: str | None = None):
    site, profile = SiteSettings.load(), Profile.load()
    brand = site.site_title
    default_title = site.seo_title or f"{profile.professional_title} | {brand}"
    description = site.seo_description or site.hero_statement

    if extra_title:
        title = f"{extra_title} | {brand}"
    elif page == "home":
        title = default_title
    else:
        title = f"{PAGES[page]['title']} | {brand}"

    if extra_description:
        description = extra_description
    elif page == "about":
        description = profile.seo_description or profile.short_bio or description
    elif page == "services":
        description = f"Executive virtual assistance, administrative support, AI operations and technical assistance from {profile.full_name}."
    elif page == "portfolio":
        description = f"Selected projects and case studies by {profile.full_name}."
    elif page == "contact":
        description = f"Contact {profile.full_name} to discuss virtual assistance, administrative support and AI operations."
    return {"page_title": title, "page_description": description[:300]}


def page(request, name: str):
    return render(request, "public/page.html", {"page": name, **_meta(request, name)})


def home(request):
    return page(request, "home")


def about(request):
    return page(request, "about")


def services(request):
    return page(request, "services")


def portfolio(request):
    return page(request, "portfolio")


def contact(request):
    return page(request, "contact")


def project_detail(request, slug: str):
    try:
        project = Project.objects.get(slug=slug, is_published=True)
    except Project.DoesNotExist:
        raise Http404("Project not found")
    context = _meta(request, "portfolio", project.title, project.summary)
    context.update({"page": "project", "project_slug": project.slug})
    if project.thumbnail:
        from .context_processors import absolute_url

        context["og_image_override"] = absolute_url(project.thumbnail.url)
    return render(request, "public/page.html", context)


@never_cache
def cms_shell(request, path: str = ""):
    """The CMS single-page app. It handles its own login, so the shell itself is public
    (it contains no content or secrets) and every API call is authenticated."""
    response = render(request, "cms/index.html")
    response["X-Robots-Tag"] = "noindex, nofollow"
    return response


def robots_txt(request):
    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        "Disallow: /django-admin/",
        "Disallow: /api/",
        f"Sitemap: {settings.SITE_URL}{reverse('sitemap')}",
    ]
    return HttpResponse("\n".join(lines) + "\n", content_type="text/plain")


class StaticPagesSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8

    def items(self):
        return ["home", "about", "services", "portfolio", "contact"]

    def location(self, item):
        return {"home": "/", "about": "/about/", "services": "/services/",
                "portfolio": "/portfolio/", "contact": "/contact/"}[item]


class ProjectSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6

    def items(self):
        return Project.objects.filter(is_published=True)

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f"/portfolio/{obj.slug}/"


def not_found(request, exception=None):
    return render(request, "404.html", status=404)
