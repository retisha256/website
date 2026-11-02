from django.db.models import Count, Q
from django_filters import rest_framework as filters
from rest_framework.decorators import action
from rest_framework.response import Response

from core.viewsets import AdminModelViewSet, PublicReadViewSet

from .models import Project, ProjectImage, Tag
from .serializers import (
    ProjectImageSerializer,
    ProjectSerializer,
    PublicProjectListSerializer,
    PublicProjectSerializer,
    TagSerializer,
)


class ProjectFilter(filters.FilterSet):
    tag = filters.CharFilter(field_name="tags__slug")
    featured = filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = Project
        fields = ["category", "tag", "featured"]


class PublicProjectViewSet(PublicReadViewSet):
    """Published projects, searchable by title, summary, organisation and tags."""

    queryset = Project.objects.prefetch_related("tags", "images")
    lookup_field = "slug"
    filterset_class = ProjectFilter
    search_fields = ["title", "summary", "organization", "tags__name"]
    ordering_fields = ["display_order", "title"]
    pagination_class = None

    def get_serializer_class(self):
        return PublicProjectSerializer if self.action == "retrieve" else PublicProjectListSerializer

    def filter_queryset(self, queryset):
        return super().filter_queryset(queryset).distinct()

    @action(detail=False, methods=["get"])
    def facets(self, request):
        """Categories and tags that actually have published projects (for filter UIs)."""
        published = Project.objects.filter(is_published=True)
        labels = dict(Project.Category.choices)
        categories = [
            {"value": row["category"], "label": labels.get(row["category"], row["category"]), "count": row["n"]}
            for row in published.values("category").annotate(n=Count("id")).order_by("category")
        ]
        tags = (
            Tag.objects.annotate(n=Count("projects", filter=Q(projects__is_published=True)))
            .filter(n__gt=0)
            .values("name", "slug", "n")
        )
        return Response({
            "categories": categories,
            "tags": [{"name": t["name"], "slug": t["slug"], "count": t["n"]} for t in tags],
        })


class AdminProjectViewSet(AdminModelViewSet):
    queryset = Project.objects.prefetch_related("tags", "images")
    serializer_class = ProjectSerializer
    search_fields = ["title", "summary", "organization", "tags__name"]
    filterset_fields = ["is_published", "is_featured", "category"]

    def filter_queryset(self, queryset):
        return super().filter_queryset(queryset).distinct()


class AdminProjectImageViewSet(AdminModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer
    filterset_fields = ["project"]


class AdminTagViewSet(AdminModelViewSet):
    queryset = Tag.objects.annotate(project_count=Count("projects"))
    serializer_class = TagSerializer
    search_fields = ["name"]
