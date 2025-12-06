 const ModalSucesso = ({ onClose }) => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#fff',
        padding: '32px 24px',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
        textAlign: 'center',
        minWidth: '320px',
        maxWidth: '90vw',
        position: 'relative'
      }}>
        <h3 style={{ color: '#00796b', marginBottom: '16px' }}>Cadastro realizado!</h3>
        <p style={{ marginBottom: '24px', color: '#333', fontSize: '1.1em' }}>
          Por favor, confirme seu e-mail antes de acessar o sistema.<br />
          Você receberá um e-mail para ativar sua conta.
        </p>
        <button onClick={onClose} style={{
          background: '#00796b',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 24px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1em'
        }}>Fechar</button>
      </div>
    </div>
  );

import React, { useState } from "react";

function CadastroForm({ voltarLogin }) {
 
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  
  const [nome, setNome] = useState("");                    
  const [telefone, setTelefone] = useState("");            
  const handleTelefoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    setTelefone(value);
  };
  const [sexo, setSexo] = useState("");                    
  const [sexoCustom, setSexoCustom] = useState("");        
  const [dataNascimento, setDataNascimento] = useState(""); 
  const [email, setEmail] = useState("");                 
  const [senha, setSenha] = useState("");                 
  const [senhaConfirm, setSenhaConfirm] = useState("");    
  const [loading, setLoading] = useState(false);          
  const [sucessoCadastro, setSucessoCadastro] = useState(false); 
  const [aceitouPolitica, setAceitouPolitica] = useState(false); 
  

  const handleSubmit = async (e) => {
  
    e.preventDefault();


 
    if (!aceitouPolitica) {
      alert("Você deve concordar com o Termo de Uso e Política de Privacidade para se cadastrar.");
      return;
    }
   
    if (senha !== senhaConfirm) {
      alert("As senhas não coincidem. Por favor verifique.");
      return;
    }

    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{7,}$/.test(senha);
    if (!senhaForte) {
      alert("A senha deve ter no mínimo 7 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.");
      return;
    }


    if (!["Masculino", "Feminino", "Outro", "Prefiro não informar"].includes(sexo)) {
      alert("Selecione um sexo válido: Masculino, Feminino, Outro ou 'Prefiro não informar'.");
      return; 
    }

    
    if (sexo === "Outro" && (!sexoCustom || sexoCustom.trim() === "")) {
      alert("Por favor, informe o sexo ao selecionar 'Outro'.");
      return;
    }

 
    setLoading(true);

    
    const rawApiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const apiBase = (function (b) {
      const trimmed = b.replace(/\/+$/g, '');
      return trimmed.endsWith('/api') ? trimmed : trimmed + '/api';
    })(rawApiBase);

    try {
      
      const resp = await fetch(`${apiBase}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({
          nome,
          telefone,
          sexo: sexo === "Outro" ? sexoCustom : sexo,
          data_nascimento: dataNascimento, 
          email,
          senha,
        }),
      });

    
      if (resp.ok) {
     
        setNome("");
        setTelefone("");
        setSexo("");
        setSexoCustom("");
        setDataNascimento("");
        setEmail("");
        setSenha("");
        setSenhaConfirm("");
        setSucessoCadastro(true); 
      } else {
       
        let errMsg = `Erro ${resp.status}`;
        try {
          const data = await resp.json();
          if (data && (data.erro || data.message)) {
            errMsg = data.erro || data.message;
          } else {
            errMsg = JSON.stringify(data);
          }
        } catch (e) {
         
          const text = await resp.text();
          if (text) errMsg = text;
        }
        alert(`Erro ao cadastrar: ${errMsg}`);
      }
    } catch (err) {
    
      console.error("Erro no cadastro:", err);
      alert("Erro ao tentar cadastrar. Verifique sua conexão.");
    } finally {
      
      setLoading(false);
    }
  };

  
  return (
    <div className="form-container">
     
      {sucessoCadastro && <ModalSucesso onClose={() => setSucessoCadastro(false)} />}
      <form onSubmit={handleSubmit} className="cadastro-form">
      
        <h2>Cadastro de Cliente</h2>

    
        <label style={{ display: 'block' }}>
          Nome:
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Nome completo"
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

        <label style={{ display: 'block' }}>
          Telefone:
          <input
            type="tel" 
            value={telefone}
            onChange={handleTelefoneChange}
            placeholder="(xx) xxxxx-xxxx"
            required
            maxLength={11}
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

        <label style={{ display: 'block' }}>
          Sexo:
          <select value={sexo} onChange={(e) => setSexo(e.target.value)} required
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s',
              padding: '8px 10px',
              backgroundColor: '#fff'
            }}
            onFocus={e => e.target.style.borderColor = '#1976d2'}
            onBlur={e => e.target.style.borderColor = '#ccc'}
          >
            <option value="">Selecione o sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não informar">Prefiro não informar</option>
          </select>
        </label>

        {sexo === 'Outro' && (
          <label style={{ display: 'block', marginTop: 8 }}>
            Outro (especifique):
            <input
              value={sexoCustom}
              onChange={(e) => setSexoCustom(e.target.value)}
              placeholder="Digite a sua opção sexual"
              required={sexo === 'Outro'}
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
        )}

        <label style={{ display: 'block' }}>
          Data de Nascimento:
          <input
            type="date" 
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
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

        <label style={{ display: 'block' }}>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value.toLowerCase())}
            placeholder="seuemail@exemplo.com"
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
              placeholder="Digite sua senha"
              minLength={7} 
              required
              style={{
                paddingRight: '38px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
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
      
        <label style={{ position: 'relative', display: 'block', marginTop: 8 }}>
          Confirmar Senha:
          <div style={{ position: 'relative' }}>
            <input
              type={mostrarSenha ? "text" : "password"}
              value={senhaConfirm}
              onChange={(e) => setSenhaConfirm(e.target.value)}
              placeholder="Repita sua senha"
              minLength={7}
              required
              style={{
                paddingRight: '38px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
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

        <div style={{ color: '#ff9800', fontSize: '0.92rem', marginTop: '0.2rem', marginBottom: '0.7rem', textAlign: 'left', fontWeight: 500 }}>
          A senha deve ter no mínimo 7 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.
        </div>
     
       
        <button type="submit" disabled={loading}>
      
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

     
        <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 10px 0' }}>
          <input
            type="checkbox"
            id="aceite-politica"
            checked={aceitouPolitica}
            onChange={e => setAceitouPolitica(e.target.checked)}
            required
            style={{ width: 18, height: 18, marginRight: 8 }}
          />
          <label htmlFor="aceite-politica" style={{ fontSize: '1.05em', color: '#222', cursor: 'pointer', userSelect: 'none' }}>
            Li e estou de acordo com o <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>Termo de Uso e Política de Privacidade</a>
          </label>
        </div>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span style={{ color: '#666', fontSize: '0.95rem' }}>Já tem conta?</span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); voltarLogin(); }}
            style={{ marginLeft: 10 }}
          >
            Entrar
          </button>
        </div>
        
      </form>
    </div>
  );
}
export default CadastroForm;
