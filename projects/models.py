from django.db import models
from django.utils.text import slugify

from core.models import PublishableModel, TimeStampedModel
from core.validators import UploadTo, validate_image


class Tag(models.Model):
    name = models.CharField(max_length=40, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        self.name = self.name.strip()
        if not self.slug:
            self.slug = slugify(self.name)[:50]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Project(PublishableModel):
    class Category(models.TextChoices):
        VIRTUAL_ASSISTANCE = "virtual_assistance", "Virtual Assistance"
        AI_OPERATIONS = "ai_operations", "AI Operations"
        ADMINISTRATION = "administration", "Administration"
        WEB_DEVELOPMENT = "web_development", "Web Development"
        BACKEND_DEVELOPMENT = "backend_development", "Backend Development"
        OTHER = "other", "Other"

    title = models.CharField(max_length=140)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.OTHER, db_index=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="projects")
    is_featured = models.BooleanField(default=False, db_index=True, help_text="Show on the homepage.")

    organization = models.CharField(max_length=140, blank=True, help_text="Employer, client or context, if any.")
    period = models.CharField(max_length=60, blank=True, help_text="e.g. 2026 or Aug 2026 – Present")
    role_title = models.CharField(max_length=120, blank=True)

    summary = models.CharField(max_length=300, help_text="One or two sentences shown on project cards.")
    # Case-study structure
    overview = models.TextField(blank=True)
    problem = models.TextField("problem or need addressed", blank=True)
    role_description = models.TextField("my role and responsibilities (intro)", blank=True)
    responsibilities = models.JSONField(default=list, blank=True)
    work_completed = models.JSONField(default=list, blank=True)
    technologies = models.JSONField("tools and technologies", default=list, blank=True)
    challenges_lessons = models.TextField(blank=True)
    outcomes = models.JSONField(
        "verified outcomes", default=list, blank=True,
        help_text="Only add outcomes you can back up with evidence.",
    )
    outcomes_evidence = models.CharField(
        max_length=300, blank=True, help_text="How the outcomes can be verified (link, document, reference)."
    )

    thumbnail = models.ImageField(upload_to=UploadTo("projects"), blank=True, validators=[validate_image])
    thumbnail_alt = models.CharField(max_length=200, blank=True)
    live_url = models.URLField(blank=True)
    source_url = models.URLField(blank=True)

    class Meta(PublishableModel.Meta):
        pass

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)[:150] or "project"
            slug, n = base, 2
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug, n = f"{base}-{n}", n + 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to=UploadTo("projects/gallery"), validators=[validate_image])
    alt_text = models.CharField(max_length=200, blank=True)
    caption = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.project} image {self.pk}"
