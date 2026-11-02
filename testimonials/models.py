from django.db import models

from core.models import PublishableModel
from core.validators import UploadTo, validate_image


class Testimonial(PublishableModel):
    """Only add real testimonials that the author has authorised you to publish."""

    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    organization = models.CharField(max_length=140, blank=True)
    text = models.TextField()
    image = models.ImageField(upload_to=UploadTo("testimonials"), blank=True, validators=[validate_image])
    image_alt = models.CharField(max_length=200, blank=True)
    permission_confirmed = models.BooleanField(
        default=False, help_text="Tick to confirm this person authorised you to publish their words."
    )

    class Meta(PublishableModel.Meta):
        pass

    def __str__(self):
        return self.name
