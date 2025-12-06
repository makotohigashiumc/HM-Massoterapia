import React, { useState } from "react";
import { enviarMensagemContato } from "../services/Api";
import "./PaginaInicial.css"; 

function Contato() {

  let usuarioLogado = null;
  let emailUsuarioLogado = null;
  let nomeUsuarioLogado = null;
  let telefoneUsuarioLogado = null;
  let isClienteLogado = false;
  try {
    const usuarioSalvo = localStorage.getItem("usuario");
    usuarioLogado = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    isClienteLogado = !!(usuarioLogado && usuarioLogado.tipo === "cliente");
    if (isClienteLogado) {
      const u = usuarioLogado.usuario || {};
      emailUsuarioLogado = u.email || null;
      nomeUsuarioLogado = u.nome || u.nome_completo || null;
      telefoneUsuarioLogado = u.telefone || u.telefone_celular || u.celular || null;
    }
  } catch (err) {

    usuarioLogado = null;
    emailUsuarioLogado = null;
    nomeUsuarioLogado = null;
    telefoneUsuarioLogado = null;
    isClienteLogado = false;
  }

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      
      if (!formData.assunto.trim() || !formData.mensagem.trim()) {
        throw new Error("Por favor, preencha todos os campos obrigatórios.");
      }

      
      if (!isClienteLogado && (!formData.nome.trim() || !formData.email.trim())) {
        throw new Error("Por favor, preencha nome e e-mail para contato.");
      }

 
      const payload = {
        nome: nomeUsuarioLogado || formData.nome,
        email: emailUsuarioLogado || formData.email,
        telefone: telefoneUsuarioLogado || formData.telefone,
        assunto: formData.assunto,
        mensagem: formData.mensagem
      };


      const response = await enviarMensagemContato(payload);
      

      setMessage(response.mensagem);
      setMessageType("success");
      
   
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: ""
      });

    } catch (error) {
      
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="contato-container">

      <div className="contato-header">
        <h1>Entre em Contato</h1>
        <p>Estamos aqui para esclarecer suas dúvidas e ajudar no que precisar</p>
      </div>

   
      <div className="contato-content">
   
        <div className="contato-info">
          <h2>Fale Conosco</h2>
          <p>Nossa equipe está sempre disponível para oferecer suporte, esclarecer dúvidas sobre tratamentos ou ajudar com agendamentos.</p>
          
   
          <div className="contato-item">
            <div className="contato-icone">📧</div>
            <div className="contato-detalhes">
              <h3>E-mail</h3>
         
              <a href="mailto:hmmassoterapia7@gmail.com">hmmassoterapia7@gmail.com</a>
              <p>Resposta em até 24 horas</p>
            </div>
          </div>

      
          <div className="contato-item">
            <div className="contato-icone">📞</div>
            <div className="contato-detalhes">
              <h3>Telefone</h3>
          
              <a href="tel:+5511999430693">(11) 99943-0693</a>
              <p>Seg à Sex: 8h às 18h</p>
            </div>
          </div>

     
          <div className="contato-item">
            <div className="contato-icone">📍</div>
            <div className="contato-detalhes">
              <h3>Endereço</h3>
              <p>Rua dos Ipês, 66<br />Arujá, SP<br />CEP: 07429-815</p>
            </div>
          </div>

     
          <div className="contato-item">
            <div className="contato-icone">📸</div>
            <div className="contato-detalhes">
              <h3>Redes Sociais</h3>
         
              <a href="" target="_blank" rel="noopener noreferrer">
                @hmmassoterapia
              </a>
              <p>Acompanhe nossas dicas de bem-estar</p>
            </div>
          </div>
        </div>

        <div className="contato-formulario">
          <h2>Envie uma Mensagem</h2>
          
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
          
          <form className="formulario-contato" onSubmit={handleSubmit}>
      
            {!isClienteLogado && (
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input 
                  type="text" 
                  id="nome" 
                  name="nome" 
                  value={formData.nome}
                  onChange={handleChange}
                  required 
                  disabled={isLoading}
                />
              </div>
            )}
            
            {!isClienteLogado && (
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  disabled={isLoading}
                />
              </div>
            )}
            
            {!isClienteLogado && (
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input 
                  type="tel" 
                  id="telefone" 
                  name="telefone" 
                  value={formData.telefone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            )}
            

            <div className="form-group">
              <label htmlFor="assunto">Assunto</label>
              <select 
                id="assunto" 
                name="assunto" 
                value={formData.assunto}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Selecione um assunto</option>
                <option value="agendamento">Dúvidas sobre Agendamento</option>
                <option value="tratamentos">Informações sobre Tratamentos</option>
                <option value="valores">Consulta de Valores</option>
                <option value="suporte">Suporte Técnico</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            
       
            <div className="form-group">
              <label htmlFor="mensagem">Mensagem</label>
              <textarea 
                id="mensagem" 
                name="mensagem" 
                rows="5" 
                placeholder="Descreva sua dúvida ou solicitação..."
                value={formData.mensagem}
                onChange={handleChange}
                required
                disabled={isLoading}
              ></textarea>
            </div>
            
       
            <button 
              type="submit" 
              className="btn-enviar"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        </div>
      </div>

  
      <div className="contato-horarios">
        <h2>Horários de Funcionamento</h2>
   
        <div className="horarios-grid">
      
          <div className="horario-item">
            <span className="dia">Segunda à Quinta</span>
            <span className="hora">8h às 18h</span>
          </div>
        
          <div className="horario-item">
            <span className="dia">Sexta</span>
            <span className="hora">Fechado</span>
          </div>
          
          <div className="horario-item">
            <span className="dia">Sábado e Domingo</span>
            <span className="hora">Fechado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contato;
