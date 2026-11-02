from rest_framework import serializers

from core.serializers import BaseModelSerializer, make_public

from .models import Education


class EducationSerializer(BaseModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"

    def validate(self, attrs):
        status = attrs.get("status", getattr(self.instance, "status", None))
        date = attrs.get("date", getattr(self.instance, "date", None))
        if status == Education.Status.EXPECTED and not date:
            raise serializers.ValidationError({"date": "Enter the expected completion date."})
        if status == Education.Status.COMPLETED and not date:
            raise serializers.ValidationError({"date": "Enter the completion date."})
        return attrs


PublicEducationSerializer = make_public(EducationSerializer)
