from django.db import models

from .icons import ICON_CHOICES
from .validators import (
    UploadTo,
    validate_favicon,
    validate_hex_color,
    validate_image,
    validate_pdf,
)


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublishableModel(TimeStampedModel):
    """Shared by everything that can be shown, hidden and reordered in the CMS."""

    is_published = models.BooleanField(
        "published", default=True, db_index=True,
        help_text="Only published items appear on the public website.",
    )
    display_order = models.PositiveIntegerField(
        default=0, db_index=True, help_text="Lower numbers appear first."
    )

    class Meta:
        abstract = True
        ordering = ["display_order", "id"]


class SingletonModel(TimeStampedModel):
    """A table that only ever holds one row (profile, site settings)."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):  # the row is never deleted
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


def default_hero_highlights():
    return [
        "Executive calendar and inbox management",
        "Administrative coordination and follow-ups",
        "AI-assisted workflow support",
        "AI output verification and data privacy",
        "Digital organization and technical assistance",
    ]


class SiteSettings(SingletonModel):
    site_title = models.CharField(max_length=120, default="Retisha Nakiyemba")
    monogram = models.CharField(
        "logo monogram", max_length=4, default="RN",
        help_text="Short initials shown when no logo image is uploaded.",
    )
    logo = models.ImageField(upload_to=UploadTo("branding"), blank=True, validators=[validate_image])
    favicon = models.FileField(upload_to=UploadTo("branding"), blank=True, validators=[validate_favicon])

    # Theme
    color_background = models.CharField(max_length=7, default="#F8F9FA", validators=[validate_hex_color])
    color_text = models.CharField("heading & text colour", max_length=7, default="#0A192F", validators=[validate_hex_color])
    color_accent = models.CharField("accent & button colour", max_length=7, default="#64FFDA", validators=[validate_hex_color])
    color_muted = models.CharField("muted text colour", max_length=7, default="#52606D", validators=[validate_hex_color])

    # Navigation
    nav_home = models.CharField(max_length=30, default="Home")
    nav_about = models.CharField(max_length=30, default="About")
    nav_services = models.CharField(max_length=30, default="Services")
    nav_portfolio = models.CharField(max_length=30, default="Portfolio")
    nav_contact = models.CharField(max_length=30, default="Contact")
    nav_cta_label = models.CharField(max_length=40, default="Work With Me")

    # Homepage hero
    hero_eyebrow = models.CharField(max_length=120, blank=True, default="Executive support · Workflow operations · Responsible AI")
    hero_heading = models.CharField(max_length=160, default="Virtual Assistant & AI Operations Specialist")
    hero_statement = models.TextField(
        default=(
            "I help busy professionals stay organized, manage competing priorities, "
            "improve workflows, and use AI responsibly so they can focus on what matters most."
        )
    )
    hero_highlights = models.JSONField(
        default=default_hero_highlights, blank=True,
        help_text="Short service highlights shown under the hero (one per line in the CMS).",
    )
    hero_primary_cta_label = models.CharField(max_length=40, default="Work With Me")
    hero_secondary_cta_label = models.CharField(max_length=40, default="Explore My Services")

    # Homepage closing call to action
    closing_heading = models.CharField(max_length=120, default="Let’s Work Together")
    closing_text = models.TextField(
        default=(
            "Looking for dependable virtual assistance, organized administrative support "
            "or careful AI operations? Let’s talk about how I can help."
        )
    )

    footer_text = models.CharField(
        max_length=240, default="Virtual Assistant & AI Operations Specialist · Kampala, Uganda"
    )

    # SEO / sharing
    seo_title = models.CharField(max_length=70, blank=True)
    seo_description = models.CharField(max_length=170, blank=True)
    og_image = models.ImageField("social sharing image", upload_to=UploadTo("branding"), blank=True,
                                 validators=[validate_image])

    # Maintenance
    maintenance_mode = models.BooleanField(default=False)
    maintenance_message = models.CharField(
        max_length=240, default="The site is being updated. Please check back shortly.", blank=True
    )

    class Meta:
        verbose_name = "site settings"
        verbose_name_plural = "site settings"

    def __str__(self):
        return "Site settings"


class Profile(SingletonModel):
    full_name = models.CharField(max_length=120, default="Retisha Nakiyemba")
    professional_title = models.CharField(max_length=160, default="Virtual Assistant & AI Operations Specialist")
    short_bio = models.TextField(blank=True)
    long_bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to=UploadTo("profile"), blank=True, validators=[validate_image])
    photo_alt = models.CharField(
        max_length=200, blank=True, default="Portrait of Retisha Nakiyemba",
        help_text="Describes the photo for screen-reader users.",
    )
    location = models.CharField(max_length=120, blank=True)
    email = models.EmailField(blank=True)
    phone_primary = models.CharField(max_length=30, blank=True)
    phone_secondary = models.CharField(max_length=30, blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    availability_statement = models.CharField(max_length=240, blank=True)
    # About-page sections (each is optional and hidden when empty)
    about_executive_support = models.TextField("my approach to supporting executives", blank=True)
    about_strengths = models.TextField("organizational & communication strengths", blank=True)
    about_ai_responsibility = models.TextField("AI verification & responsible data handling", blank=True)
    about_technical = models.TextField("technical background", blank=True)
    cv_file = models.FileField("CV (PDF)", upload_to=UploadTo("documents"), blank=True, validators=[validate_pdf])
    seo_title = models.CharField(max_length=70, blank=True)
    seo_description = models.CharField(max_length=170, blank=True)

    def __str__(self):
        return self.full_name


class ContactLink(PublishableModel):
    """Extra professional links (portfolio, X, Behance...) beyond LinkedIn/GitHub."""

    label = models.CharField(max_length=60)
    url = models.URLField()
    icon = models.CharField(max_length=30, choices=ICON_CHOICES, default="link")

    class Meta(PublishableModel.Meta):
        pass

    def __str__(self):
        return self.label
