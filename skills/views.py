from django.db.models import Prefetch
from rest_framework.response import Response

from core.viewsets import AdminModelViewSet, PublicReadViewSet

from .models import Skill, SkillCategory
from .serializers import (
    PublicSkillCategorySerializer,
    SkillCategorySerializer,
    SkillSerializer,
)


class PublicSkillCategoryViewSet(PublicReadViewSet):
    """Published categories with their published skills. Empty categories are omitted."""

    queryset = SkillCategory.objects.prefetch_related(
        Prefetch("skills", queryset=Skill.objects.filter(is_published=True))
    )
    serializer_class = PublicSkillCategorySerializer

    def list(self, request, *args, **kwargs):
        data = [c for c in self.get_serializer(self.get_queryset(), many=True).data if c["skills"]]
        return Response(data)


class AdminSkillCategoryViewSet(AdminModelViewSet):
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer
    search_fields = ["name", "description"]
    filterset_fields = ["is_published"]


class AdminSkillViewSet(AdminModelViewSet):
    queryset = Skill.objects.select_related("category")
    serializer_class = SkillSerializer
    search_fields = ["name", "description", "category__name"]
    filterset_fields = ["is_published", "category"]
