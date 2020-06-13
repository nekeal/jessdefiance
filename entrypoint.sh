#!/bin/bash
if [[ $DJANGO_SETTINGS_MODULE == "jessdefiance.settings.production" ]]
then
  echo "Running migrations..."
  python manage.py migrate
  echo "Running collectstatic...."
  python manage.py collectstatic --no-input
  echo "Starting gunicorn"
  gunicorn --bind 0.0.0.0:$PORT jessdefiance.wsgi
else
  echo "Starting developer server"
  python manage.py runserver 0.0.0.0:$PORT
fi
