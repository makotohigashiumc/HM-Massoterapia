from unittest.mock import patch, MagicMock
from model import cadastrar_massoterapeuta_offline
import pytest

def test_main():
   
    import builtins
    original_input = builtins.input
    builtins.input = lambda prompt='': 'Diogo'
    try:
        cadastrar_massoterapeuta_offline.main()
    except Exception:
        pytest.fail('main() levantou exceção')
    finally:
        builtins.input = original_input
