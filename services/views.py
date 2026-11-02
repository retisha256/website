from core.viewsets import AdminModelViewSet, PublicReadViewSet

from .models import Service
from .serializers import PublicServiceSerializer, ServiceSerializer


class PublicServiceViewSet(PublicReadViewSet):
    queryset = Service.objects.all()
    serializer_class = PublicServiceSerializer
    filterset_fields = ["category"]


class AdminServiceViewSet(AdminModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    search_fields = ["title", "description"]
    filterset_fields = ["is_published", "category"]
