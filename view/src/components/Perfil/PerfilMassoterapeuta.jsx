import React, { useState } from "react";

function PerfilMassoterapeuta({ usuario, token }) {
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(usuario.nome);
  const [telefone, setTelefone] = useState(usuario.telefone);
  const [email, setEmail] = useState(usuario.email);
  const [loading, setLoading] = useState(false);

  const salvar = async () => {

    const telefoneSanitizado = telefone ? telefone.replace(/\D/g, "") : "";

    if (!nome.trim() || !telefoneSanitizado.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/massoterapeuta/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, telefone: telefoneSanitizado }),
      });

      if (resp.ok) {
        alert("Informações atualizadas com sucesso!");
        setEditando(false);
 
        usuario.nome = nome;
        usuario.telefone = telefoneSanitizado;
      } else {
        const err = await resp.json();
        alert(err.erro || "Erro ao atualizar informações.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar informações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Perfil do Massoterapeuta</h2>
        
        {editando ? (
          <>
            <label>
              Nome:
              <input 
                type="text"
                value={nome} 
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </label>
            
            <label>
              Telefone:
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))}
                placeholder="Somente números"
                required
              />
            </label>
            
            <label>
              Email:
              <input
                type="email"
                value={email}
                disabled
                style={{ 
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  cursor: 'not-allowed'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                O email não pode ser alterado
              </small>
            </label>
            
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button 
                type="button" 
                onClick={salvar} 
                disabled={loading}
                style={{ backgroundColor: '#107594' }}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setEditando(false);
                  setNome(usuario.nome);
                  setTelefone(usuario.telefone);
                }}
                style={{ backgroundColor: '#666' }}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '15px' }}>
                Nome:
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '15px',
                  marginTop: '5px'
                }}>
                  {nome}
                </div>
              </label>
              
              <label style={{ display: 'block', marginBottom: '15px' }}>
                Telefone:
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '15px',
                  marginTop: '5px'
                }}>
                  {telefone}
                </div>
              </label>
              
              <label style={{ display: 'block', marginBottom: '15px' }}>
                Email:
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '15px',
                  marginTop: '5px'
                }}>
                  {email}
                </div>
              </label>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={() => setEditando(true)}
                style={{ 
                  backgroundColor: '#107594',
                  marginBottom: '15px'
                }}
              >
                ✏️ Editar Informações
              </button>
            </div>
          </>
        )}
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px',
          border: '1px solid #c8e6c9'
        }}>
          <h4 style={{ 
            color: '#388e3c', 
            marginTop: 0,
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            👨‍⚕️ Informações Profissionais
          </h4>
          <div style={{ 
            color: '#2e7d32', 
            fontSize: '14px',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Função:</strong> Massoterapeuta
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Status:</strong> Ativo
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Especialidade:</strong> Massoterapia Clínica
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PerfilMassoterapeuta;
