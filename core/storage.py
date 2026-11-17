from pathlib import PurePosixPath

from cloudinary_storage.storage import MediaCloudinaryStorage


class PortfolioCloudinaryStorage(MediaCloudinaryStorage):
    def _get_resource_type(self, name):
        if PurePosixPath(name).suffix.lower() in {".pdf", ".ico"}:
            return "raw"
        return super()._get_resource_type(name)
