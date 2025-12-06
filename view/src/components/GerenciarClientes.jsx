import React, { useState, useEffect } from "react";

function GerenciarClientes({ usuario, token }) {
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState("");


  const clientesFiltrados = clientes.filter(cliente => {
    const termo = termoPesquisa.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.email.toLowerCase().includes(termo) ||
      cliente.telefone.toLowerCase().includes(termo)
    );
  });


  const buscarClientes = async () => {
    setLoadingClientes(true);
    try {
  const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/massoterapeuta/clientes", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.ok) {
        const data = await resp.json();
        setClientes(data);
      } else {
        alert("Erro ao carregar lista de clientes.");
        setClientes([]);
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar lista de clientes.");
      setClientes([]);
    } finally {
      setLoadingClientes(false);
    }
  };

  
  const excluirCliente = async (clienteId, clienteNome) => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente a conta do cliente "${clienteNome}"?\n\nEsta ação é irreversível e removerá todos os dados do cliente do sistema.`)) {
      return;
    }

    try {
  const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/massoterapeuta/clientes/${clienteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.ok) {
        alert(`Cliente "${clienteNome}" excluído com sucesso!`);

        setClientes(clientes.filter(c => c.id !== clienteId));
      } else {
        const err = await resp.json();
        alert(err.erro || "Erro ao excluir cliente.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir cliente.");
    }
  };

  const destacarTexto = (texto, termo) => {
    if (!termo) return texto;
    
    const regex = new RegExp(`(${termo})`, 'gi');
    const partes = texto.split(regex);
    
    return partes.map((parte, index) =>
      regex.test(parte) ? (
        <span key={index} style={{ backgroundColor: '#fff176', fontWeight: 'bold' }}>
          {parte}
        </span>
      ) : (
        parte
      )
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('pesquisa-clientes');
        searchInput?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    buscarClientes();
  }, []);

  return (
    <div className="form-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>👥 Gerenciar Clientes</h2>
        
        <p style={{ 
          color: '#666', 
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '20px',
          fontStyle: 'italic'
        }}>
          Gerencie as contas dos clientes da clínica HM Massoterapia
        </p>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={buscarClientes}
            disabled={loadingClientes}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: loadingClientes ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 'bold',
              opacity: loadingClientes ? 0.7 : 1
            }}
          >
            {loadingClientes ? '🔄 Carregando...' : '🔄 Atualizar Lista'}
          </button>
        </div>

        {loadingClientes ? (
          <div style={{ textAlign: 'center', color: '#4caf50', padding: '40px' }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>⏳</div>
            Carregando clientes...
          </div>
        ) : (
          <>
            {clientes.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '15px', 
                  fontWeight: 'bold',
                  color: '#4caf50'
                }}>
                  🔍 Pesquisar Cliente:
                </label>
                <input
                  id="pesquisa-clientes"
                  type="text"
                  placeholder="Digite nome, email ou telefone... (Ctrl+F para focar, ESC para limpar)"
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setTermoPesquisa("");
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #c8e6c9',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4caf50'}
                  onBlur={(e) => e.target.style.borderColor = '#c8e6c9'}
                />
                {termoPesquisa && (
                  <div style={{
                    fontSize: '13px',
                    color: '#388e3c',
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    {clientesFiltrados.length} cliente(s) encontrado(s)
                    <button
                      type="button"
                      onClick={() => setTermoPesquisa("")}
                      style={{
                        marginLeft: '15px',
                        background: 'none',
                        border: 'none',
                        color: '#4caf50',
                        cursor: 'pointer',
                        fontSize: '13px',
                        textDecoration: 'underline',
                        fontWeight: 'bold'
                      }}
                    >
                      ✖ Limpar
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {clientes.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#666',
                padding: '40px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>👤</div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Nenhum cliente cadastrado</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Quando houver clientes cadastrados, eles aparecerão aqui.
                </p>
              </div>
            ) : clientesFiltrados.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#666',
                padding: '40px',
                backgroundColor: '#fff3e0',
                borderRadius: '8px',
                border: '1px solid #ffcc02'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
                <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Nenhum resultado encontrado</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Nenhum cliente corresponde à pesquisa "{termoPesquisa}"
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  fontSize: '14px',
                  color: '#4caf50',
                  marginBottom: '15px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: '10px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '6px'
                }}>
                  📊 Exibindo {clientesFiltrados.length} de {clientes.length} cliente(s)
                </div>
                
                <div style={{ 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa'
                }}>
                  {clientesFiltrados.map((cliente, index) => (
                    <div 
                      key={cliente.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        marginBottom: index === clientesFiltrados.length - 1 ? 0 : '1px',
                        backgroundColor: '#fff',
                        borderBottom: index === clientesFiltrados.length - 1 ? 'none' : '1px solid #f0f0f0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 'bold', 
                          color: '#333',
                          fontSize: '16px',
                          marginBottom: '5px'
                        }}>
                          👤 {destacarTexto(cliente.nome, termoPesquisa)}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '3px' }}>
                          📧 {destacarTexto(cliente.email, termoPesquisa)}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          📞 {destacarTexto(cliente.telefone, termoPesquisa)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => excluirCliente(cliente.id, cliente.nome)}
                        style={{
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          marginLeft: '15px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#c62828'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
                        title={`Excluir conta de ${cliente.nome}`}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
        
        <div style={{ 
          marginTop: '25px',
          padding: '15px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          border: '1px solid #ffcdd2'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#c62828',
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            <strong>⚠️ Aviso Importante:</strong><br />
            A exclusão de clientes é <strong>permanente e irreversível</strong>.<br />
            Todos os agendamentos e dados do cliente serão removidos do sistema.
          </div>
        </div>
      </form>
    </div>
  );
}

export default GerenciarClientes;