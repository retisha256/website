from .models import ContactLink, Profile, SiteSettings
from .serializers import ContactLinkSerializer, ProfileSerializer, SiteSettingsSerializer
from .viewsets import AdminModelViewSet, SingletonAdminView


class AdminProfileView(SingletonAdminView):
    singleton_model = Profile
    serializer_class = ProfileSerializer


class AdminSiteSettingsView(SingletonAdminView):
    singleton_model = SiteSettings
    serializer_class = SiteSettingsSerializer


class AdminContactLinkViewSet(AdminModelViewSet):
    queryset = ContactLink.objects.all()
    serializer_class = ContactLinkSerializer
    search_fields = ["label", "url"]
    filterset_fields = ["is_published"]
