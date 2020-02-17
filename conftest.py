import pytest
from rest_framework.test import APIRequestFactory

pytest_plugins = [
    'jessdefiance.blog.tests.fixtures'
]


@pytest.fixture()
def api_rf():
    return APIRequestFactory()
