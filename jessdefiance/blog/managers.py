from datetime import datetime
from typing import TYPE_CHECKING

from django.db.models import Manager


class PostManager(Manager):  # type: ignore
    def published(self):
        return self.filter(publish_at__lt=datetime.now(), published=True)
