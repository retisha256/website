"""Serializer building blocks shared by every app."""
from django.db import models
from rest_framework import serializers

from .models import ContactLink, Profile, SiteSettings


class MediaFileMixin:
    """Return the storage URL as-is (relative for local disk, absolute for S3).

    Avoids DRF building absolute URLs from the request, which is wrong behind
    some proxies and unnecessary for same-origin media.
    """

    def to_representation(self, value):
        if not value:
            return None
        try:
            return value.url
        except ValueError:
            return None


class MediaFileField(MediaFileMixin, serializers.FileField):
    def __init__(self, **kwargs):
        # The CMS clears an uploaded file by sending null.
        kwargs.update(allow_null=True, required=False)
        super().__init__(**kwargs)


class MediaImageField(MediaFileMixin, serializers.ImageField):
    def __init__(self, **kwargs):
        kwargs.update(allow_null=True, required=False)
        super().__init__(**kwargs)


class StringListField(serializers.ListField):
    """A list of short strings; blank entries are dropped, whitespace trimmed."""

    child = serializers.CharField(max_length=600, allow_blank=True)

    def __init__(self, **kwargs):
        kwargs.setdefault("required", False)
        kwargs.setdefault("allow_empty", True)
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        if isinstance(data, str):
            raise serializers.ValidationError("Expected a list of items.")
        items = super().to_internal_value(data)
        return [item.strip() for item in items if item and item.strip()]


class BaseModelSerializer(serializers.ModelSerializer):
    serializer_field_mapping = {
        **serializers.ModelSerializer.serializer_field_mapping,
        models.FileField: MediaFileField,
        models.ImageField: MediaImageField,
    }

    def update(self, instance, validated_data):
        for name, value in list(validated_data.items()):
            if value is None and isinstance(self.fields.get(name), (MediaFileField, MediaImageField)):
                validated_data[name] = ""
        return super().update(instance, validated_data)


def make_public(serializer_cls, exclude=(), name=None):
    """Derive the read-only public serializer: no status flags or timestamps."""
    hidden = ("is_published", "created_at", "updated_at", *exclude)

    class Meta(serializer_cls.Meta):
        fields = None

    declared = serializer_cls._declared_fields
    # A declared field cannot also be excluded; drop it by shadowing it with None.
    Meta.exclude = tuple(n for n in hidden if n not in declared)
    attrs = {"Meta": Meta, **{n: None for n in hidden if n in declared}}
    return type(name or f"Public{serializer_cls.__name__}", (serializer_cls,), attrs)


class SiteSettingsSerializer(BaseModelSerializer):
    hero_highlights = StringListField()

    class Meta:
        model = SiteSettings
        exclude = ("id",)


class ProfileSerializer(BaseModelSerializer):
    class Meta:
        model = Profile
        exclude = ("id",)


class ContactLinkSerializer(BaseModelSerializer):
    class Meta:
        model = ContactLink
        fields = "__all__"
