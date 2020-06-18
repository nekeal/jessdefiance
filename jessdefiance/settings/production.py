import dj_database_url
from dotenv import load_dotenv

from .base import *

env_path = Path('.env')
load_dotenv(dotenv_path=env_path)

DEBUG = False
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', '')
ALLOWED_HOSTS = ['*']


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console_info': {
            'level': 'WARNING',
            'class': 'logging.StreamHandler',
            'formatter': 'django.server',
}
    },
    'formatters': {
        'django.server': {
            '()': 'django.utils.log.ServerFormatter',
            'format': '[{server_time}] {message}',
            'style': '{'
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console_info'],
        }
    }
}
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'postgres'),
        'USER': os.environ.get('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', ''),
        'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
    }

}

DATABASE_URL = os.environ.get('DATABASE_URL')
db_from_env = dj_database_url.config(default=DATABASE_URL, conn_max_age=500, ssl_require=True)
DATABASES['default'].update(db_from_env)

STATIC_ROOT = BASE_DIR.joinpath('static')
MEDIA_ROOT = BASE_DIR.joinpath('media')

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
