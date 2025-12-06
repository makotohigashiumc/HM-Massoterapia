import React, { useState, useEffect } from "react";
import ConfirmarEmail from "./ConfirmarEmail";       
import LoginForm from "./LoginForm";                 
import RecuperarSenha from "./RecuperarSenha";        
import RedefinirSenha from "./RedefinirSenha";       
import CadastroForm from "./CadastroForm";            
import PerfilCliente from "./Perfil/PerfilCliente";   
import PerfilMassoterapeuta from "./Perfil/PerfilMassoterapeuta"; 
import AgendamentosCliente from "./Agendamentos/AgendamentosCliente"; 
import AgendamentosMassoterapeuta from "./Agendamentos/AgendamentosMassoterapeuta"; 
import GerenciarClientes from "./GerenciarClientes";  
import Especialidades from "./Especialidades";       
import Contato from "./Contato";                    
import PaginaInicial from "./PaginaInicial";         
import "../App.css";                                 


function Main({ usuario, login, logout }) {

  const [secaoAtual, setSecaoAtual] = useState("");

  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  const [mostrarRecuperar, setMostrarRecuperar] = useState(false);

 
  useEffect(() => {
 
    const handler = (e) => setSecaoAtual(e.detail);

    window.addEventListener("mostrarSecao", handler);

    return () => window.removeEventListener("mostrarSecao", handler);
  }, []);

 
  useEffect(() => {
    if (usuario) {
      
      if (usuario.tipo === "massoterapeuta") {
        setSecaoAtual("agendamentos");
      } else {
       
        setSecaoAtual("");
      }
    }
  }, [usuario]); 


  const tipoUsuario = usuario?.tipo;

  const isConfirmarEmail = window.location.pathname.startsWith("/confirmar-email/");
  

  const urlParams = new URLSearchParams(window.location.search);

  const tokenRedefinir = urlParams.get("token");

  const isRedefinirSenha = window.location.pathname.startsWith("/redefinir-senha") && tokenRedefinir;


  return (
    <>

      <header>
    
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
           
            if (!usuario) setSecaoAtual(""); 
            else if (tipoUsuario === "cliente") setSecaoAtual("inicio"); 
            else if (tipoUsuario === "massoterapeuta") setSecaoAtual("agendamentos"); 
          }}
        >
          HM Massoterapia
        </h1>
        
  
        <nav>
   
          {!usuario && (
            <>
          
              <a onClick={() => setSecaoAtual("")}>Início</a>
        
              <a onClick={() => setSecaoAtual("especialidades")}>Especialidades</a>
           
              <a onClick={() => setSecaoAtual("contato")}>Contato</a>
             
              <a onClick={() => { setSecaoAtual("login"); setMostrarCadastro(false); }}>Login</a>
            </>
          )}
          
      
          {usuario && tipoUsuario === "cliente" && (
            <>
        
              <a 
                onClick={() => setSecaoAtual("inicio")}
              >
                🏠 Início
              </a>
            
              <a 
                onClick={() => setSecaoAtual("especialidades")}
              >
                ⚕️ Especialidades
              </a>
         
              <a 
                onClick={() => setSecaoAtual("contato")}
              >
                📞 Contato
              </a>
        
              <a 
                onClick={() => setSecaoAtual("agendamentos")}
              >
                📅 Agendamentos
              </a>
    
              <a 
                onClick={() => setSecaoAtual("perfil")}
              >
                👤 Perfil
              </a>
         
              <a 
                onClick={logout}
                className="cliente"
              >
                🚪 Sair
              </a>
            </>
          )}
          
  
          {usuario && tipoUsuario === "massoterapeuta" && (
            <>
        
              <a 
                onClick={() => setSecaoAtual("clientes")}
              >
                👥 Clientes
              </a>
           
              <a 
                onClick={() => setSecaoAtual("agendamentos")}
              >
                📅 Agendamentos
              </a>
     
              <a 
                onClick={() => setSecaoAtual("perfil")}
              >
                👤 Perfil
              </a>
       
              <a 
                onClick={logout}
              >
                🚪 Sair
              </a>
            </>
          )}
        </nav>
      </header>

      <main>
     
        {isConfirmarEmail ? (
         
          <ConfirmarEmail voltarLogin={() => { 
            setSecaoAtual("login"); 
            setMostrarCadastro(false); 
            window.history.replaceState({}, '', '/'); 
          }} />
        ) : isRedefinirSenha ? (
        
          <RedefinirSenha token={tokenRedefinir} onRedefinido={() => {
            setSecaoAtual("login");
            setMostrarCadastro(false);
            window.history.replaceState({}, '', '/');
          }} />
        ) : mostrarRecuperar ? (
         
          <RecuperarSenha onVoltar={() => setMostrarRecuperar(false)} />
        ) : (
    
          <>
     
            {secaoAtual === "login" && !mostrarCadastro && (
           
              <LoginForm 
                login={login} 
                abrirCadastro={() => setMostrarCadastro(true)} 
                abrirRecuperarSenha={() => setMostrarRecuperar(true)} 
              />
            )}
            {secaoAtual === "login" && mostrarCadastro && (
         
              <CadastroForm voltarLogin={() => setMostrarCadastro(false)} />
            )}

        
            {secaoAtual === "perfil" && tipoUsuario === "cliente" && (
           
              <PerfilCliente usuario={usuario.usuario} token={usuario.token} />
            )}
            {secaoAtual === "perfil" && tipoUsuario === "massoterapeuta" && (
              <PerfilMassoterapeuta usuario={usuario.usuario} token={usuario.token} />
            )}

            {secaoAtual === "agendamentos" && tipoUsuario === "cliente" && (
            
              <AgendamentosCliente usuario={usuario.usuario} token={usuario.token} />
            )}
            {secaoAtual === "agendamentos" && tipoUsuario === "massoterapeuta" && (
              <AgendamentosMassoterapeuta usuario={usuario.usuario} token={usuario.token} />
            )}

            {secaoAtual === "clientes" && tipoUsuario === "massoterapeuta" && (
              
              <GerenciarClientes usuario={usuario.usuario} token={usuario.token} />
            )}

           
            {secaoAtual === "especialidades" && <Especialidades />}
            {secaoAtual === "contato" && <Contato />}
            {secaoAtual === "" && !usuario && <PaginaInicial />}
            {secaoAtual === "inicio" && tipoUsuario === "cliente" && <PaginaInicial />}
            {secaoAtual === "" && tipoUsuario === "cliente" && <PaginaInicial />}
          </>
        )}
      </main>
    </>
  );
}

export default Main;