from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'jessdefiance'),
        'USER': os.environ.get('POSTGRES_USER', 'jessdefiance'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'jessdefiance'),
        'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
    }
}