from core.viewsets import AdminModelViewSet, PublicReadViewSet

from .models import Experience
from .serializers import ExperienceSerializer, PublicExperienceSerializer


class PublicExperienceViewSet(PublicReadViewSet):
    queryset = Experience.objects.all()
    serializer_class = PublicExperienceSerializer


class AdminExperienceViewSet(AdminModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    search_fields = ["organization", "job_title", "description"]
    filterset_fields = ["is_published", "is_current"]
