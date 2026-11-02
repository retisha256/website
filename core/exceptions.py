"""Consistent, meaningful JSON error bodies for every API failure.

Shape: {"detail": "<summary>", "errors": {"field": ["message", ...]}}
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None
    data = response.data
    if isinstance(data, dict) and "detail" in data and len(data) == 1:
        return response
    if isinstance(data, (dict, list)):
        errors = data if isinstance(data, dict) else {"non_field_errors": data}
        summary = (
            "Please correct the highlighted fields."
            if response.status_code == status.HTTP_400_BAD_REQUEST
            else "The request could not be completed."
        )
        return Response({"detail": summary, "errors": errors}, status=response.status_code)
    return response
