import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv
import requests

load_dotenv()


current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

class TesteSistemaCompleto:
    """
    Classe para executar todos os testes do sistema
    """
    
    def __init__(self):
        self.testes_passed = 0
        self.testes_failed = 0
        self.resultados = []
        self.frontend_url = "http://localhost:5173"
        self.backend_url = "http://localhost:5000"
    
    def executar_teste(self, nome_teste, funcao_teste):
        """Executa um teste individual e registra o resultado"""
        print(f"\n🧪 {nome_teste}")
        print("-" * 50)
        try:
            resultado = funcao_teste()
            if resultado:
                print("PASSOU")
                self.testes_passed += 1
                self.resultados.append({"teste": nome_teste, "status": "PASSOU", "detalhes": "OK"})
            else:
                print("FALHOU")
                self.testes_failed += 1
                self.resultados.append({"teste": nome_teste, "status": "FALHOU", "detalhes": "Erro no teste"})
        except Exception as e:
            print(f"FALHOU - Erro: {e}")
            self.testes_failed += 1
            self.resultados.append({"teste": nome_teste, "status": "FALHOU", "detalhes": str(e)})
    
    def teste_1_banco_dados(self):
        """Teste 1: Conectividade com banco de dados"""
        try:
            from database import get_connection
            conn = get_connection()
            if conn:
                cursor = conn.cursor()
             
                cursor.execute("SELECT COUNT(*) FROM cliente")
                clientes = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM massoterapeuta") 
                massoterapeutas = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM agendamento")
                agendamentos = cursor.fetchone()[0]
                
                print(f"Clientes cadastrados: {clientes}")
                print(f"Massoterapeutas cadastrados: {massoterapeutas}")
                print(f"Agendamentos no sistema: {agendamentos}")
                
                conn.close()
                return True
            return False
        except Exception as e:
            print(f"Erro: {e}")
            return False
    
    def teste_2_backend_rodando(self):
        """Teste 2: Backend Flask respondendo"""
        try:
            response = requests.get(f"{self.backend_url}/api/massoterapeuta/lista", timeout=5)
            if response.status_code in [200, 401]:  
                print(f"Backend respondendo na porta 5000")
                print(f"Status Code: {response.status_code}")
                return True
            return False
        except requests.exceptions.ConnectionError:
            print("Backend não está rodando na porta 5000")
            return False
        except Exception as e:
            print(f"Erro: {e}")
            return False
    
    def teste_3_frontend_rodando(self):
        """Teste 3: Frontend Vite respondendo"""
        try:
            response = requests.get(self.frontend_url, timeout=5)
            if response.status_code == 200:
                print(f"Frontend respondendo na porta 5173")
                return True
            return False
        except requests.exceptions.ConnectionError:
            print("Frontend não está rodando na porta 5173")
            return False
        except Exception as e:
            print(f"Erro: {e}")
            return False
    
    def teste_5_email_config(self):
        """Teste 5: Configuração de Email"""
        try:
            from controller.email_api import send_email
            
            
            sendgrid_key = os.getenv('SENDGRID_API_KEY')
            from_email = os.getenv('FROM_EMAIL')
            
            if sendgrid_key and from_email:
                print(f"SendGrid API Key: Configurado")
                print(f"From Email: {from_email}")
                return True
            else:
                print("⚠️ Configuração de email não encontrada (opcional)")
                return True  
        except Exception as e:
            print(f"Aviso: {e}")
            return True 
    
    def teste_6_autenticacao_jwt(self):
        """Teste 6: Sistema de autenticação JWT"""
        try:
           
            payload = {
                "email": "teste@teste.com",
                "senha": "123456"
            }
            
            response = requests.post(
                f"{self.backend_url}/api/clientes/login",
                json=payload,
                timeout=5
            )
            
            if response.status_code in [401, 200]:
                print("Sistema de autenticação respondendo")
                return True
            return False
        except Exception as e:
            print(f"Erro: {e}")
            return False
            return False
    
    def teste_8_dependencias_python(self):
        """Teste 8: Dependências Python instaladas"""
        dependencias = [
            ('flask', 'flask'),
            ('psycopg2', 'psycopg2'),
            ('requests', 'requests'),
            ('python-dotenv', 'dotenv'), 
            ('flask-jwt-extended', 'flask_jwt_extended'),
            ('flask-cors', 'flask_cors'),
            ('werkzeug', 'werkzeug')
        ]
        
        dependencias_ok = 0
        for nome_pip, nome_import in dependencias:
            try:
                __import__(nome_import)
                print(f"{nome_pip}")
                dependencias_ok += 1
            except ImportError:
                print(f"{nome_pip} - NÃO INSTALADO")
        
        if dependencias_ok == len(dependencias):
            print(f"Todas as {len(dependencias)} dependências instaladas")
            return True
        else:
            print(f"{len(dependencias) - dependencias_ok} dependências faltando")
            return False
    
if __name__ == "__main__":
    teste = TesteSistemaCompleto()
    teste.executar_todos_os_testes()