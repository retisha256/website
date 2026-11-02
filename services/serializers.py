from core.serializers import BaseModelSerializer, StringListField, make_public

from .models import Service


class ServiceSerializer(BaseModelSerializer):
    features = StringListField()

    class Meta:
        model = Service
        fields = "__all__"


PublicServiceSerializer = make_public(ServiceSerializer)
