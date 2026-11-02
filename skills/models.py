from django.db import models
from django.utils.text import slugify

from core.icons import ICON_CHOICES
from core.models import PublishableModel


class SkillCategory(PublishableModel):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=90, unique=True, blank=True)
    description = models.CharField(max_length=240, blank=True)
    icon = models.CharField(max_length=30, choices=ICON_CHOICES, blank=True)

    class Meta(PublishableModel.Meta):
        verbose_name_plural = "skill categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:90]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Skill(PublishableModel):
    name = models.CharField(max_length=80)
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name="skills")
    description = models.CharField(max_length=240, blank=True)
    icon = models.CharField(max_length=30, choices=ICON_CHOICES, blank=True)

    class Meta(PublishableModel.Meta):
        constraints = [
            models.UniqueConstraint(fields=["category", "name"], name="unique_skill_per_category")
        ]

    def __str__(self):
        return self.name
