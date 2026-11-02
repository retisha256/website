"""Authentication, dashboard and public site-wide endpoints."""
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from education.models import Education
from experience.models import Experience
from projects.models import Project
from services.models import Service
from skills.models import Skill, SkillCategory
from testimonials.models import Testimonial

from .models import ContactLink, Profile, SiteSettings
from .permissions import IsStaffUser
from .serializers import ContactLinkSerializer, ProfileSerializer, SiteSettingsSerializer
from .throttles import LoginThrottle


def _user_payload(user):
    return {"id": user.pk, "username": user.get_username(), "name": user.get_full_name() or user.get_username()}


class CsrfView(APIView):
    """Sets the CSRF cookie so the CMS can send the X-CSRFToken header."""

    authentication_classes: list = []
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"csrfToken": get_token(request)})


class LoginView(APIView):
    authentication_classes: list = []
    permission_classes = [AllowAny]
    throttle_classes = [LoginThrottle]

    def post(self, request):
        SessionAuthentication().enforce_csrf(request)
        username = str(request.data.get("username", "")).strip()
        password = str(request.data.get("password", ""))
        user = authenticate(request, username=username, password=password)
        if user is None or not user.is_staff:
            # Same message for unknown user, wrong password and non-staff: no account probing.
            return Response(
                {"detail": "Incorrect username or password."}, status=status.HTTP_400_BAD_REQUEST
            )
        login(request, user)
        return Response(_user_payload(user))


class LogoutView(APIView):
    permission_classes = [IsStaffUser]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        return Response(_user_payload(request.user))


class ChangePasswordView(APIView):
    permission_classes = [IsStaffUser]

    def post(self, request):
        current = str(request.data.get("current_password", ""))
        new = str(request.data.get("new_password", ""))
        user = request.user
        if not user.check_password(current):
            return Response(
                {"detail": "Please correct the highlighted fields.",
                 "errors": {"current_password": ["Your current password is incorrect."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            validate_password(new, user)
        except DjangoValidationError as exc:
            return Response(
                {"detail": "Please correct the highlighted fields.", "errors": {"new_password": list(exc.messages)}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new)
        user.save(update_fields=["password"])
        update_session_auth_hash(request, user)
        return Response({"detail": "Password updated."})


# --- Dashboard ---------------------------------------------------------------

# (cms route, label, model, field used to name an item)
DASHBOARD_MODULES = [
    ("projects", "Project", Project, "title"),
    ("services", "Service", Service, "title"),
    ("skills", "Skill", Skill, "name"),
    ("experience", "Experience", Experience, "job_title"),
    ("education", "Education", Education, "qualification"),
    ("testimonials", "Testimonial", Testimonial, "name"),
]


class DashboardView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        counts, recent = {}, []
        for route, label, model, name_field in DASHBOARD_MODULES:
            qs = model.objects.all()
            published = qs.filter(is_published=True).count()
            total = qs.count()
            counts[route] = {"label": label, "total": total, "published": published, "drafts": total - published}
            for obj in qs.order_by("-updated_at")[:5]:
                recent.append({
                    "module": route, "type": label, "id": obj.pk,
                    "title": getattr(obj, name_field), "published": obj.is_published,
                    "updated_at": obj.updated_at,
                })
        recent.sort(key=lambda row: row["updated_at"], reverse=True)

        profile, site = Profile.load(), SiteSettings.load()
        checks = [
            {"ok": bool(profile.photo), "text": "Profile photograph uploaded", "module": "profile"},
            {"ok": bool(profile.cv_file), "text": "CV (PDF) uploaded for the download button", "module": "profile"},
            {"ok": bool(profile.long_bio), "text": "Full biography written", "module": "profile"},
            {"ok": bool(site.og_image), "text": "Social sharing image set", "module": "settings"},
            {"ok": counts["services"]["published"] > 0, "text": "At least one service published", "module": "services"},
            {"ok": counts["projects"]["published"] > 0, "text": "At least one project published", "module": "projects"},
            {"ok": not site.maintenance_mode, "text": "Maintenance mode is off", "module": "settings"},
        ]
        incomplete = [
            p.title for p in Project.objects.filter(is_published=True)
            if not p.outcomes
        ]
        return Response({
            "counts": counts,
            "recent": recent[:10],
            "checks": checks,
            "projects_without_outcomes": incomplete,
            "maintenance_mode": site.maintenance_mode,
        })


# --- Public site-wide data -----------------------------------------------------


def _public(serializer_cls, instance, drop=()):
    data = serializer_cls(instance).data
    for key in ("created_at", "updated_at", *drop):
        data.pop(key, None)
    return data


class PublicSiteView(APIView):
    """Everything the public pages need that is not a list: settings, profile, links."""

    authentication_classes: list = []
    permission_classes = [AllowAny]

    def get(self, request):
        site = SiteSettings.load()
        links = ContactLink.objects.filter(is_published=True)
        profile = Profile.load()
        return Response({
            "site": _public(SiteSettingsSerializer, site, drop=("maintenance_mode", "maintenance_message")),
            "profile": _public(ProfileSerializer, profile),
            "links": [_public(ContactLinkSerializer, link, drop=("is_published",)) for link in links],
        })
