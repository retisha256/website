from core.viewsets import AdminModelViewSet, PublicReadViewSet

from .models import Education
from .serializers import EducationSerializer, PublicEducationSerializer


class PublicEducationViewSet(PublicReadViewSet):
    queryset = Education.objects.all()
    serializer_class = PublicEducationSerializer
    filterset_fields = ["kind", "status"]


class AdminEducationViewSet(AdminModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    search_fields = ["institution", "qualification", "description"]
    filterset_fields = ["is_published", "kind", "status"]
