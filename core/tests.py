import io
import tempfile

from django.conf import settings as django_settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIClient

from education.models import Education
from experience.models import Experience
from projects.models import Project
from services.models import Service
from skills.models import Skill, SkillCategory
from testimonials.models import Testimonial

from .models import Profile, SiteSettings

User = get_user_model()
PASSWORD = "Str0ng-Test-Pass!"


def png_bytes(size=(20, 20)):
    buf = io.BytesIO()
    Image.new("RGB", size, "teal").save(buf, "PNG")
    return buf.getvalue()


@override_settings(PASSWORD_HASHERS=["django.contrib.auth.hashers.MD5PasswordHasher"])  # fast tests only
class ApiTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.staff = User.objects.create_user("admin", password=PASSWORD, is_staff=True)
        cls.visitor = User.objects.create_user("visitor", password=PASSWORD)

    def setUp(self):
        cache.clear()
        self.anon = APIClient()
        self.admin = APIClient()
        self.admin.force_authenticate(self.staff)


class PublicApiTests(ApiTestCase):
    def test_public_lists_hide_unpublished_content(self):
        Service.objects.create(title="Live", description="d", is_published=True)
        Service.objects.create(title="Hidden", description="d", is_published=False)
        Project.objects.create(title="Live P", summary="s", is_published=True)
        Project.objects.create(title="Hidden P", summary="s", is_published=False)
        Experience.objects.create(organization="O", job_title="J", start_date="2026-01-01", is_published=False)
        Education.objects.create(institution="I", qualification="Q", is_published=False, date="2025-01-01")

        self.assertEqual([s["title"] for s in self.anon.get("/api/public/services/").json()], ["Live"])
        self.assertEqual([p["title"] for p in self.anon.get("/api/public/projects/").json()], ["Live P"])
        self.assertEqual(self.anon.get("/api/public/experience/").json(), [])
        self.assertEqual(self.anon.get("/api/public/education/").json(), [])

    def test_unpublished_project_detail_is_404(self):
        project = Project.objects.create(title="Secret", summary="s", is_published=False)
        self.assertEqual(self.anon.get(f"/api/public/projects/{project.slug}/").status_code, 404)

    def test_public_payload_has_no_admin_fields(self):
        Service.objects.create(title="Live", description="d")
        item = self.anon.get("/api/public/services/").json()[0]
        for key in ("is_published", "created_at", "updated_at"):
            self.assertNotIn(key, item)
        site = self.anon.get("/api/public/site/").json()
        self.assertNotIn("maintenance_mode", site["site"])

    def test_empty_skill_categories_and_unpublished_skills_are_omitted(self):
        full = SkillCategory.objects.create(name="Full")
        SkillCategory.objects.create(name="Empty")
        Skill.objects.create(name="Shown", category=full)
        Skill.objects.create(name="Hidden", category=full, is_published=False)
        data = self.anon.get("/api/public/skills/").json()
        self.assertEqual([c["name"] for c in data], ["Full"])
        self.assertEqual([s["name"] for s in data[0]["skills"]], ["Shown"])

    def test_testimonials_need_published_and_permission(self):
        Testimonial.objects.create(name="A", text="t", is_published=True, permission_confirmed=False)
        Testimonial.objects.create(name="B", text="t", is_published=True, permission_confirmed=True)
        names = [t["name"] for t in self.anon.get("/api/public/testimonials/").json()]
        self.assertEqual(names, ["B"])

    def test_project_search_and_category_filter(self):
        Project.objects.create(title="Django bot", summary="s", category="backend_development")
        Project.objects.create(title="Site", summary="s", category="web_development")
        self.assertEqual(len(self.anon.get("/api/public/projects/?search=django").json()), 1)
        self.assertEqual(len(self.anon.get("/api/public/projects/?category=web_development").json()), 1)

    def test_public_endpoints_are_read_only(self):
        for method in ("post", "put", "patch", "delete"):
            response = getattr(self.admin, method)("/api/public/services/", {"title": "x"}, format="json")
            self.assertEqual(response.status_code, 405, method)


