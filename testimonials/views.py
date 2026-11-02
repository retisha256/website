from core.viewsets import AdminModelViewSet, PublicReadViewSet

from .models import Testimonial
from .serializers import PublicTestimonialSerializer, TestimonialSerializer


class PublicTestimonialViewSet(PublicReadViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = PublicTestimonialSerializer

    def get_queryset(self):
        return super().get_queryset().filter(permission_confirmed=True)


class AdminTestimonialViewSet(AdminModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    search_fields = ["name", "organization", "text"]
    filterset_fields = ["is_published"]
