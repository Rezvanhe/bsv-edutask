import pytest
from unittest.mock import MagicMock

from src.controllers.usercontroller import UserController


def test_get_user_by_email_returns_user_when_email_exists():
    mock_dao = MagicMock()
    fake_user = {"_id": "1", "email": "test@example.com", "name": "Test User"}
    mock_dao.find.return_value = [fake_user]

    controller = UserController(mock_dao)

    result = controller.get_user_by_email("test@example.com")

    assert result == fake_user
    mock_dao.find.assert_called_once_with({"email": "test@example.com"})


def test_get_user_by_email_returns_first_user_when_multiple_users_exist(capsys):
    mock_dao = MagicMock()
    fake_user_1 = {"_id": "1", "email": "test@example.com", "name": "User One"}
    fake_user_2 = {"_id": "2", "email": "test@example.com", "name": "User Two"}
    mock_dao.find.return_value = [fake_user_1, fake_user_2]

    controller = UserController(mock_dao)

    result = controller.get_user_by_email("test@example.com")
    captured = capsys.readouterr()

    assert result == fake_user_1
    assert "more than one user found with mail test@example.com" in captured.out
    mock_dao.find.assert_called_once_with({"email": "test@example.com"})


def test_get_user_by_email_raises_value_error_for_invalid_email():
    mock_dao = MagicMock()
    controller = UserController(mock_dao)

    with pytest.raises(ValueError, match="invalid email address"):
        controller.get_user_by_email("invalid-email")


def test_get_user_by_email_no_user_found():
    mock_dao = MagicMock()
    mock_dao.find.return_value = []

    controller = UserController(mock_dao)

    with pytest.raises(IndexError):
        controller.get_user_by_email("missing@example.com")
        