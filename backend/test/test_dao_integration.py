import pytest
from bson import ObjectId

from src.util.dao import DAO


@pytest.fixture
def user_dao():
    dao = DAO("user")
    dao.drop()
    dao = DAO("user")
    yield dao
    dao.drop()


def test_create_valid_user(user_dao):
    data = {
        "firstName": "Anna",
        "lastName": "Karlsson",
        "email": "anna@test.com"
    }

    result = user_dao.create(data)

    assert result["firstName"] == "Anna"
    assert result["lastName"] == "Karlsson"
    assert result["email"] == "anna@test.com"
    assert "_id" in result


def test_create_user_missing_required_field(user_dao):
    data = {
        "firstName": "Anna",
        "email": "anna@test.com"
    }

    with pytest.raises(Exception):
        user_dao.create(data)


def test_create_user_wrong_data_type(user_dao):
    data = {
        "firstName": 123,
        "lastName": "Karlsson",
        "email": "anna@test.com"
    }

    with pytest.raises(Exception):
        user_dao.create(data)


def test_create_user_invalid_tasks_type(user_dao):
    data = {
        "firstName": "Anna",
        "lastName": "Karlsson",
        "email": "anna2@test.com",
        "tasks": ["not-an-objectid"]
    }

    with pytest.raises(Exception):
        user_dao.create(data)