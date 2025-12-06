import React, { useEffect, useState } from "react";

function ConfirmarEmail({ voltarLogin }) {

  const [mensagem, setMensagem] = useState("Validando...");

  useEffect(() => {
  
    const url = window.location.pathname;
    const token = url.split("/confirmar-email/")[1]; 
    
    
    if (!token) {
      setMensagem("Token de confirmação inválido.");
      return; 
    }
    
  fetch(`${import.meta.env.VITE_API_BASE_URL}/clientes/confirmar-email/${token}`, {
      method: "POST" 
    })
      .then(async (resp) => {
     
        if (resp.ok) {
         
          setMensagem("E-mail confirmado com sucesso! Você pode fazer login.");
          
          setTimeout(() => {
            if (voltarLogin) voltarLogin(); 
            else window.location.href = "/"; 
          }, 2500);
        } else {
     
          const err = await resp.json();
          setMensagem(err.erro || "Falha ao confirmar e-mail.");
        }
      })
      .catch(() => {
    
        setMensagem("Erro de conexão ao confirmar e-mail.");
      });
  }, [voltarLogin]); 


  return (
    <div className="confirmar-email-container">

      <h2>Confirmação de E-mail</h2>
  
      <p>{mensagem}</p>
    </div>
  );
}

export default ConfirmarEmail;