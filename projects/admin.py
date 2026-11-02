from django.contrib import admin

from .models import Project, ProjectImage, Tag

admin.site.register(Project)
admin.site.register(ProjectImage)
admin.site.register(Tag)
