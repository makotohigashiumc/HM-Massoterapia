import React, { useEffect, useState } from "react";

function ContaMassoterapeuta() {
  const [massoterapeuta, setMassoterapeuta] = useState(null);

  useEffect(() => {

    const fetchMassoterapeuta = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado. Faça login.");
          return;
        }

  const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/massoterapeuta/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resp.ok) {
          const data = await resp.json();
          setMassoterapeuta(data);
        } else {
          console.error("Erro ao buscar dados do massoterapeuta");
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
      }
    };

    fetchMassoterapeuta();
  }, []);

  if (!massoterapeuta) return <p>Carregando informações...</p>;

  return (
    <div className="conta-massoterapeuta">
      <h2>Minha Conta (Massoterapeuta)</h2>
      <p><strong>Nome:</strong> {massoterapeuta.nome}</p>
      <p><strong>Email:</strong> {massoterapeuta.email}</p>
      <p><strong>Telefone:</strong> {massoterapeuta.telefone}</p>
      <p><strong>Especialidade:</strong> {massoterapeuta.especialidade}</p>
      <p><strong>Registro Profissional:</strong> {massoterapeuta.registro_profissional}</p>

      <button onClick={() => alert("Funcionalidade de edição em breve!")}>
        Editar Perfil
      </button>
    </div>
  );
}

export default ContaMassoterapeuta;