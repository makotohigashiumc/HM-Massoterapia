import React, { useState } from "react";

function LoginForm({ login, abrirCadastro, abrirRecuperarSenha }) {

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value.toLowerCase());
  };
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("cliente");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e) => {
  
    e.preventDefault();

    if (!email || !senha) {
      setErrorMessage("Preencha email e senha.");
      return;
    }

  
    setLoading(true);

    const endpoint =
      tipo === "cliente"
  ? "/clientes/login"    
  : "/massoterapeuta/login"; 

    try {
    
  const resp = await fetch(import.meta.env.VITE_API_BASE_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ email, senha }), 
      });

      const data = await resp.json();

    
      if (resp.ok) {
      
        const token = data.token || data.usuario?.token;
         
        if (!token || token === "undefined") {
          setErrorMessage("Token inválido recebido do backend.");
          return;
        }
        
        localStorage.setItem("token", token);

    
        setErrorMessage("");

    
        login({ tipo, usuario: data.usuario, token });
      } else {
      
        const msg = data.erro || "Email ou senha inválidos.";
        setModalTitle("Erro ao efetuar o login");
        setModalMessage(msg);
        setModalVisible(true);
       
        setErrorMessage(msg);
      }
    } catch (err) {
  
      console.error(err);
      const msg = "Erro ao tentar logar. Verifique sua conexão.";
      setModalTitle("Erro de conexão");
      setModalMessage(msg);
      setModalVisible(true);
      setErrorMessage(msg);
    } finally {
  
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
  
      <form onSubmit={handleSubmit}>

        <h2>Login</h2>

        {errorMessage && (
          <div style={{
            backgroundColor: '#fdecea',
            color: '#b71c1c',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '12px',
            border: '1px solid #f5c6cb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }} role="alert">
            <span>{errorMessage}</span>
            <button type="button" onClick={() => setErrorMessage("")} style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#b71c1c',
              fontWeight: 'bold'
            }}>X</button>
          </div>
        )}

        <label>
          Tipo de usuário:
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="cliente">Cliente</option>
            <option value="massoterapeuta">Massoterapeuta</option>
          </select>
        </label>

     
        <label style={{ display: 'block' }}>
          Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            required
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s',
              padding: '8px 10px'
            }}
            onFocus={e => e.target.style.borderColor = '#1976d2'}
            onBlur={e => e.target.style.borderColor = '#ccc'}
          />
        </label>

        <label style={{ position: 'relative', display: 'block' }}>
          Senha:
          <div style={{ position: 'relative' }}>
          
            <input
              type={mostrarSenha ? "text" : "password"} 
              value={senha}
              onChange={(e) => setSenha(e.target.value)} 
              required
              style={{ 
                paddingRight: '38px', 
                width: '100%', 
                borderRadius: '8px', 
                border: '1px solid #ccc', 
                fontSize: '1rem', 
                boxSizing: 'border-box', 
                outline: 'none', 
                transition: 'border-color 0.2s' 
              }}
              
              onFocus={e => e.target.style.borderColor = '#1976d2'}
              onBlur={e => e.target.style.borderColor = '#ccc'}
            />
           
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)} 
              style={{ 
                position: 'absolute', 
                right: 8, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: 18, 
                color: '#888', 
                padding: 0 
              }}
              tabIndex={-1} 
              aria-label={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'} 
            >
              
              {mostrarSenha ? '🙈' : '👁️'}
            </button>
          </div>
        </label>
        
     
        <a
          href="#"
          className="forgot-password"
          onClick={e => { 
            e.preventDefault(); 
            abrirRecuperarSenha(); 
          }}
        >
          Esqueceu a senha?
        </a>
        
   
        <button type="submit" disabled={loading}>
      
          {loading ? "Entrando..." : "Entrar"}
        </button>
        
   
        <div style={{ marginTop: "18px", textAlign: "center" }}>
          <span>Não tem uma conta?</span>
       
          <button
            type="button"
            className="criar-conta-btn"
            onClick={abrirCadastro} 
            style={{ marginLeft: "8px" }}
          >
            Crie a sua conta
          </button>
        </div>
      </form>

      {modalVisible && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.35)',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setModalVisible(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '420px',
              maxWidth: '100%',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 6px 22px rgba(0,0,0,0.25)',
              padding: '22px',
              textAlign: 'center'
            }}
          >
            <h3 style={{ marginTop: 0, color: '#0b6b8a' }}>{modalTitle || 'Aviso'}</h3>
            <p style={{ color: '#333', lineHeight: 1.4 }}>{modalMessage}</p>
            <div style={{ marginTop: 18 }}>
              <button
                onClick={() => setModalVisible(false)}
                style={{
                  background: '#0b6b8a',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default LoginForm;