class PermissionTests(ApiTestCase):
    def test_anonymous_cannot_use_admin_api(self):
        for path in ("/api/admin/projects/", "/api/admin/dashboard/", "/api/admin/profile/"):
            self.assertIn(self.anon.get(path).status_code, (401, 403), path)
        response = self.anon.post("/api/admin/services/", {"title": "x"}, format="json")
        self.assertIn(response.status_code, (401, 403))

    def test_non_staff_user_is_rejected(self):
        client = APIClient()
        client.force_authenticate(self.visitor)
        self.assertEqual(client.get("/api/admin/projects/").status_code, 403)

    def test_staff_can_crud(self):
        created = self.admin.post(
            "/api/admin/services/",
            {"title": "S", "description": "d", "category": "executive", "features": ["a", " ", "b"]},
            format="json",
        )
        self.assertEqual(created.status_code, 201, created.content)
        self.assertEqual(created.json()["features"], ["a", "b"])
        pk = created.json()["id"]
        patched = self.admin.patch(f"/api/admin/services/{pk}/", {"title": "T"}, format="json")
        self.assertEqual(patched.json()["title"], "T")
        self.assertEqual(self.admin.delete(f"/api/admin/services/{pk}/").status_code, 204)

    def test_publish_unpublish_and_reorder(self):
        a = Service.objects.create(title="A", description="d")
        b = Service.objects.create(title="B", description="d")
        self.assertFalse(self.admin.post(f"/api/admin/services/{a.pk}/unpublish/").json()["is_published"])
        self.assertTrue(self.admin.post(f"/api/admin/services/{a.pk}/publish/").json()["is_published"])
        reorder = self.admin.post("/api/admin/services/reorder/", {"order": [b.pk, a.pk]}, format="json")
        self.assertEqual(reorder.status_code, 200)
        a.refresh_from_db()
        b.refresh_from_db()
        self.assertEqual((b.display_order, a.display_order), (0, 1))
        bad = self.admin.post("/api/admin/services/reorder/", {"order": "x"}, format="json")
        self.assertEqual(bad.status_code, 400)


class AuthTests(ApiTestCase):
    def test_login_logout_flow(self):
        client = APIClient()
        ok = client.post("/api/auth/login/", {"username": "admin", "password": PASSWORD}, format="json")
        self.assertEqual(ok.status_code, 200)
        self.assertEqual(client.get("/api/auth/me/").json()["username"], "admin")
        self.assertEqual(client.post("/api/auth/logout/").status_code, 204)
        self.assertIn(client.get("/api/auth/me/").status_code, (401, 403))

    def test_bad_credentials_and_non_staff_share_one_message(self):
        bad = self.anon.post("/api/auth/login/", {"username": "admin", "password": "nope"}, format="json")
        non_staff = self.anon.post("/api/auth/login/", {"username": "visitor", "password": PASSWORD}, format="json")
        self.assertEqual(bad.status_code, 400)
        self.assertEqual(bad.json(), non_staff.json())

    def test_login_is_rate_limited(self):
        rest = {
            **django_settings.REST_FRAMEWORK,
            "DEFAULT_THROTTLE_RATES": {"anon": "1000/min", "user": "1000/min", "login": "2/min", "upload": "60/hour"},
        }
        with override_settings(REST_FRAMEWORK=rest):
            # DRF reads rates at import time, so patch the class attribute too.
            from rest_framework.throttling import SimpleRateThrottle

            original = SimpleRateThrottle.THROTTLE_RATES
            SimpleRateThrottle.THROTTLE_RATES = rest["DEFAULT_THROTTLE_RATES"]
            try:
                codes = [
                    self.anon.post("/api/auth/login/", {"username": "admin", "password": "bad"}, format="json").status_code
                    for _ in range(4)
                ]
            finally:
                SimpleRateThrottle.THROTTLE_RATES = original
        self.assertIn(429, codes)

    def test_csrf_is_enforced_for_session_writes(self):
        client = APIClient(enforce_csrf_checks=True)
        client.login(username="admin", password=PASSWORD)
        self.assertEqual(client.post("/api/admin/services/", {"title": "x"}, format="json").status_code, 403)

    def test_change_password_validates(self):
        weak = self.admin.post("/api/auth/password/", {"current_password": PASSWORD, "new_password": "123"}, format="json")
        self.assertEqual(weak.status_code, 400)
        wrong = self.admin.post(
            "/api/auth/password/", {"current_password": "bad", "new_password": "A-Brand-New-Passw0rd"}, format="json"
        )
        self.assertEqual(wrong.status_code, 400)


