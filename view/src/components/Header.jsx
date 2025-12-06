import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ usuario, tipoUsuario }) {
 
  const navigate = useNavigate();

  const handleSiteClick = () => {
   
    if (!usuario) {
      navigate("/"); 
    } else if (tipoUsuario === "cliente") {
   
      navigate("/menu-cliente"); 
    } else if (tipoUsuario === "massoterapeuta") {
    
      navigate("/menu-massoterapeuta"); 
    }
  };

  const handleLogout = () => {
    
    localStorage.removeItem("token");
 
    navigate("/");
   
    window.location.reload(); 
  };

 
  return (
    <header>
      <nav>
        <ul>
         
          <li style={{ cursor: "pointer", fontWeight: "bold" }} onClick={handleSiteClick}>
            Nome do Site
          </li>

          {tipoUsuario === "cliente" && (
            <>
         
              <li><Link to="/agendamentos-cliente">Agendamentos</Link></li>
          
              <li><Link to="/perfil-cliente">Perfil</Link></li>
         
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>Sair</li>
            </>
          )}

          {tipoUsuario === "massoterapeuta" && (
            <>
             
              <li><Link to="/agendamentos-massoterapeuta">Agendamentos</Link></li>
            
              <li><Link to="/clientes">Clientes</Link></li>
             
              <li><Link to="/perfil-massoterapeuta">Perfil</Link></li>
          
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>Sair</li>
            </>
          )}

          {!usuario && (
            <>
          
              <li><Link to="/login">Login</Link></li>
           
              <li><Link to="/cadastro">Cadastro</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
