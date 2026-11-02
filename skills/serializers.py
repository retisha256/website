from rest_framework import serializers

from core.serializers import BaseModelSerializer, make_public

from .models import Skill, SkillCategory


class SkillSerializer(BaseModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Skill
        fields = "__all__"


class SkillCategorySerializer(BaseModelSerializer):
    skill_count = serializers.IntegerField(source="skills.count", read_only=True)

    class Meta:
        model = SkillCategory
        fields = "__all__"
        read_only_fields = ["slug"]


PublicSkillSerializer = make_public(SkillSerializer, exclude=("category", "category_name"))


class PublicSkillCategorySerializer(BaseModelSerializer):
    """A category with its published skills nested inside, ready to render."""

    skills = serializers.SerializerMethodField()

    class Meta:
        model = SkillCategory
        fields = ["id", "name", "slug", "description", "icon", "skills"]

    def get_skills(self, category):
        published = [s for s in category.skills.all() if s.is_published]
        return PublicSkillSerializer(published, many=True, context=self.context).data
