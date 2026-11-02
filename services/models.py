from django.db import models

from core.icons import ICON_CHOICES
from core.models import PublishableModel
from core.validators import UploadTo, validate_image


class Service(PublishableModel):
    class Category(models.TextChoices):
        EXECUTIVE = "executive", "Executive Virtual Assistance"
        ADMIN = "administrative", "Administrative & Operations Support"
        AI = "ai_operations", "AI Operations Support"
        TECHNICAL = "technical", "Technical Assistance"
        OTHER = "other", "Other"

    title = models.CharField(max_length=120)
    description = models.TextField(help_text="A short paragraph describing the service.")
    features = models.JSONField(default=list, blank=True, help_text="Bulleted list of what the service includes.")
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.OTHER, db_index=True)
    icon = models.CharField(max_length=30, choices=ICON_CHOICES, default="sparkle", blank=True)
    icon_image = models.ImageField(upload_to=UploadTo("icons"), blank=True, validators=[validate_image])
    icon_alt = models.CharField(max_length=120, blank=True)

    class Meta(PublishableModel.Meta):
        pass

    def __str__(self):
        return self.title
