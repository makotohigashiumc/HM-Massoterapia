import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PoliticaPrivacidade from "./components/PoliticaPrivacidade";
import Main from "./components/Main";
import Footer from "./components/Footer";
import "./App.css";

function App() {
 
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
   
    const token = localStorage.getItem("token");
   
    const usuarioSalvo = localStorage.getItem("usuario");
    
    if (token && usuarioSalvo) {
     
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []); 

  const login = ({ tipo, usuario: dadosUsuario, token }) => {
  
    const usuarioCompleto = { tipo, usuario: dadosUsuario, token };
    
    setUsuario(usuarioCompleto);
    
    localStorage.setItem("token", token);
 
    localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));
  };

  const logout = () => {

    setUsuario(null);

    localStorage.removeItem("token");
 
    localStorage.removeItem("usuario");
 
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Main usuario={usuario} login={login} logout={logout} />} />
          
          <Route path="/confirmar-email/*" element={<Main usuario={usuario} login={login} logout={logout} />} />
          <Route path="/redefinir-senha" element={<Main usuario={usuario} login={login} logout={logout} />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
