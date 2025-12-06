const rawApiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API_BASE = (function (b) {
  const trimmed = b.replace(/\/+$/g, '');
  return trimmed.endsWith('/api') ? trimmed : trimmed + '/api';
})(rawApiBase);
console.log("API_BASE resolved to:", API_BASE);

// ================================
// FUNÇÕES DE AUTENTICAÇÃO
// ================================

export async function loginCliente(email, senha) {
  const resp = await fetch(`${API_BASE}/clientes/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ email, senha }),
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    try { const err = JSON.parse(text); throw new Error(err.erro || err.message || JSON.stringify(err)); } catch { throw new Error(text || 'Login falhou'); }
  }
  return resp.json();
}

export async function loginMassoterapeuta(email, senha) {
  const resp = await fetch(`${API_BASE}/massoterapeutas/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    try { const err = JSON.parse(text); throw new Error(err.erro || err.message || JSON.stringify(err)); } catch { throw new Error(text || 'Login falhou'); }
  }
  return resp.json();
}

// ================================
// FUNÇÕES DE CADASTRO
// ================================

export async function cadastrarCliente(dados) {
  const resp = await fetch(`${API_BASE}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados), 
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    try { const err = JSON.parse(text); throw new Error(err.erro || err.message || JSON.stringify(err)); } catch { throw new Error(text || 'Cadastro falhou'); }
  }
  return resp.json();
}

// ================================
// FUNÇÕES DE RECUPERAÇÃO DE SENHA
// ================================

export async function recuperarSenha(email) {
  const resp = await fetch(`${API_BASE}/clientes/recuperar-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }), 
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    try { const err = JSON.parse(text); throw new Error(err.erro || err.message || JSON.stringify(err)); } catch { throw new Error(text || 'Erro ao solicitar recuperação de senha'); }
  }
  return resp.json();
}

export async function redefinirSenha(token, nova_senha) {
  const resp = await fetch(`${API_BASE}/clientes/redefinir-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, nova_senha }), 
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    try { const err = JSON.parse(text); throw new Error(err.erro || err.message || JSON.stringify(err)); } catch { throw new Error(text || 'Erro ao redefinir senha'); }
  }
  return resp.json();
}

// ================================
// FUNÇÕES DE CONTATO
// ================================
export async function enviarMensagemContato(dados) {
  const resp = await fetch(`${API_BASE}/contato`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados), 
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    try { const err = JSON.parse(text); throw new Error(err.erro || err.message || JSON.stringify(err)); } catch { throw new Error(text || 'Erro ao enviar mensagem'); }
  }
  return resp.json();
}
