from django.db.models import Manager
from django.utils import timezone


class PostManager(Manager):  # type: ignore
    def published(self):
        return self.filter(publish_at__lt=timezone.now(), published=True)
