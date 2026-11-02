from rest_framework import serializers

from core.serializers import BaseModelSerializer, StringListField, make_public

from .models import Project, ProjectImage, Tag


class TagListField(serializers.Field):
    """Reads/writes tags as a list of names, creating tags on demand."""

    def to_representation(self, manager):
        return [tag.name for tag in manager.all()]

    def to_internal_value(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError("Expected a list of tag names.")
        names = []
        for raw in data:
            name = str(raw).strip()
            if name and len(name) > 40:
                raise serializers.ValidationError("Tags can be at most 40 characters.")
            if name and name.lower() not in [n.lower() for n in names]:
                names.append(name)
        return names


class ProjectImageSerializer(BaseModelSerializer):
    class Meta:
        model = ProjectImage
        fields = "__all__"


class ProjectSerializer(BaseModelSerializer):
    tags = TagListField(required=False)
    responsibilities = StringListField()
    work_completed = StringListField()
    technologies = StringListField()
    outcomes = StringListField()
    images = ProjectImageSerializer(many=True, read_only=True)
    category_label = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ["slug"]

    def validate(self, attrs):
        outcomes = attrs.get("outcomes", getattr(self.instance, "outcomes", []))
        evidence = attrs.get("outcomes_evidence", getattr(self.instance, "outcomes_evidence", ""))
        if outcomes and not evidence.strip():
            raise serializers.ValidationError(
                {"outcomes_evidence": "Say how these outcomes can be verified before adding them."}
            )
        return attrs

    def _save_tags(self, project, names):
        tags = []
        for name in names:
            tag = Tag.objects.filter(name__iexact=name).first() or Tag.objects.create(name=name)
            tags.append(tag)
        project.tags.set(tags)

    def create(self, validated_data):
        names = validated_data.pop("tags", [])
        project = super().create(validated_data)
        self._save_tags(project, names)
        return project

    def update(self, instance, validated_data):
        names = validated_data.pop("tags", None)
        project = super().update(instance, validated_data)
        if names is not None:
            self._save_tags(project, names)
        return project


class PublicProjectListSerializer(ProjectSerializer):
    """Card-sized representation used by listings."""

    class Meta(ProjectSerializer.Meta):
        fields = [
            "id", "title", "slug", "category", "category_label", "tags", "is_featured",
            "organization", "period", "role_title", "summary", "technologies",
            "thumbnail", "thumbnail_alt", "live_url", "source_url",
        ]


PublicProjectSerializer = make_public(ProjectSerializer, name="PublicProjectSerializer")


class TagSerializer(BaseModelSerializer):
    project_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tag
        fields = ["id", "name", "slug", "project_count"]
