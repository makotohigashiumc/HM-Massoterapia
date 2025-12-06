import React, { useState, useEffect, useCallback } from "react";
import DatePicker, { registerLocale } from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import ptBR from "date-fns/locale/pt-BR"; 
import "./Agendamentos.css";


registerLocale("pt-BR", ptBR);

function AgendamentosCliente({ usuario, token }) {
  
  const gerarHorariosDiaSelecionado = () => {
   
    if (!dataHora) return [];

    const horarios = [];
    const base = new Date(dataHora); 
    base.setHours(8, 0, 0, 0); 

    const agora = new Date(); 
    const tempoMinimo = new Date(agora.getTime() + 30 * 60000); 

    const horariosPermitidos = [8, 9, 10, 11, 15, 16, 17, 18];
    for (let h of horariosPermitidos) {
      const horario = new Date(base);
      horario.setHours(h, 0, 0, 0);

      const ocupado = horariosOcupados.some((ho) =>
        ho.getFullYear() === horario.getFullYear() &&
        ho.getMonth() === horario.getMonth() &&
        ho.getDate() === horario.getDate() &&
        ho.getHours() === horario.getHours() &&
        ho.getMinutes() === horario.getMinutes()
      );
 
      const horarioIndisponivel = horario < tempoMinimo;

      horarios.push({ horario, ocupado: ocupado || horarioIndisponivel });
    }
    return horarios; 
  };
  
  const authToken = token || usuario?.token || localStorage.getItem("token");
  
  // ================================
  // DECLARAÇÃO DOS ESTADOS
  // ================================
  const [dataHora, setDataHora] = useState(null);              
  const [historico, setHistorico] = useState([]);             
  const [massoterapeutas, setMassoterapeutas] = useState([]);  
  const [massoterapeutaSelecionado, setMassoterapeutaSelecionado] = useState(""); 
  const [horariosOcupados, setHorariosOcupados] = useState([]); 
  const [forceUpdate, setForceUpdate] = useState(0);           
  const [horarioAtual, setHorarioAtual] = useState(new Date()); 
  const [sintomas, setSintomas] = useState("");               
  const [modalAguardando, setModalAguardando] = useState({ aberto: false });
  
  // ================================
  // EFEITOS (useEffect)
  // ================================
  

  useEffect(() => {
    const interval = setInterval(() => {
      setHorarioAtual(new Date());     
      setForceUpdate(prev => prev + 1); 
    }, 60000); 
    
    return () => clearInterval(interval);
  }, []);
  

  const fetchHorariosOcupados = useCallback(async (data) => {
   
    if (!massoterapeutaSelecionado) return setHorariosOcupados([]);
    
    try {
    
  const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/massoterapeuta/horarios_ocupados/${massoterapeutaSelecionado}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (resp.ok) {
        const data = await resp.json();
        
      
        setHorariosOcupados(
          data.map((h) => new Date(h.data_hora))
        );
      } else {
   
        setHorariosOcupados([]);
      }
    } catch {
    
      setHorariosOcupados([]);
    }
  }, [massoterapeutaSelecionado, authToken]); 

  
  useEffect(() => {
    fetchHorariosOcupados();
  }, [massoterapeutaSelecionado, fetchHorariosOcupados]);

  // -------------------------------
  // Buscar histórico de agendamentos do cliente
  // -------------------------------
  useEffect(() => {
    if (!authToken) {
      alert("Sessão expirada. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.reload();
      return;
    }

    const fetchHistorico = async () => {
      try {
  const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/clientes/agendamentos", {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (resp.ok) {
          const data = await resp.json();
          setHistorico(data);
        } else {
          setHistorico([]);
        }
      } catch (err) {
        setHistorico([]);
      }
    };

    fetchHistorico();
  }, [authToken]);

  // -------------------------------
  // Buscar lista de massoterapeutas
  // -------------------------------
  useEffect(() => {
    const fetchMassoterapeutas = async () => {
      try {
  const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/massoterapeuta/lista");
        if (resp.ok) {
          const data = await resp.json();
          setMassoterapeutas(data);
          if (data.length > 0) setMassoterapeutaSelecionado(data[0].id);
        }
      } catch (err) {}
    };

    fetchMassoterapeutas();
  }, []);

  async function limparHistorico() {
    if (!window.confirm("Tem certeza que deseja limpar todo o histórico de agendamentos?")) return;
    try {
  const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/clientes/agendamentos/limpar", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (resp.ok) {
        alert("Histórico limpo com sucesso!");
        setHistorico([]);
      } else {
        alert("Erro ao limpar histórico.");
      }
    } catch (err) {
      alert("Erro ao limpar histórico.");
    }
  }

  // -------------------------------
  // Criar novo agendamento
  // -------------------------------
  const criarAgendamento = async () => {
    if (!authToken) return alert("Você precisa estar logado para agendar.");
    if (!dataHora) return alert("Escolha data e hora");
    if (!massoterapeutaSelecionado) return alert("Escolha um massoterapeuta");
 
    const agora = new Date();
    const tempoMinimo = new Date(agora.getTime() + 30 * 60000); 
    
    if (dataHora < agora) {
      alert("Não é possível agendar para horários passados.");
      return;
    }
    
    if (dataHora < tempoMinimo) {
      alert("Por favor, agende com pelo menos 30 minutos de antecedência.");
      return;
    }

  const pad = n => n.toString().padStart(2, '0');
  const dataHoraLocal = `${dataHora.getFullYear()}-${pad(dataHora.getMonth()+1)}-${pad(dataHora.getDate())}T${pad(dataHora.getHours())}:${pad(dataHora.getMinutes())}:00`;

    try {
      const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/clientes/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          massoterapeuta_id: massoterapeutaSelecionado,
          data_hora: dataHoraLocal,
          sintomas: sintomas.trim() || null,
        }),
      });

      if (resp.ok) {
      
        setModalAguardando({ aberto: true });
        setDataHora("");
        setSintomas("");


  const historicoResp = await fetch(import.meta.env.VITE_API_BASE_URL + "/clientes/agendamentos", {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (historicoResp.ok) {
          const data = await historicoResp.json();
          setHistorico(data);
        }
      } else {
        const err = await resp.json();
        alert(err.erro || "Erro ao criar agendamento.");
      }
    } catch (err) {
      alert("Erro ao criar agendamento.");
    }
  };

  const [modalCancelamento, setModalCancelamento] = useState({ aberto: false, agendamentoId: null });
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  function abrirModalCancelamento(id) {
    setModalCancelamento({ aberto: true, agendamentoId: id });
    setMotivoCancelamento("");
  }

  function fecharModalCancelamento() {
    setModalCancelamento({ aberto: false, agendamentoId: null });
    setMotivoCancelamento("");
  }

  async function cancelarAgendamentoComMotivo() {
    const id = modalCancelamento.agendamentoId;
    const authToken = token || usuario?.token || localStorage.getItem("token");
    if (!motivoCancelamento.trim()) {
      alert("Por favor, escreva o motivo do cancelamento.");
      return;
    }
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clientes/agendamentos/${id}/cancelar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ motivo: motivoCancelamento })
      });
      if (resp.ok) {
        alert("Agendamento cancelado com sucesso!");
        fecharModalCancelamento();
 
        const historicoResp = await fetch(import.meta.env.VITE_API_BASE_URL + "/clientes/agendamentos", {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (historicoResp.ok) {
          const data = await historicoResp.json();
          setHistorico(data);
        }
      } else {
        alert("Erro ao cancelar agendamento.");
      }
    } catch (err) {
      alert("Erro ao cancelar agendamento.");
    }
  }

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
        window.location.reload();
      } else {
        alert("Erro ao excluir conta.");
      }
    } catch (err) {
      alert("Erro ao excluir conta.");
    }
  }

  return (
    <div className="agendamentos-container">
      <h2>Agendar Consulta</h2>
      
      <div style={{ 
        textAlign: 'right', 
        marginBottom: '15px', 
        fontSize: '14px', 
        color: '#666',
        fontWeight: 'bold'
      }}>
        🕐 Horário atual: {horarioAtual.toLocaleString('pt-BR')}
      </div>
      <div className="agendamento-form">
        <div className="form-row">
          <label className="form-label" htmlFor="massoterapeuta">Massoterapeuta</label>
          <div className="form-field">
            <select
              id="massoterapeuta"
              className="input-select"
              value={massoterapeutaSelecionado}
              onChange={(e) => setMassoterapeutaSelecionado(e.target.value)}
            >
              {massoterapeutas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="data">Data</label>
          <div className="form-field">
            <DatePicker
              id="data"
              className="input"
              selected={dataHora}
              onChange={(date) => {
                setDataHora(date);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione a data"
              minDate={new Date()}
              locale="pt-BR"
              showWeekNumbers={false}
              firstDayOfWeek={1} 
              calendarStartDay={1} 
              filterDate={(date) => {
                const today = new Date();
                today.setHours(0,0,0,0);
                const d = new Date(date);
                d.setHours(0,0,0,0);
                const day = d.getDay(); 
                return d >= today && day >= 1 && day <= 4;
              }}
              dayClassName={(date) => {
                const today = new Date();
                today.setHours(0,0,0,0);
                const d = new Date(date);
                d.setHours(0,0,0,0);
                const day = d.getDay(); 
                if (d < today) return "dia-semana bloqueado";
                if (day === 0) return "dia-semana bloqueado"; 
                if (day === 1) return "dia-semana segunda";
                if (day === 2) return "dia-semana terca";
                if (day === 3) return "dia-semana quarta";
                if (day === 4) return "dia-semana quinta";
                if (day === 5) return "dia-semana bloqueado"; 
                if (day === 6) return "dia-semana bloqueado"; 
                return "dia-semana bloqueado";
              }}
              renderCustomHeader={({ monthDate, decreaseMonth, increaseMonth }) => (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <button type="button" onClick={decreaseMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }} aria-label="Mês anterior">
                    ◀️
                  </button>
                  <span style={{ fontWeight: 'bold', fontSize: 16 }}>
                    {monthDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                  <button type="button" onClick={increaseMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }} aria-label="Próximo mês">
                    ▶️
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
      {dataHora && (
        <div style={{ margin: '16px 0' }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Horários disponíveis:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {gerarHorariosDiaSelecionado().map(({ horario, ocupado }) => (
              <button
                key={`${horario.toISOString()}-${forceUpdate}`}
                type="button"
                disabled={ocupado}
                style={{
                  background: ocupado
                    ? '#ccc'
                    : (dataHora && horario.getTime() === dataHora.getTime()
                        ? '#90caf9' 
                        : '#e0f0ff'),
                  color: ocupado ? '#888' : '#1976d2',
                  border: ocupado ? '1px solid #bbb' : '1px solid #1976d2',
                  borderRadius: 6,
                  padding: '6px 14px',
                  cursor: ocupado ? 'not-allowed' : 'pointer',
                  fontWeight: ocupado ? 'normal' : 'bold',
                  opacity: ocupado ? 0.6 : 1,
                }}
                onClick={() => {
                  if (!ocupado) {
                    setDataHora(horario);
                  }
                }}
              >
                {horario.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}
              </button>
            ))}
          </div>
          {gerarHorariosDiaSelecionado().some(h => !h.ocupado) && (
            <div style={{ marginTop: '8px', color: '#555', fontSize: '0.95em' }}>
              * É necessário agendar com pelo menos 30 minutos de antecedência da consulta.
            </div>
          )}
        </div>
      )}
    
      {modalAguardando.aberto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 280, boxShadow: '0 2px 12px #0002', textAlign: 'center' }}>
            <h3>Aguardando confirmação da clínica</h3>
            <p style={{ marginTop: 8, color: '#444' }}>Seu agendamento foi solicitado com sucesso. Aguarde a confirmação pela clínica.</p>
            <div style={{ marginTop: 16 }}>
              <button onClick={() => setModalAguardando({ aberto: false })} style={{ padding: '8px 16px', borderRadius: 6 }}>Fechar</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="agendamento-form">
        <div className="form-row align-start">
          <label className="form-label" htmlFor="sintomas">Sintomas (opcional)</label>
          <div className="form-field">
            <textarea
              id="sintomas"
              className="textarea"
              value={sintomas}
              onChange={(e) => setSintomas(e.target.value)}
              placeholder="Descreva brevemente os sintomas que está sentindo, dores, desconfortos, etc."
              maxLength={500}
            />
            <div className="char-counter">
              {sintomas.length}/500 caracteres
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button className="primary" onClick={criarAgendamento} disabled={!dataHora || (dataHora.getHours() === 0 && dataHora.getMinutes() === 0)}>Agendar</button>
        </div>
      </div>

  <h3>Histórico de Agendamentos</h3>
  <button onClick={limparHistorico} style={{marginBottom: '10px'}}>Limpar Histórico</button>
      <ul>
        {historico.length === 0 && <li>Nenhum agendamento encontrado</li>}
        {historico.map((a) => (
          <li key={a.id}>
            <div>
              <strong>{formatarDataHora(a.data_hora)}</strong> - {traduzirStatus(a.status)} - Massoterapeuta: {a.massoterapeuta_nome || "Não informado"}
              {(a.status === 'marcado' || a.status === 'pendente' || a.status === 'confirmado') && (
                <button onClick={() => abrirModalCancelamento(a.id)} style={{marginLeft: '12px'}}>Cancelar</button>
              )}
            </div>
            {a.sintomas && (
              <div style={{ marginTop: '4px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                <strong>Sintomas:</strong> {a.sintomas}
              </div>
            )}
          </li>
        ))}
   
      {modalCancelamento.aberto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 12px #0002' }}>
            <h3>Cancelar agendamento</h3>
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="motivoCancelamento" style={{ fontWeight: 'bold' }}>Motivo do cancelamento:</label>
              <textarea
                id="motivoCancelamento"
                value={motivoCancelamento}
                onChange={e => setMotivoCancelamento(e.target.value)}
                placeholder="Descreva o motivo do cancelamento..."
                style={{ width: '100%', minHeight: 60, marginTop: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                maxLength={500}
              />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{motivoCancelamento.length}/500 caracteres</div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={fecharModalCancelamento}>Voltar</button>
              <button onClick={cancelarAgendamentoComMotivo} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Confirmar Cancelamento</button>
            </div>
          </div>
        </div>
      )}
      </ul>
    </div>
  );
}
export default AgendamentosCliente;


function formatarDataHora(dataHoraStr) {
  if (!dataHoraStr) return "";
 
  const d = new Date(dataHoraStr);
  if (isNaN(d.getTime())) return "Data inválida";
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}


function traduzirStatus(status) {
  switch (status) {
    case 'pendente': return 'Aguardando confirmação da clínica';
    case 'confirmado': return 'Confirmado';
    case 'cancelado': return 'Cancelado';
    case 'marcado': return 'Marcado';
    case 'concluido': return 'Concluído';
    default: return status ? status.charAt(0).toUpperCase() + status.slice(1) : "";
  }
}