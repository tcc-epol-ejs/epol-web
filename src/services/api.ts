const API_URL = import.meta.env.VITE_API_URL;

export interface Usuario {
  id: string;
  nome: string;
  apelido: string | null;
  email: string;
}

export interface Partido {
  id: string;
  nome_completo: string;
  sigla: string;
  bandeira_url: string | null;
  numero_legenda: number;
}

export interface Candidato {
  id: string;
  candidatura: string;
  nome_completo: string;
  nome_politico: string;
}

export const cadastrarPartido = (dados: any) =>
  request<Partido>('/api/partidos', {
    method: 'POST',
    body: JSON.stringify(dados),
  });

export const cadastrarCandidato = (dados: any) =>
  request<Candidato>('/api/candidatos', {
    method: 'POST',
    body: JSON.stringify(dados),
  });

export const cadastrar = (dados: {
  nome: string;
  apelido: string;
  email: string;
  partido_preferencia_id: string | null;
  senha: string;
  estado: string;
  data_nascimento: string;
}) =>
  request<{ usuario: Usuario }>('/api/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify(dados),
  });

export const login = (email: string, senha: string) =>
  request<{ usuario: Usuario; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });

export const listarPartidos = () => request<Partido[]>('/api/partidos');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição');
  return data as T;
}

export const recuperarSenha = (email: string) =>
  request('/api/auth/recuperar-senha', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const redefinirSenha = (token: string, novaSenha: string) =>
  request('/api/auth/redefinir-senha', {
    method: 'POST',
    body: JSON.stringify({ token, novaSenha }),
  });
