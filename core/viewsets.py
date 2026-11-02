"""Reusable viewsets: a read-only public one and a full-CRUD admin one."""
from django.db import transaction
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from rest_framework.throttling import UserRateThrottle

from .permissions import IsStaffUser
from .throttles import UploadThrottle


class PublicReadViewSet(viewsets.ReadOnlyModelViewSet):
    """Anonymous, read-only access to *published* content.

    No authentication classes means no session or CSRF handling at all: this
    endpoint cannot be used to change anything.
    """

    authentication_classes: list = []
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return super().get_queryset().filter(is_published=True)


class AdminModelViewSet(viewsets.ModelViewSet):
    """Staff-only CRUD with publish / unpublish / reorder helpers."""

    permission_classes = [IsStaffUser]
    throttle_classes = [UserRateThrottle, UploadThrottle]
    ordering_fields = "__all__"

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        return self._set_published(True)

    @action(detail=True, methods=["post"])
    def unpublish(self, request, pk=None):
        return self._set_published(False)

    def _set_published(self, value: bool):
        obj = self.get_object()
        obj.is_published = value
        obj.save(update_fields=["is_published", "updated_at"])
        return Response(self.get_serializer(obj).data)

    @action(detail=False, methods=["post"])
    def reorder(self, request):
        """Body: {"order": [id, id, ...]} - first id becomes display_order 0."""
        ids = request.data.get("order")
        if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
            return Response(
                {"detail": "Send a list of item ids as 'order'."}, status=status.HTTP_400_BAD_REQUEST
            )
        model = self.get_queryset().model
        objects = {o.pk: o for o in model.objects.filter(pk__in=ids)}
        with transaction.atomic():
            batch = []
            for position, pk in enumerate(ids):
                obj = objects.get(pk)
                if obj is not None:
                    obj.display_order = position
                    batch.append(obj)
            model.objects.bulk_update(batch, ["display_order"])
        return Response({"reordered": len(batch)})


class SingletonAdminView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """GET/PUT/PATCH the single settings row at the collection URL."""

    permission_classes = [IsStaffUser]
    throttle_classes = [UserRateThrottle, UploadThrottle]
    pagination_class = None
    singleton_model = None

    def get_object(self):
        return self.singleton_model.load()

    def retrieve(self, request, *args, **kwargs):
        return Response(self.get_serializer(self.get_object()).data)