class ValidationTests(ApiTestCase):
    def test_error_shape_is_meaningful(self):
        response = self.admin.post("/api/admin/services/", {"title": ""}, format="json")
        self.assertEqual(response.status_code, 400)
        body = response.json()
        self.assertIn("detail", body)
        self.assertIn("title", body["errors"])

    def test_outcomes_require_evidence(self):
        bad = self.admin.post(
            "/api/admin/projects/", {"title": "P", "summary": "s", "outcomes": ["Saved 10 hours"]}, format="json"
        )
        self.assertEqual(bad.status_code, 400)
        self.assertIn("outcomes_evidence", bad.json()["errors"])
        ok = self.admin.post(
            "/api/admin/projects/",
            {"title": "P", "summary": "s", "outcomes": ["x"], "outcomes_evidence": "Reference letter"},
            format="json",
        )
        self.assertEqual(ok.status_code, 201)

    def test_project_slug_unique_and_tags_deduplicated(self):
        first = self.admin.post(
            "/api/admin/projects/", {"title": "Same", "summary": "s", "tags": ["Django", "django", "API"]}, format="json"
        ).json()
        second = self.admin.post("/api/admin/projects/", {"title": "Same", "summary": "s"}, format="json").json()
        self.assertEqual(sorted(first["tags"]), ["API", "Django"])
        self.assertNotEqual(first["slug"], second["slug"])

    def test_experience_date_rules(self):
        base = {"organization": "O", "job_title": "J", "start_date": "2026-01-01"}
        current = self.admin.post("/api/admin/experience/", {**base, "is_current": True, "end_date": "2026-05-01"}, format="json")
        self.assertIsNone(current.json()["end_date"])
        self.assertEqual(self.admin.post("/api/admin/experience/", base, format="json").status_code, 400)
        backwards = self.admin.post("/api/admin/experience/", {**base, "end_date": "2025-01-01"}, format="json")
        self.assertEqual(backwards.status_code, 400)

    def test_expected_education_requires_date(self):
        data = {"institution": "I", "qualification": "Q", "status": "expected"}
        self.assertEqual(self.admin.post("/api/admin/education/", data, format="json").status_code, 400)

    def test_testimonial_cannot_publish_without_permission(self):
        data = {"name": "N", "text": "t", "is_published": True, "permission_confirmed": False}
        self.assertEqual(self.admin.post("/api/admin/testimonials/", data, format="json").status_code, 400)

    def test_invalid_hex_colour_rejected(self):
        bad = self.admin.patch("/api/admin/site-settings/", {"color_accent": "red"}, format="json")
        self.assertEqual(bad.status_code, 400)
        good = self.admin.patch("/api/admin/site-settings/", {"color_accent": "#64FFDA"}, format="json")
        self.assertEqual(good.status_code, 200)


