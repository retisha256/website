from rest_framework import serializers

from core.serializers import BaseModelSerializer, StringListField, make_public

from .models import Experience


class ExperienceSerializer(BaseModelSerializer):
    responsibilities = StringListField()

    class Meta:
        model = Experience
        fields = "__all__"

    def validate(self, attrs):
        current = attrs.get("is_current", getattr(self.instance, "is_current", False))
        start = attrs.get("start_date", getattr(self.instance, "start_date", None))
        end = attrs.get("end_date", getattr(self.instance, "end_date", None))
        if current:
            attrs["end_date"] = None
        elif not end:
            raise serializers.ValidationError({"end_date": "Add an end date, or tick “current role”."})
        elif start and end < start:
            raise serializers.ValidationError({"end_date": "End date cannot be before the start date."})
        return attrs


PublicExperienceSerializer = make_public(ExperienceSerializer)
