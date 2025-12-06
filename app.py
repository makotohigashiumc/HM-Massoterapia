import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended.exceptions import NoAuthorizationError
from dotenv import load_dotenv
import os
from controller.rota_clientes import rota_clientes        
from controller.rota_massoterapeuta import rota_massoterapeuta  
from controller.rota_contato import rota_contato    

env_path = os.path.abspath('.env')
load_dotenv(env_path)


app = Flask(__name__)


@app.route("/")
def index():
    return "API Massoterapia HM rodando!", 200


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["SECRET_KEY"] = JWT_SECRET_KEY


jwt = JWTManager(app)


import os
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app, resources={r"/api/*": {"origins": [
    FRONTEND_URL,
    "http://localhost:5173",
    "https://pfc-frontend-delta.vercel.app",
    "https://hmmassoterapia.com.br",
    "https://www.hmmassoterapia.com.br"
]}})


@app.errorhandler(422)
def handle_422(err):
    return jsonify({"erro": "Erro 422: " + str(err)}), 422

@app.errorhandler(NoAuthorizationError)
def handle_no_auth(err):
    return jsonify({"erro": "Token ausente ou inválido"}), 401


app.register_blueprint(rota_clientes)       
app.register_blueprint(rota_massoterapeuta)  
app.register_blueprint(rota_contato)         


@app.route('/health')
def health_check():
    """Endpoint para verificar se a API está funcionando"""
    return jsonify({
        "status": "healthy",
        "message": "API está funcionando!",
        "version": "1.0"
    })


if __name__ == '__main__':

    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    
    app.run(
        host="0.0.0.0",  
        port=port,
        debug=debug
    )