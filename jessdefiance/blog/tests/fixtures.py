import pytest

from ..factories import PostFactory
from ..models import CategoryChoices


@pytest.fixture
def post(db):
    return PostFactory(title='Title', slug='title', category=CategoryChoices.XD)
