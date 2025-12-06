import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import OperationalError

load_dotenv()

def get_connection():
   
    try:
       
        DATABASE_URL = os.getenv("DATABASE_URL")
        if not DATABASE_URL:
            print("Erro: DATABASE_URL não encontrada no arquivo .env")
            return None
            
       
        print(f"Tentando conectar ao banco...")
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        print("Conexão estabelecida com sucesso!")
        return conn
        
    except OperationalError as e:
        print(f"Erro de conexão ao banco de dados: {e}")
        
      
        try:
            print("Tentando conectar sem SSL...")
            conn = psycopg2.connect(DATABASE_URL, sslmode='disable')
            print("Conexão estabelecida sem SSL!")
            return conn
        except Exception as e2:
            print(f"Erro mesmo sem SSL: {e2}")
            return None
            
    except Exception as e:
        print(f"Erro geral ao conectar: {e}")
        return None

def test_connection():
    """
    FUNÇÃO DE TESTE: Verifica se a conexão está funcionando
    
    Útil para:
    - Testar configuração do banco
    - Debugar problemas de conexão
    - Verificar se .env está correto
    """

    conn = get_connection()
    if conn:
        print("Conexão ao Supabase bem-sucedida!")
        
        conn.close()
    else:
        print("Falha na conexão ao banco.")

if __name__ == "__main__":
    test_connection()
