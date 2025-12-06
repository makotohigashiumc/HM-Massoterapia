import React, { useState, useEffect } from "react";

function AgendamentosMassoterapeuta({ usuario }) {
  const [agendamentosPendentes, setAgendamentosPendentes] = useState([]);
  const [agendamentosConfirmados, setAgendamentosConfirmados] = useState([]);
  const [busca, setBusca] = useState("");
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  
  const [modalCancelamento, setModalCancelamento] = useState({
    aberto: false,
    agendamentoId: null,
    clienteNome: "",
    dataHora: "",
    motivo: "",
    enviando: false
  });

  const token = usuario?.token || localStorage.getItem("token");

  // -------------------------------
  // Buscar agendamentos separados por status
  // -------------------------------
  const fetchAgendamentos = async () => {
    if (!token) {
      console.error("Token não encontrado. Faça login primeiro.");
      return;
    }

    try {
      setLoading(true);
      
      
  const respPendentes = await fetch(import.meta.env.VITE_API_BASE_URL + "/massoterapeuta/agendamentos/pendentes", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

    
  const respConfirmados = await fetch(import.meta.env.VITE_API_BASE_URL + "/massoterapeuta/agendamentos/confirmados", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (respPendentes.ok) {
        const pendentes = await respPendentes.json();
        setAgendamentosPendentes(pendentes);
      }

      if (respConfirmados.ok) {
        const confirmados = await respConfirmados.json();
        setAgendamentosConfirmados(confirmados);
      }

    } catch (err) {
      console.error("Erro ao buscar agendamentos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, [token]);

  // -------------------------------
  // Buscar paciente por nome
  // -------------------------------
  const buscarPaciente = async () => {
    if (!busca.trim()) {
      alert("Digite o nome do paciente para buscar.");
      return;
    }

    try {
      setBuscando(true);
  const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/massoterapeuta/buscar-paciente?nome=${encodeURIComponent(busca)}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.ok) {
        const resultado = await resp.json();
        console.log("Resultado da busca:", resultado); 
        setResultadoBusca(resultado);
      } else {
        const err = await resp.json();
        alert(err.erro || "Erro ao buscar paciente.");
        setResultadoBusca(null);
      }
    } catch (err) {
      console.error("Erro ao buscar paciente", err);
      alert("Erro ao buscar paciente.");
    } finally {
      setBuscando(false);
    }
  };

  // -------------------------------
  // Atualizar status do agendamento
  // -------------------------------
  const atualizarStatus = async (id, novoStatus) => {
    try {
  const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/massoterapeuta/agendamentos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus.toLowerCase() }),
      });

      if (resp.ok) {
        const msg = await resp.json();
        alert(msg.mensagem || "Status atualizado!");
       
        fetchAgendamentos();
      } else {
        const err = await resp.json();
        alert(err.erro || "Erro ao atualizar status.");
      }
    } catch (err) {
      console.error("Erro ao atualizar status", err);
      alert("Erro ao atualizar status.");
    }
  };

  // -------------------------------
  // Funções do Modal de Cancelamento
  // -------------------------------
  const abrirModalCancelamento = (agendamento) => {
    setModalCancelamento({
      aberto: true,
      agendamentoId: agendamento.id,
      clienteNome: agendamento.cliente_nome,
      dataHora: agendamento.data_hora,
      motivo: "",
      enviando: false
    });
  };

  const fecharModalCancelamento = () => {
    setModalCancelamento({
      aberto: false,
      agendamentoId: null,
      clienteNome: "",
      dataHora: "",
      motivo: "",
      enviando: false
    });
  };

  const cancelarComMotivo = async () => {
    if (!modalCancelamento.motivo.trim() || modalCancelamento.motivo.length < 10) {
      alert("O motivo deve ter pelo menos 10 caracteres.");
      return;
    }

    try {
      setModalCancelamento(prev => ({ ...prev, enviando: true }));
      
  const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/massoterapeuta/agendamentos/${modalCancelamento.agendamentoId}/cancelar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo: modalCancelamento.motivo }),
      });

      if (resp.ok) {
        const resultado = await resp.json();
        alert(`${resultado.mensagem}\n${resultado.email_enviado ? '✅ Email enviado ao cliente' : '⚠️ Email não foi enviado'}`);
        
  
        fecharModalCancelamento();
        fetchAgendamentos();
      } else {
        const err = await resp.json();
        alert(err.erro || "Erro ao cancelar agendamento.");
      }
    } catch (err) {
      console.error("Erro ao cancelar agendamento", err);
      alert("Erro ao cancelar agendamento.");
    } finally {
      setModalCancelamento(prev => ({ ...prev, enviando: false }));
    }
  };


  // -------------------------------
  // Renderização
  // -------------------------------
  return (
    <div className="agendamentos-massoterapeuta-container">
      <h2>Painel do Massoterapeuta</h2>

      
      <div className="busca-paciente-section" style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>🔍 Buscar Histórico de Paciente</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Digite o nome do paciente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && buscarPaciente()}
            style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <button 
            onClick={buscarPaciente} 
            disabled={buscando}
            style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
          >
            {buscando ? "Buscando..." : "Buscar"}
          </button>
        </div>

    
        {resultadoBusca && resultadoBusca.total_encontrados > 0 ? (
          <div style={{ marginTop: "20px" }}>
            <h4>🔍 Resultados da Busca: {resultadoBusca.total_encontrados} paciente(s) encontrado(s)</h4>
            
            {resultadoBusca.pacientes.map((paciente) => (
              <div key={paciente.id} style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "4px", border: "1px solid #ddd" }}>
                <h4>� {paciente.nome}</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                  <p><strong>📞 Telefone:</strong> {paciente.telefone}</p>
                  <p><strong>📧 Email:</strong> {paciente.email}</p>
                  <p><strong>� Sexo:</strong> {paciente.sexo}</p>
                  <p><strong>📅 Cliente desde:</strong> {new Date(paciente.cliente_desde).toLocaleDateString()}</p>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "15px", textAlign: "center" }}>
                  <div style={{ padding: "10px", backgroundColor: "#e3f2fd", borderRadius: "4px" }}>
                    <strong>📊 Total de Sessões</strong><br/>
                    <span style={{ fontSize: "1.5em", color: "#1976d2" }}>{paciente.total_sessoes}</span>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#e8f5e8", borderRadius: "4px" }}>
                    <strong>� Sessões Futuras</strong><br/>
                    <span style={{ fontSize: "1.5em", color: "#388e3c" }}>{paciente.sessoes_futuras}</span>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#fce4ec", borderRadius: "4px" }}>
                    <strong>📚 Sessões Passadas</strong><br/>
                    <span style={{ fontSize: "1.5em", color: "#d32f2f" }}>{paciente.sessoes_passadas}</span>
                  </div>
                </div>

             
                {paciente.agendamentos_futuros.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <h5 style={{ color: "#388e3c" }}>🔮 Próximos Agendamentos ({paciente.agendamentos_futuros.length})</h5>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {paciente.agendamentos_futuros.map((ag) => (
                        <div key={ag.id} style={{ padding: "8px", backgroundColor: "#e8f5e8", borderRadius: "4px", border: "1px solid #4caf50" }}>
                          📅 <strong>{new Date(ag.data_hora).toLocaleString()}</strong> - 
                          Status: <span style={{ color: ag.status === 'confirmado' ? 'green' : ag.status === 'pendente' ? 'orange' : 'blue', fontWeight: 'bold' }}>
                            {traduzirStatus(ag.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paciente.agendamentos_passados.length > 0 && (
                  <div>
                    <h5 style={{ color: "#d32f2f" }}>📚 Histórico de Sessões ({paciente.agendamentos_passados.length})</h5>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      <div style={{ display: "grid", gap: "8px" }}>
                        {paciente.agendamentos_passados.map((ag) => (
                          <div key={ag.id} style={{ padding: "8px", backgroundColor: "white", borderRadius: "4px", border: "1px solid #ddd" }}>
                            📅 <strong>{new Date(ag.data_hora).toLocaleString()}</strong> - 
                            Status: <span style={{ 
                              color: ag.status === 'confirmado' ? 'green' : 
                                     ag.status === 'cancelado' ? 'red' : 
                                     ag.status === 'concluido' ? 'blue' : 
                                     ag.status === 'pendente' ? 'orange' : 'gray',
                              fontWeight: 'bold'
                            }}>
                              {traduzirStatus(ag.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {paciente.total_sessoes === 0 && (
                  <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
                    Nenhum agendamento encontrado para este paciente.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : resultadoBusca && resultadoBusca.total_encontrados === 0 ? (
          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff3cd", borderRadius: "4px", border: "1px solid #ffc107" }}>
            <p style={{ margin: 0, textAlign: "center" }}>
              ⚠️ Nenhum paciente encontrado com o nome "<strong>{busca}</strong>"
            </p>
          </div>
        ) : null}
      </div>

      {loading ? (
        <p>Carregando agendamentos...</p>
      ) : (
        <div>

          <div className="agendamentos-pendentes" style={{ marginBottom: "30px" }}>
            <h3>⏳ Agendamentos para Confirmar ({agendamentosPendentes.length})</h3>
            {agendamentosPendentes.length === 0 ? (
              <p style={{ color: "#666" }}>Nenhum agendamento pendente.</p>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {agendamentosPendentes.map((a) => (
                  <div key={a.id} style={{ 
                    padding: "15px", 
                    border: "1px solid #ffc107", 
                    borderRadius: "8px", 
                    backgroundColor: "#fff8dc" 
                  }}>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>👤 Cliente:</strong> {a.cliente_nome || "N/A"} <br />
                      <strong>📅 Data:</strong> {new Date(a.data_hora).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })} <br />
                      <strong>📞 Telefone:</strong> {a.cliente_telefone || "N/A"} <br />
                      <strong>📧 Email:</strong> {a.cliente_email || "N/A"}
                      {a.sintomas && (
                        <>
                          <br />
                          <strong>🌡️ Sintomas:</strong> 
                          <div style={{
                            marginTop: "5px",
                            padding: "8px",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "14px",
                            fontStyle: "italic"
                          }}>
                            {a.sintomas}
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button 
                        onClick={() => atualizarStatus(a.id, "confirmado")}
                        style={{ 
                          padding: "8px 15px", 
                          backgroundColor: "#28a745", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        ✅ Confirmar
                      </button>
                      <button 
                        onClick={() => abrirModalCancelamento(a)}
                        style={{ 
                          padding: "8px 15px", 
                          backgroundColor: "#dc3545", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="agendamentos-confirmados">
            <h3>✅ Agendamentos Confirmados/Concluídos ({agendamentosConfirmados.length})</h3>
            {agendamentosConfirmados.length === 0 ? (
              <p style={{ color: "#666" }}>Nenhum agendamento confirmado.</p>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {agendamentosConfirmados.map((a) => (
                  <div key={a.id} style={{ 
                    padding: "15px", 
                    border: "1px solid #28a745", 
                    borderRadius: "8px", 
                    backgroundColor: "#f8fff8" 
                  }}>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>👤 Cliente:</strong> {a.cliente_nome || "N/A"} <br />
                      <strong>📅 Data:</strong> {new Date(a.data_hora).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })} <br />
                      <strong>📞 Telefone:</strong> {a.cliente_telefone || "N/A"} <br />
                      <strong>📧 Email:</strong> {a.cliente_email || "N/A"} <br />
                      <strong>📊 Status:</strong> <span style={{ 
                        color: a.status === 'confirmado' ? 'green' : a.status === 'concluido' ? 'blue' : 'gray',
                        fontWeight: 'bold' 
                      }}>{traduzirStatus(a.status)}</span>
                      {a.sintomas && (
                        <>
                          <br />
                          <strong>🌡️ Sintomas:</strong> 
                          <div style={{
                            marginTop: "5px",
                            padding: "8px",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "14px",
                            fontStyle: "italic"
                          }}>
                            {a.sintomas}
                          </div>
                        </>
                      )}
                    </div>
                    {a.status === 'confirmado' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => atualizarStatus(a.id, "concluido")}
                          style={{ 
                            padding: "8px 15px", 
                            backgroundColor: "#007bff", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          🏁 Marcar como Concluído
                        </button>

                      
                        <button
                          onClick={() => abrirModalCancelamento(a)}
                          style={{
                            padding: "8px 15px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {modalCancelamento.aberto && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#dc3545" }}>
              🚫 Cancelar Agendamento
            </h3>
            
            <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
              <p><strong>👤 Cliente:</strong> {modalCancelamento.clienteNome}</p>
              <p><strong>📅 Data/Hora:</strong> {new Date(modalCancelamento.dataHora).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })}</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                📝 Motivo do Cancelamento: <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                value={modalCancelamento.motivo}
                onChange={(e) => setModalCancelamento(prev => ({ ...prev, motivo: e.target.value }))}
                placeholder="Descreva o motivo do cancelamento (mínimo 10 caracteres)..."
                rows="4"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  resize: "vertical",
                  fontFamily: "inherit"
                }}
                disabled={modalCancelamento.enviando}
              />
              <small style={{ color: "#666" }}>
                Caracteres: {modalCancelamento.motivo.length}/10 (mínimo)
              </small>
            </div>

            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "10px",
              borderTop: "1px solid #eee",
              paddingTop: "20px"
            }}>
              <button
                onClick={fecharModalCancelamento}
                disabled={modalCancelamento.enviando}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: modalCancelamento.enviando ? "not-allowed" : "pointer",
                  opacity: modalCancelamento.enviando ? 0.6 : 1
                }}
              >
                ✖️ Fechar
              </button>
              
              <button
                onClick={cancelarComMotivo}
                disabled={modalCancelamento.enviando || modalCancelamento.motivo.length < 10}
                style={{
                  padding: "10px 20px",
                  backgroundColor: modalCancelamento.motivo.length >= 10 ? "#dc3545" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: (modalCancelamento.enviando || modalCancelamento.motivo.length < 10) ? "not-allowed" : "pointer",
                  opacity: (modalCancelamento.enviando || modalCancelamento.motivo.length < 10) ? 0.6 : 1
                }}
              >
                {modalCancelamento.enviando ? "🔄 Cancelando..." : "🚫 Confirmar Cancelamento"}
              </button>
            </div>

            <p style={{ 
              marginTop: "15px", 
              fontSize: "0.9em", 
              color: "#666",
              textAlign: "center"
            }}>
              ⚠️ O cliente será notificado por email sobre o cancelamento
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgendamentosMassoterapeuta;

function traduzirStatus(status) {
  switch (status?.toLowerCase()) {
    case 'pendente': return 'Aguardando confirmação';
    case 'confirmado': return 'Confirmado';
    case 'cancelado': return 'Cancelado';
    case 'marcado': return 'Marcado';
    case 'concluido': return 'Concluído';
    default: return status ? status.charAt(0).toUpperCase() + status.slice(1) : "";
  }
}
