import os
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta

load_dotenv()  

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY") 
SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send" 

SENDER_EMAIL = os.getenv("SENDER_EMAIL") 
SENDER_NAME = os.getenv("SENDER_NAME", "Massoterapia TCC") 
EMAIL_SECRET = os.getenv("EMAIL_SECRET", "supersecret")  

ENVIRONMENT = os.getenv("ENV", "prod")
FRONTEND_URL_LOCAL = os.getenv("FRONTEND_URL_LOCAL", "http://localhost:5173")
FRONTEND_URL = os.getenv("FRONTEND_URL_PROD", os.getenv("FRONTEND_URL", "https://hmmassoterapia.com.br"))

def send_email(to_email, subject, content):
    """
    Envia email usando SendGrid (primário) ou Gmail SMTP (fallback)
    
    Parâmetros:
    - to_email: Email do destinatário
    - subject: Assunto do email
    - content: Conteúdo em texto puro
    
    Retorna:
    - Tupla (status_code, response_text)
    """
    if not to_email or not subject or not content:
        return 400, "Parâmetros inválidos para envio de email"

    if SENDGRID_API_KEY and SENDER_EMAIL:
        try:
            headers = {  
                "Authorization": f"Bearer {SENDGRID_API_KEY}",  
                "Content-Type": "application/json"  
            }
            data = {  
                "personalizations": [  
                    {"to": [{"email": to_email}]}  
                ],
                "from": {  
                    "email": SENDER_EMAIL,  
                    "name": SENDER_NAME  
                },
                "subject": subject, 
                "content": [ 
                    {"type": "text/plain", "value": content}  
                ]
            }
            response = requests.post(SENDGRID_URL, json=data, headers=headers, timeout=15) 
            if response.status_code == 202:  
                return 202, "Email enviado via SendGrid"
            else:
            
                log_body = response.text if ENVIRONMENT == "local" else "<oculto>"
                print(f"[EMAIL][SendGrid] Falha: status={response.status_code} body={log_body}")
        except Exception as e:
            print(f"[EMAIL][SendGrid] Erro: {str(e)}")
    

    missing = []
    if not SENDGRID_API_KEY:
        missing.append("SENDGRID_API_KEY")
    if not SENDER_EMAIL:
        missing.append("SENDER_EMAIL")
    msg = "Falha no envio: SendGrid e Gmail SMTP indisponíveis"
    if missing:
        msg += f" (faltando: {', '.join(missing)})"
    return 500, msg

def generate_confirmation_token(email):
    """
    Gera token JWT para confirmação de email ou recuperação de senha
    
    Parâmetros:
    - email: Email do usuário
    
    Retorna:
    - Token JWT válido por 24 horas
    """
    payload = { 
        "email": email, 
        "exp": datetime.utcnow() + timedelta(hours=24)  
    }
    token = jwt.encode(payload, EMAIL_SECRET, algorithm="HS256")  
    return token

def verify_confirmation_token(token):
    """
    Verifica se token JWT é válido e não expirou
    
    Parâmetros:
    - token: Token JWT a ser verificado
    
    Retorna:
    - Email do usuário se válido, None se inválido/expirado
    """
    try:  
        payload = jwt.decode(token, EMAIL_SECRET, algorithms=["HS256"]) 
        return payload["email"]  
    except jwt.ExpiredSignatureError: 
        return None 
    except jwt.InvalidTokenError:  
        return None 

def send_confirmation_email(to_email):
    """
    Envia email de confirmação para ativação de conta
    
    Parâmetros:
    - to_email: Email do destinatário
    
    Retorna:
    - Tupla (status_code, response_text) do envio
    """
    token = generate_confirmation_token(to_email)  
    frontend_url = FRONTEND_URL_LOCAL if ENVIRONMENT == "local" else FRONTEND_URL
    confirm_url = f"{frontend_url.rstrip('/')}/confirmar-email/{token}"
    subject = "Confirme seu e-mail"  
    content = f"Olá! Clique no link para confirmar seu e-mail: {confirm_url}\nEste link expira em 24 horas."  
    return send_email(to_email, subject, content)  

def sendgrid_email_api_massoterapia(destinatario, assunto, conteudo):
    """
    Função legada para compatibilidade com código existente
    Simplesmente chama a função send_email com novos nomes
    """
    headers = {  
        "Authorization": f"Bearer {SENDGRID_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {  
        "personalizations": [
            {"to": [{"email": destinatario}]}
        ],
        "from": {
            "email": SENDER_EMAIL,
            "name": SENDER_NAME
        },
        "subject": assunto,
        "content": [
            {"type": "text/plain", "value": conteudo}
        ]
    }
    response = requests.post("https://api.sendgrid.com/v3/mail/send", headers=headers, json=data)  
    print(f"Status: {response.status_code}")  
    print(f"Resposta: {response.text}") 
    return response.status_code, response.text  
