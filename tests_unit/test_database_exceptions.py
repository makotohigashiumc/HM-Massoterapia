import pytest
from unittest.mock import patch, MagicMock
import database

def test_get_connection_exception():
    with patch('database.os.getenv', side_effect=Exception('Env error')):
        result = database.get_connection()
        assert result is None

def test_test_connection_exception():
    with patch('database.get_connection', side_effect=Exception('DB error')):
        with pytest.raises(Exception):
            database.test_connection()
