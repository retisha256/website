from django.db import models

from core.models import PublishableModel
from core.validators import UploadTo, validate_image_or_pdf


class Education(PublishableModel):
    class Kind(models.TextChoices):
        DEGREE = "degree", "Degree"
        CERTIFICATION = "certification", "Certificate / certification"
        DEVELOPMENT = "development", "Professional development"

    class Status(models.TextChoices):
        COMPLETED = "completed", "Completed"
        IN_PROGRESS = "in_progress", "Currently pursuing"
        EXPECTED = "expected", "Expected completion"

    institution = models.CharField(max_length=160)
    qualification = models.CharField(max_length=200)
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.CERTIFICATION)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)
    date = models.DateField(
        null=True, blank=True,
        help_text="Completion date (or expected completion date). Only month and year are shown.",
    )
    description = models.TextField(blank=True)
    certificate_file = models.FileField(
        upload_to=UploadTo("certificates"), blank=True, validators=[validate_image_or_pdf],
        help_text="Certificate image or PDF. Leave empty if none.",
    )

    class Meta(PublishableModel.Meta):
        verbose_name_plural = "education & certifications"

    def __str__(self):
        return f"{self.qualification} - {self.institution}"
