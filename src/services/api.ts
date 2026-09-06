const API_URL = import.meta.env.VITE_API_URL;

export interface Usuario {
  id: string;
  nome: string;
  apelido: string | null;
  email: string;
}

// ---------- PARTIDOS ----------

export interface Partido {
  id: string;
  nome_completo: string;
  sigla: string;
  apelido_gentilico: string | null;
  numero_legenda: number;
  data_fundacao: string;
  data_deferimento: string | null;
  fundadores: string[] | null;
  presidente_nacional: string;
  propostas_url: string[] | null;
  propostas_resumo: string[] | null;
  ideologia: string[] | null;
  bandeira_url: string | null;
  uf_sede: string | null;
  tag: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface PartidoResumo {
  id: string;
  nome_completo: string;
  sigla: string;
  numero_legenda: number;
  bandeira_url: string | null;
}

// ---------- CANDIDATOS ----------

export interface FormacaoAcademica {
  curso: string;
  instituicao: string;
  ano_conclusao: number;
}

export interface Candidato {
  id: string;
  candidatura: 'Presidente' | 'Governador';
  numero_candidatura: string | null;
  numero_urna: number;
  nome_completo: string;
  nome_politico: string;
  data_nascimento: string;
  naturalidade: string;
  uf_naturalidade: string;
  formacao_academica: FormacaoAcademica[] | null;
  profissao_anterior: string | null;
  foto_url: string | null;
  partido_id: string | null;
  cargo_atual: string;
  uf_candidatura: string | null;
  vice: string | null;
  tempo_atuacao_anos: number | null;
  feitos_url: string[] | null;
  feitos_resumo: string[] | null;
  created_at: string;
  updated_at: string;
  partidos: PartidoResumo | null;
}

export type CandidatoInput = Omit<
  Candidato,
  'id' | 'created_at' | 'updated_at' | 'partidos'
>;

// ---------- PERGUNTAS ----------

export interface Pergunta {
  id: string;
  texto: string;
  categoria: string;
  tag: string[] | null;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

export type PerguntaInput = Omit<Pergunta, 'id' | 'created_at' | 'updated_at'>;

// ---------- RESPOSTAS / COMPATIBILIDADE ----------

export interface CompatibilidadePartido {
  partido_id: string;
  nome_completo: string;
  sigla: string;
  score: number;
  compatibilidade_pct: number;
}

// Todas exigem usuário logado (o backend valida o token e usa req.user.id).

// ---------- AUTH ----------

export const me = (token: string) =>
  request<{ usuario: Usuario }>('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
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

// ---------- PARTIDOS ----------

export const listarPartidos = () => request<Partido[]>('/api/partidos');

export const cadastrarPartido = (dados: any) =>
  request<Partido>('/api/partidos', {
    method: 'POST',
    body: JSON.stringify(dados),
  });

// ---------- CANDIDATOS ----------

export const listarCandidatos = () => request<Candidato[]>('/api/candidatos');

export const buscarCandidato = (id: string) =>
  request<Candidato>(`/api/candidatos/${id}`);

export const cadastrarCandidato = (dados: CandidatoInput) =>
  request<Candidato>('/api/candidatos', {
    method: 'POST',
    body: JSON.stringify(dados),
  });

export const atualizarCandidato = (
  id: string,
  dados: Partial<CandidatoInput>,
) =>
  request<Candidato>(`/api/candidatos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });

export const excluirCandidato = (id: string) =>
  request<{ mensagem: string }>(`/api/candidatos/${id}`, {
    method: 'DELETE',
  });

// ---------- PERGUNTAS ----------

// Por padrão o backend já filtra ativa = true. Passe { todas: true } pra
// trazer também as desativadas (uso administrativo).
export const listarPerguntas = (opcoes?: { todas?: boolean }) => {
  const query = opcoes?.todas ? '?todas=true' : '';
  return request<Pergunta[]>(`/api/perguntas${query}`);
};

export const buscarPergunta = (id: string) =>
  request<Pergunta>(`/api/perguntas/${id}`);

export const cadastrarPergunta = (dados: PerguntaInput) =>
  request<Pergunta>('/api/perguntas', {
    method: 'POST',
    body: JSON.stringify(dados),
  });

export const atualizarPergunta = (id: string, dados: Partial<PerguntaInput>) =>
  request<Pergunta>(`/api/perguntas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });

export const excluirPergunta = (id: string) =>
  request<{ mensagem: string }>(`/api/perguntas/${id}`, {
    method: 'DELETE',
  });

// ---------- RESPOSTAS / COMPATIBILIDADE ----------
// Seguem o mesmo padrão do `me(token)`: o token vem explícito porque essas
// rotas exigem usuário logado.

export const salvarResposta = (
  token: string,
  pergunta_id: string,
  valor: -1 | 0 | 1,
) =>
  request<{ id: string }>('/api/respostas', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ pergunta_id, valor }),
  });

export const limparRespostas = (token: string) =>
  request<{ mensagem: string }>('/api/respostas', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

export const buscarCompatibilidade = (token: string) =>
  request<CompatibilidadePartido[]>('/api/respostas/compatibilidade', {
    headers: { Authorization: `Bearer ${token}` },
  });

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição');
  return data as T;
}
