"""Secure upload validation shared by every model with a file or image field."""
import os
import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.utils.deconstruct import deconstructible
from PIL import Image, UnidentifiedImageError

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
FAVICON_EXTENSIONS = IMAGE_EXTENSIONS | {".ico"}
IMAGE_FORMATS = {"JPEG", "PNG", "WEBP", "GIF", "ICO"}
MAX_IMAGE_PIXELS = 6000 * 6000


@deconstructible
class UploadTo:
    """`upload_to` that discards the user's filename and uses a random one.

    This prevents path tricks, odd characters and collisions; only the
    (already validated) extension is kept.
    """

    def __init__(self, folder: str):
        self.folder = folder

    def __call__(self, instance, filename: str) -> str:
        ext = os.path.splitext(filename)[1].lower()
        return f"{self.folder}/{uuid.uuid4().hex}{ext}"

    def __eq__(self, other):
        return isinstance(other, UploadTo) and other.folder == self.folder


def _check_size(file, limit: int, label: str) -> None:
    if file.size > limit:
        raise ValidationError(f"{label} is too large (max {limit // (1024 * 1024)} MB).")


def _extension(file) -> str:
    return os.path.splitext(file.name)[1].lower()


def validate_image(file, extensions=IMAGE_EXTENSIONS) -> None:
    """Accept only real raster images: extension, size, and decoded content."""
    if _extension(file) not in extensions:
        allowed = ", ".join(sorted(e.lstrip(".") for e in extensions))
        raise ValidationError(f"Unsupported image type. Allowed: {allowed}.")
    _check_size(file, settings.MAX_IMAGE_UPLOAD_BYTES, "Image")
    try:
        file.seek(0)
        with Image.open(file) as img:
            if img.format not in IMAGE_FORMATS:
                raise ValidationError("The file is not a supported image format.")
            width, height = img.size
            if width * height > MAX_IMAGE_PIXELS:
                raise ValidationError("Image dimensions are too large (max 6000 x 6000 px).")
            img.verify()
    except (UnidentifiedImageError, OSError, SyntaxError):
        raise ValidationError("The file is not a valid image.")
    finally:
        file.seek(0)


def validate_favicon(file) -> None:
    validate_image(file, FAVICON_EXTENSIONS)


def validate_pdf(file) -> None:
    """Accept PDFs only: extension, size, and the %PDF magic bytes."""
    if _extension(file) != ".pdf":
        raise ValidationError("Only PDF files are allowed.")
    _check_size(file, settings.MAX_DOCUMENT_UPLOAD_BYTES, "Document")
    file.seek(0)
    header = file.read(5)
    file.seek(0)
    if header != b"%PDF-":
        raise ValidationError("The file is not a valid PDF.")


def validate_image_or_pdf(file) -> None:
    if _extension(file) == ".pdf":
        validate_pdf(file)
    else:
        validate_image(file)


validate_hex_color = RegexValidator(
    r"^#[0-9A-Fa-f]{6}$", "Enter a colour as a 6-digit hex code such as #0A192F."
)
