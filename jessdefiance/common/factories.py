import factory
from django.conf import settings


class UserFactory(factory.DjangoModelFactory):
    username = 'user'
    password = factory.PostGenerationMethodCall('set_password', '123')
    is_staff = False

    class Meta:
        model = settings.AUTH_USER_MODEL
