from django.db import models

from core.models import PublishableModel


class Experience(PublishableModel):
    organization = models.CharField(max_length=140)
    job_title = models.CharField(max_length=140)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField("current role", default=False)
    arrangement = models.CharField("work arrangement / location", max_length=120, blank=True)
    description = models.TextField(blank=True)
    responsibilities = models.JSONField("responsibilities & achievements", default=list, blank=True)

    class Meta(PublishableModel.Meta):
        ordering = ["display_order", "-start_date", "id"]

    def save(self, *args, **kwargs):
        if self.is_current:
            self.end_date = None
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.job_title} - {self.organization}"
