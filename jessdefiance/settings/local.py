import dj_database_url

from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'jessdefiance'),
        'USER': os.environ.get('POSTGRES_USER', 'jessdefiance'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'jessdefiance'),
        'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
                'PORT': 5432,
    }
}
DATABASE_URL = os.environ.get('DATABASE_URL')
db_from_env = dj_database_url.config(default=DATABASE_URL, conn_max_age=500, ssl_require=False)
DATABASES['default'].update(db_from_env)
