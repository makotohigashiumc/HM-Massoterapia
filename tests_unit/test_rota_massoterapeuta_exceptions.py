from unittest.mock import patch, MagicMock
from controller import rota_massoterapeuta

def test_login_massoterapeuta_exception():
    import app
    with app.app.test_request_context(json={"email": "email@x.com", "senha": "123"}):
        with patch('controller.massoterapeuta.verificar_login', side_effect=Exception('Login error')):
            result = rota_massoterapeuta.login_massoterapeuta()
            assert result is not None

def test_get_massoterapeutas_exception():
    import app
    with app.app.test_client() as client:
       
        with patch('controller.rota_massoterapeuta.listar_massoterapeutas', side_effect=Exception('DB error')):
            response = client.get('/api/massoterapeuta/lista')
            assert response.status_code == 500
