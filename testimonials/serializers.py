from rest_framework import serializers

from core.serializers import BaseModelSerializer, make_public

from .models import Testimonial


class TestimonialSerializer(BaseModelSerializer):
    class Meta:
        model = Testimonial
        fields = "__all__"

    def validate(self, attrs):
        published = attrs.get("is_published", getattr(self.instance, "is_published", True))
        permitted = attrs.get("permission_confirmed", getattr(self.instance, "permission_confirmed", False))
        if published and not permitted:
            raise serializers.ValidationError(
                {"permission_confirmed": "Confirm the author has given permission before publishing."}
            )
        return attrs


PublicTestimonialSerializer = make_public(TestimonialSerializer, exclude=("permission_confirmed",))