class UploadTests(ApiTestCase):
    def setUp(self):
        super().setUp()
        self.enterContext(override_settings(MEDIA_ROOT=tempfile.mkdtemp()))

    def upload(self, name, content, content_type):
        return self.admin.patch(
            "/api/admin/profile/", {"photo": SimpleUploadedFile(name, content, content_type)}, format="multipart"
        )

    def test_valid_image_is_accepted_and_filename_randomised(self):
        response = self.upload("my photo.png", png_bytes(), "image/png")
        self.assertEqual(response.status_code, 200, response.content)
        self.assertNotIn("my photo", response.json()["photo"])

    def test_fake_image_is_rejected(self):
        self.assertEqual(self.upload("evil.png", b"<script>alert(1)</script>", "image/png").status_code, 400)

    def test_svg_and_wrong_extension_are_rejected(self):
        svg = b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
        self.assertEqual(self.upload("x.svg", svg, "image/svg+xml").status_code, 400)
        self.assertEqual(self.upload("x.php", png_bytes(), "image/png").status_code, 400)

    def test_oversized_image_is_rejected(self):
        with override_settings(MAX_IMAGE_UPLOAD_BYTES=100):
            self.assertEqual(self.upload("big.png", png_bytes((200, 200)), "image/png").status_code, 400)

    def test_cv_must_be_a_real_pdf(self):
        bad = self.admin.patch(
            "/api/admin/profile/", {"cv_file": SimpleUploadedFile("cv.pdf", b"not a pdf")}, format="multipart"
        )
        self.assertEqual(bad.status_code, 400)
        good = self.admin.patch(
            "/api/admin/profile/", {"cv_file": SimpleUploadedFile("cv.pdf", b"%PDF-1.4\n%%EOF")}, format="multipart"
        )
        self.assertEqual(good.status_code, 200, good.content)

    def test_clearing_a_file_with_null(self):
        self.upload("a.png", png_bytes(), "image/png")
        cleared = self.admin.patch("/api/admin/profile/", {"photo": None}, format="json")
        self.assertEqual(cleared.status_code, 200)
        self.assertIsNone(cleared.json()["photo"])


class SiteTests(ApiTestCase):
    def test_pages_render_with_seo_meta_and_csp(self):
        for path in ("/", "/about/", "/services/", "/portfolio/", "/contact/"):
            response = self.anon.get(path)
            self.assertEqual(response.status_code, 200, path)
            self.assertContains(response, "<title>")
            self.assertContains(response, 'property="og:title"')
            self.assertIn("Content-Security-Policy", response)

    def test_project_page_only_for_published(self):
        live = Project.objects.create(title="Live", summary="s")
        hidden = Project.objects.create(title="Hidden", summary="s", is_published=False)
        self.assertContains(self.anon.get(f"/portfolio/{live.slug}/"), "Live | ")
        self.assertEqual(self.anon.get(f"/portfolio/{hidden.slug}/").status_code, 404)

    def test_sitemap_and_robots(self):
        Project.objects.create(title="Live", summary="s")
        Project.objects.create(title="Hidden", summary="s", is_published=False)
        sitemap = self.anon.get("/sitemap.xml").content.decode()
        self.assertIn("/portfolio/live/", sitemap)
        self.assertNotIn("/portfolio/hidden/", sitemap)
        robots = self.anon.get("/robots.txt").content.decode()
        self.assertIn("Disallow: /admin/", robots)
        self.assertIn("Sitemap:", robots)

    def test_maintenance_mode(self):
        site = SiteSettings.load()
        site.maintenance_mode = True
        site.save()
        self.assertEqual(self.anon.get("/").status_code, 503)
        self.assertEqual(self.anon.get("/api/public/site/").status_code, 200)
        self.assertEqual(self.anon.get("/admin/").status_code, 200)

    def test_cms_shell_is_noindex(self):
        self.assertEqual(self.anon.get("/admin/projects/3").headers["X-Robots-Tag"], "noindex, nofollow")

    def test_dashboard_counts(self):
        Project.objects.create(title="P", summary="s")
        Project.objects.create(title="D", summary="s", is_published=False)
        data = self.admin.get("/api/admin/dashboard/").json()
        self.assertEqual(data["counts"]["projects"], {"label": "Project", "total": 2, "published": 1, "drafts": 1})


class SeedTests(TestCase):
    def test_seed_is_idempotent_and_cv_based(self):
        with override_settings(MEDIA_ROOT=tempfile.mkdtemp()):
            call_command("seed_portfolio", verbosity=0)
            call_command("seed_portfolio", verbosity=0)
        self.assertEqual(Project.objects.count(), 4)
        self.assertEqual(Service.objects.count(), 4)
        self.assertEqual(Testimonial.objects.count(), 0)  # never invented
        self.assertEqual(Education.objects.get(institution="ERA92 Academy").status, "expected")
        self.assertFalse(Project.objects.exclude(outcomes=[]).exists())  # no invented outcomes
        self.assertTrue(Profile.load().email)
