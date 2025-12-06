import React, { useState } from "react";

function PerfilCliente({ usuario, token }) {
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(usuario.nome);
  const [telefone, setTelefone] = useState(usuario.telefone);
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    const telefoneSanitizado = telefone ? telefone.replace(/\D/g, "") : "";

    if (!nome.trim() || !telefoneSanitizado.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/clientes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, telefone: telefoneSanitizado, email: usuario.email }),
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

  async function excluirConta() {
    const authToken = token || usuario?.token || localStorage.getItem("token");
    if (!window.confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) return;
    
    try {
  const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/clientes", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (resp.ok) {
        alert("Conta excluída com sucesso!");
        localStorage.removeItem("token");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        alert("Erro ao excluir conta.");
      }
    } catch (err) {
      alert("Erro ao excluir conta.");
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Perfil do Cliente</h2>
        
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
                placeholder="Digite um número de telefone"
                required
              />
            </label>
            
            <label>
              Email:
              <input
                type="email"
                value={usuario.email}
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
                  {usuario.email}
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
          backgroundColor: '#ffebee', 
          borderRadius: '8px',
          border: '1px solid #ffcdd2'
        }}>
          <h4 style={{ 
            color: '#c62828', 
            marginTop: 0,
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            ⚠️ Zona de Perigo
          </h4>
          <p style={{ 
            color: '#666', 
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '15px'
          }}>
            Esta ação é irreversível e excluirá permanentemente sua conta.
          </p>
          <div style={{ textAlign: 'center' }}>
            <button 
              type="button"
              onClick={excluirConta} 
              style={{
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c62828'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
            >
              🗑️ Excluir Conta Permanentemente
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PerfilCliente;
