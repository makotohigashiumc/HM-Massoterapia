import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime, timedelta

@patch("database.get_connection")
def test_cadastrar_cliente_duplicate_email(mock_get_conn):
   
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    
    mock_cursor.fetchone.side_effect = [ (1,), None ]
    mock_conn.cursor.return_value = mock_cursor
    mock_get_conn.return_value = mock_conn

    from model.cliente import cadastrar_cliente
    res = cadastrar_cliente("João", "11999999999", "Masculino", "1990-01-01", "a@b.com", "senha")
    assert isinstance(res, dict) and 'erro' in res


@patch("database.get_connection")
def test_verificar_login_email_not_confirmed(mock_get_conn):

    from werkzeug.security import generate_password_hash
    senha_hash = generate_password_hash('Segredo123')

    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = {'id':1, 'email':'u@x.com', 'senha_hash': senha_hash, 'email_confirmado': False}
    mock_conn.cursor.return_value = mock_cursor
    mock_get_conn.return_value = mock_conn

    from model.cliente import verificar_login
    user = verificar_login('u@x.com', 'Segredo123')
    assert user is None


def test_cadastrar_agendamento_past_date_returns_none():
   
    from model.cliente import cadastrar_agendamento
    past = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%dT%H:%M")
    res = cadastrar_agendamento(1, 2, past)
    assert res is None

from unittest.mock import MagicMock, patch
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

import os

@patch("database.get_connection")
def test_cadastrar_cliente_duplicate_email(mock_get_conn):

    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.fetchone.side_effect = [ (1,), None ]  
    mock_conn.cursor.return_value = mock_cursor
    mock_get_conn.return_value = mock_conn

    from model.cliente import cadastrar_cliente

    res = cadastrar_cliente("Nome", "11999999999", "Masculino", "1990-01-01", "email@x.com", "Senha!1")
   
    if isinstance(res, dict):
        assert "erro" in res
    else:
        pytest.fail(f"Retorno inesperado: {res}")

@patch("database.get_connection")
def test_cadastrar_cliente_invalid_date(mock_get_conn):
    mock_get_conn.return_value = MagicMock()
    from model.cliente import cadastrar_cliente
  
    res = cadastrar_cliente("Nome", "11999999999", "Masculino", "1990-31-12", "novo@x.com", "Senha!1")
    assert res is None

@patch("database.get_connection")
def test_cadastrar_agendamento_conflict(mock_get_conn):
   
    from unittest.mock import patch, MagicMock
    with patch('model.cliente.get_connection') as mock_cliente_conn:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.side_effect = [ (1,), None, None ]
        mock_conn.cursor.return_value = mock_cursor
        mock_cliente_conn.return_value = mock_conn

        from model.cliente import cadastrar_agendamento
        future = (datetime.now() + timedelta(days=7)).replace(hour=10, minute=0, second=0, microsecond=0)
        future_str = future.strftime("%Y-%m-%dT%H:%M")
        res = cadastrar_agendamento(1, 1, future_str, sintomas="dor")
        assert isinstance(res, dict) and "erro" in res
