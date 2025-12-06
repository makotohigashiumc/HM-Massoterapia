import React from "react";
import "./PaginaInicial.css";

function PaginaInicial() {

  const handleAgendarClick = () => {
    try {
      const usuarioSalvo = localStorage.getItem("usuario");
      const usuarioObj = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
      if (usuarioObj && usuarioObj.tipo === "cliente") {
    
        window.dispatchEvent(new CustomEvent("mostrarSecao", { detail: "agendamentos" }));
      } else {
   
        window.dispatchEvent(new CustomEvent("mostrarSecao", { detail: "login" }));
      }
    } catch (err) {
  
      window.dispatchEvent(new CustomEvent("mostrarSecao", { detail: "login" }));
    }
  };
  return (
    <div className="pagina-inicial">
  
      <section className="hero-section">
        <div className="hero-content centralizado">
          <h1>Bem-vindo à HM Massoterapia</h1>
          <p className="hero-subtitle">
            Seu bem-estar é nossa prioridade. Oferecemos serviços profissionais de massoterapia. <br />
            Agende agora a sua consulta.
          </p>
          <div className="hero-buttons centralizar-botoes">
            <button 
              className="btn-primary"
              onClick={handleAgendarClick}
            >
              Agendar Consulta
            </button>
            <button 
              className="btn-secondary"
              onClick={() => window.dispatchEvent(new CustomEvent("mostrarSecao", { detail: "especialidades" }))}
            >
              Nossas Especialidades
            </button>
          </div>
        </div>
      </section>


      <section className="servicos-section">
        <h2>Nossos Serviços</h2>
        <div className="servicos-grid">
          <div className="servico-card">
            <div className="servico-icon">🦴</div>
            <h3>Quiropraxia</h3>
            <p>Técnica de manipulação da coluna vertebral para correção de problemas posturais e alívio de dores.</p>
          </div>
          <div className="servico-card">
            <div className="servico-icon">🔵</div>
            <h3>Ventosaterapia</h3>
            <p>Terapia com ventosas que estimula a circulação sanguínea e promove a desintoxicação ao longo da musculatura.</p>
          </div>
          <div className="servico-card">
            <div className="servico-icon">📍</div>
            <h3>Acupuntura</h3>
            <p>Técnica milenar chinesa que utiliza agulhas para equilibrar a energia do corpo e tratar diversos problemas.</p>
          </div>
          <div className="servico-card">
            <div className="servico-icon">👐</div>
            <h3>Shiatsu</h3>
            <p>Massagem japonesa que utiliza pressão com os dedos para estimular pontos específicos do corpo.</p>
          </div>
          <div className="servico-card">
            <div className="servico-icon">🔥</div>
            <h3>Moxaterapia</h3>
            <p>Técnica da medicina tradicional chinesa que utiliza o calor para estimular pontos de tensão e energia.</p>
          </div>
        </div>
      </section>

      <section className="beneficios-section">
        <div className="beneficios-content">

          <h2>Por que Escolher a HM Massoterapia?</h2>
          
          <div className="beneficios-lista">
            <div className="beneficio-item">
              <div className="beneficio-icon">📅</div>
              <div>
                <h4>Agendamento Online</h4>
                <p>Sistema prático e seguro para agendar suas sessões.</p>
              </div>
            </div>
            
            <div className="beneficio-item">
              <div className="beneficio-icon">👨‍⚕️</div>
              <div>
                <h4>Profissional Qualificado</h4>
                <p>Massoterapeuta certificado e experiente em diversas técnicas.</p>
              </div>
            </div>
            
            <div className="beneficio-item">
              <div className="beneficio-icon">🏥</div>
              <div>
                <h4>Ambiente Seguro</h4>
                <p>Clínica higienizada e equipada seguindo todos os protocolos de saúde.</p>
              </div>
            </div>
            
            <div className="beneficio-item">
              <div className="beneficio-icon">💬</div>
              <div>
                <h4>Atendimento Personalizado</h4>
                <p>Cada sessão é adaptada às suas necessidades específicas e sintomas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
    
          <h2>Pronto para Cuidar do Seu Bem-Estar?</h2>
          
          <p>Agende sua sessão agora e experimente os benefícios da massoterapia profissional.</p>
          
          <button 
            className="btn-cta"
            onClick={handleAgendarClick}
          >
            Agendar Agora
          </button>
        </div>
      </section>
    </div>
  );
}

export default PaginaInicial;