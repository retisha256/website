from django.contrib import admin

from .models import Skill, SkillCategory

admin.site.register(SkillCategory)
admin.site.register(Skill)
