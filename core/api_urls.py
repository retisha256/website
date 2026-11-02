"""All API routes.

/api/auth/    session login for the CMS
/api/public/  anonymous, read-only, published content only
/api/admin/   staff-only CRUD used by the CMS dashboard
/api/docs/    interactive OpenAPI documentation (Swagger UI)
"""
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

from education.views import AdminEducationViewSet, PublicEducationViewSet
from experience.views import AdminExperienceViewSet, PublicExperienceViewSet
from projects.views import (
    AdminProjectImageViewSet,
    AdminProjectViewSet,
    AdminTagViewSet,
    PublicProjectViewSet,
)
from services.views import AdminServiceViewSet, PublicServiceViewSet
from skills.views import (
    AdminSkillCategoryViewSet,
    AdminSkillViewSet,
    PublicSkillCategoryViewSet,
)
from testimonials.views import AdminTestimonialViewSet, PublicTestimonialViewSet

from . import api_views
from .views_admin import AdminContactLinkViewSet, AdminProfileView, AdminSiteSettingsView

public = DefaultRouter()
public.register("services", PublicServiceViewSet, basename="public-service")
public.register("skills", PublicSkillCategoryViewSet, basename="public-skills")
public.register("projects", PublicProjectViewSet, basename="public-project")
public.register("experience", PublicExperienceViewSet, basename="public-experience")
public.register("education", PublicEducationViewSet, basename="public-education")
public.register("testimonials", PublicTestimonialViewSet, basename="public-testimonial")

admin = DefaultRouter()
admin.register("services", AdminServiceViewSet, basename="admin-service")
admin.register("skill-categories", AdminSkillCategoryViewSet, basename="admin-skill-category")
admin.register("skills", AdminSkillViewSet, basename="admin-skill")
admin.register("projects", AdminProjectViewSet, basename="admin-project")
admin.register("project-images", AdminProjectImageViewSet, basename="admin-project-image")
admin.register("tags", AdminTagViewSet, basename="admin-tag")
admin.register("experience", AdminExperienceViewSet, basename="admin-experience")
admin.register("education", AdminEducationViewSet, basename="admin-education")
admin.register("testimonials", AdminTestimonialViewSet, basename="admin-testimonial")
admin.register("links", AdminContactLinkViewSet, basename="admin-link")

urlpatterns = [
    path("auth/csrf/", api_views.CsrfView.as_view(), name="auth-csrf"),
    path("auth/login/", api_views.LoginView.as_view(), name="auth-login"),
    path("auth/logout/", api_views.LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", api_views.MeView.as_view(), name="auth-me"),
    path("auth/password/", api_views.ChangePasswordView.as_view(), name="auth-password"),
    path("public/site/", api_views.PublicSiteView.as_view(), name="public-site"),
    path("public/", include(public.urls)),
    path("admin/dashboard/", api_views.DashboardView.as_view(), name="admin-dashboard"),
    path("admin/profile/", AdminProfileView.as_view({"get": "retrieve", "put": "update", "patch": "partial_update"})),
    path("admin/site-settings/", AdminSiteSettingsView.as_view({"get": "retrieve", "put": "update", "patch": "partial_update"})),
    path("admin/", include(admin.urls)),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="api-docs"),
]
