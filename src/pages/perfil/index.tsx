import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCamera,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiLock,
  FiLogOut,
  FiStar,
  FiX,
  FiTrash2,
} from 'react-icons/fi';
import Header from '../../components/header';
import { useAuth } from '../../contexts/AuthContext';
import { atualizarPerfil, excluirConta } from '../../services/api';
import {
  uploadFotoPerfil,
  FOTO_MAX_BYTES,
  FOTO_TIPOS,
} from '../../services/supabase';
import SeletorPfpModal from '../../components/seletorPfpModal/index';

function Perfil() {
  const navigate = useNavigate();
  // OBS: assumindo que o AuthContext expõe `logout` — ajusta esse nome se
  // no seu contexto real for diferente (ex: `sair`, `signOut`).
  const { usuario, carregando, logout, token, salvarSessao } = useAuth();

  // -----------------------------------------------------------------------------
  // BLOBS DE FUNDO
  // -----------------------------------------------------------------------------
  interface BlobMotion {
    ampX: number;
    ampY: number;
    speed: number;
    phase: number;
  }

  const BLOB_MOTION: BlobMotion[] = [
    { ampX: 12, ampY: 9, speed: 0.21, phase: 0.0 },
    { ampX: 8, ampY: 12, speed: 0.26, phase: 1.3 },
    { ampX: 10, ampY: 7, speed: 0.19, phase: 2.4 },
    { ampX: 14, ampY: 10, speed: 0.17, phase: 0.6 },
    { ampX: 7, ampY: 11, speed: 0.29, phase: 3.1 },
    { ampX: 11, ampY: 8, speed: 0.2, phase: 1.8 },
    { ampX: 9, ampY: 13, speed: 0.24, phase: 2.9 },
    { ampX: 6, ampY: 9, speed: 0.21, phase: 0.9 },
    { ampX: 9, ampY: 10, speed: 0.23, phase: 1.6 },
    { ampX: 8, ampY: 8, speed: 0.27, phase: 3.6 },
    { ampX: 7, ampY: 9, speed: 0.25, phase: 2.1 },
    { ampX: 10, ampY: 7, speed: 0.22, phase: 0.3 },
  ];

  function Blobs({ tint }: { tint?: string | null }) {
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
      let frameId: number;
      function loop(now: number) {
        const t = now / 1000;
        BLOB_MOTION.forEach((m, i) => {
          const el = refs.current[i];
          if (!el) return;
          const dx = Math.sin(t * m.speed + m.phase) * m.ampX;
          const dy = Math.cos(t * m.speed * 0.85 + m.phase) * m.ampY;
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        frameId = requestAnimationFrame(loop);
      }
      frameId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(frameId);
    }, []);

    const base =
      'absolute rounded-full pointer-events-none bg-[radial-gradient(circle_at_30%_30%,_#A6A0E8,_#7d76c9)]';

    return (
      <>
        <div
          ref={(el) => {
            refs.current[0] = el;
          }}
          className={`${base} opacity-50 w-[220px] h-[220px] -top-[70px] -left-[60px]`}
        />
        <div
          ref={(el) => {
            refs.current[1] = el;
          }}
          className={`${base} opacity-40 w-[70px] h-[70px] top-[8%] left-[12%]`}
        />
        <div
          ref={(el) => {
            refs.current[2] = el;
          }}
          className={`${base} opacity-45 w-[160px] h-[160px] -top-[40px] -right-[70px]`}
        />
        <div
          ref={(el) => {
            refs.current[3] = el;
          }}
          className={`${base} opacity-50 w-[200px] h-[200px] -bottom-[80px] -left-[50px]`}
        />
        <div
          ref={(el) => {
            refs.current[4] = el;
          }}
          className={`${base} opacity-35 w-[50px] h-[50px] bottom-[28%] left-[6%]`}
        />
        <div
          ref={(el) => {
            refs.current[5] = el;
          }}
          className={`${base} opacity-45 w-[140px] h-[140px] bottom-[6%] -right-[60px]`}
        />
        <div
          ref={(el) => {
            refs.current[6] = el;
          }}
          className={`${base} opacity-40 w-[95px] h-[95px] top-[38%] -right-[40px]`}
        />
        <div
          ref={(el) => {
            refs.current[7] = el;
          }}
          className={`${base} opacity-30 w-[55px] h-[55px] top-[16%] right-[18%]`}
        />
        <div
          ref={(el) => {
            refs.current[8] = el;
          }}
          className={`${base} opacity-30 w-[65px] h-[65px] top-[45%] left-[2%]`}
        />
        <div
          ref={(el) => {
            refs.current[9] = el;
          }}
          className={`${base} opacity-30 w-[60px] h-[60px] top-[52%] right-[4%]`}
        />
        <div
          ref={(el) => {
            refs.current[10] = el;
          }}
          className={`${base} opacity-25 w-[45px] h-[45px] top-[3%] left-[45%]`}
        />
        <div
          ref={(el) => {
            refs.current[11] = el;
          }}
          className={`${base} opacity-25 w-[50px] h-[50px] bottom-[4%] left-[42%]`}
        />

        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{ background: tint ?? undefined, opacity: tint ? 1 : 0 }}
        />
      </>
    );
  }

  // -----------------------------------------------------------------------------
  // DADOS DE APOIO
  // -----------------------------------------------------------------------------
  const ESTADOS = [
    { uf: 'AC', nome: 'Acre' },
    { uf: 'AL', nome: 'Alagoas' },
    { uf: 'AP', nome: 'Amapá' },
    { uf: 'AM', nome: 'Amazonas' },
    { uf: 'BA', nome: 'Bahia' },
    { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' },
    { uf: 'ES', nome: 'Espírito Santo' },
    { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' },
    { uf: 'MT', nome: 'Mato Grosso' },
    { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' },
    { uf: 'PA', nome: 'Pará' },
    { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PR', nome: 'Paraná' },
    { uf: 'PE', nome: 'Pernambuco' },
    { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' },
    { uf: 'RN', nome: 'Rio Grande do Norte' },
    { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'RO', nome: 'Rondônia' },
    { uf: 'RR', nome: 'Roraima' },
    { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' },
    { uf: 'SE', nome: 'Sergipe' },
    { uf: 'TO', nome: 'Tocantins' },
  ];

  function nomeEstado(uf: string): string {
    return ESTADOS.find((e) => e.uf === uf)?.nome ?? uf;
  }

  function mascararEmail(email: string): string {
    const [usuario, dominio] = email.split('@');
    if (!usuario || !dominio) return email;
    const visiveis = usuario.slice(0, 2);
    const escondidos = Math.min(Math.max(usuario.length - 2, 3), 6);
    return `${visiveis}${'*'.repeat(escondidos)}@${dominio}`;
  }

  function formatarData(data: string): string {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    if (!ano || !mes || !dia) return data;
    return `${dia}/${mes}/${ano}`;
  }

  // Dados de teste — quando a página individual de partidos/candidatos existir,
  // isso passa a vir da tabela de favoritos do usuário, com foto/bandeira reais.
  interface PartidoFavorito {
    id: string;
    sigla: string;
    nome: string;
    cor: string;
  }
  interface CandidatoFavorito {
    id: string;
    nome: string;
    cargo: string;
    partido: string;
  }

  const PARTIDOS_TESTE: PartidoFavorito[] = [
    { id: 'p1', sigla: 'REDE', nome: 'Rede Sustentabilidade', cor: '#3FA796' },
    {
      id: 'p2',
      sigla: 'PSOL',
      nome: 'Partido Socialismo e Liberdade',
      cor: '#B3282D',
    },
    { id: 'p3', sigla: 'NOVO', nome: 'Partido Novo', cor: '#FF6600' },
  ];

  const CANDIDATOS_TESTE: CandidatoFavorito[] = [
    {
      id: 'c1',
      nome: 'Marina Alcântara',
      cargo: 'Deputada Federal',
      partido: 'REDE',
    },
    { id: 'c2', nome: 'Thiago Bezerra', cargo: 'Senador', partido: 'PSOL' },
    {
      id: 'c3',
      nome: 'Renata Fontoura',
      cargo: 'Governadora',
      partido: 'PSDB',
    },
    {
      id: 'c4',
      nome: 'Bruno Kowalski',
      cargo: 'Deputado Estadual',
      partido: 'NOVO',
    },
    { id: 'c5', nome: 'Thiago Bezerra', cargo: 'Senador', partido: 'PSOL' },
    {
      id: 'c6',
      nome: 'Renata Fontoura',
      cargo: 'Governadora',
      partido: 'PSDB',
    },
    {
      id: 'c7',
      nome: 'Bruno Kowalski',
      cargo: 'Deputado Estadual',
      partido: 'NOVO',
    },
    { id: 'c8', nome: 'Thiago Bezerra', cargo: 'Senador', partido: 'PSOL' },
    {
      id: 'c9',
      nome: 'Renata Fontoura',
      cargo: 'Governadora',
      partido: 'PSDB',
    },
    {
      id: 'c10',
      nome: 'Bruno Kowalski',
      cargo: 'Deputado Estadual',
      partido: 'NOVO',
    },
    { id: 'c11', nome: 'Thiago Bezerra', cargo: 'Senador', partido: 'PSOL' },
    {
      id: 'c12',
      nome: 'Renata Fontoura',
      cargo: 'Governadora',
      partido: 'PSDB',
    },
    {
      id: 'c13',
      nome: 'Bruno Kowalski',
      cargo: 'Deputado Estadual',
      partido: 'NOVO',
    },
  ];

  // -----------------------------------------------------------------------------
  // ESTADO DA TELA
  // -----------------------------------------------------------------------------
  interface PerfilForm {
    nome: string;
    apelido: string;
    email: string;
    estado: string;
    nascimento: string;
    foto: string | null;
  }

  const [form, setForm] = useState<PerfilForm>({
    nome: '',
    apelido: '',
    email: '',
    estado: 'SP',
    nascimento: '',
    foto: null,
  });

  // A API (services/api.ts) hoje só devolve nome/apelido/email em `me()`.
  // Estado, data de nascimento e foto ainda não voltam do backend nesse
  // endpoint — por enquanto ficam com valor de teste até o back devolver
  // esses campos também.
  const sincronizouUsuario = useRef(false);
  useEffect(() => {
    if (!usuario || editando) return;
    setForm((f) => ({
      ...f,
      nome: usuario.nome ?? f.nome,
      apelido: usuario.apelido ?? f.apelido,
      email: usuario.email ?? f.email,
      estado: usuario.estado ?? f.estado,
      nascimento: usuario.data_nascimento ?? f.nascimento,
      foto: usuario.foto_perfil_url ?? f.foto,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const [aba, setAba] = useState<'dados' | 'preferencias'>('dados');
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState<PerfilForm>(form);
  const [salvo, setSalvo] = useState(false);
  const [modalFoto, setModalFoto] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState<string | null>(null);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [senhaExclusao, setSenhaExclusao] = useState('');
  const [confirmSenhaExclusao, setConfirmSenhaExclusao] = useState('');
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);
  const [enviandoExclusao, setEnviandoExclusao] = useState(false);

  const [partidos, setPartidos] = useState(PARTIDOS_TESTE);
  const [candidatos, setCandidatos] = useState(CANDIDATOS_TESTE);

  function atualizarCampo<K extends keyof PerfilForm>(
    campo: K,
    valor: PerfilForm[K],
  ) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function atualizarRascunho<K extends keyof PerfilForm>(
    campo: K,
    valor: PerfilForm[K],
  ) {
    setRascunho((r) => ({ ...r, [campo]: valor }));
  }

  function abrirEdicao() {
    setRascunho(form);
    setEditando(true);
  }

  function cancelarEdicao() {
    setEditando(false);
  }

  function salvarEdicao() {
    // TODO: services/api.ts ainda não tem uma rota de atualização de perfil
    // (ex: PUT /api/auth/me). Por enquanto isso só simula o retorno de sucesso.
    setForm(rascunho);
    setEditando(false);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2400);
  }

  async function enviarFoto(arquivo: File) {
    if (!FOTO_TIPOS.includes(arquivo.type)) {
      setErroFoto('Use uma imagem JPG, PNG ou WEBP.');
      return;
    }
    if (arquivo.size > FOTO_MAX_BYTES) {
      setErroFoto('A foto deve ter no máximo 2 MB.');
      return;
    }
    if (!token) {
      setErroFoto('Sua sessão expirou. Entre novamente.');
      return;
    }

    setErroFoto(null);
    setEnviandoFoto(true);

    try {
      const url = await uploadFotoPerfil(arquivo);

      const { usuario: atualizado } = await atualizarPerfil(token, {
        foto_perfil_url: url,
      });

      atualizarCampo('foto', url);
      salvarSessao(atualizado, token);
    } catch (err: any) {
      setErroFoto(err.message || 'Não foi possível atualizar a foto.');
    } finally {
      setEnviandoFoto(false);
    }
  }

  function handleSair() {
    logout();
    navigate('/');
  }

  function abrirExclusao() {
    setSenhaExclusao('');
    setConfirmSenhaExclusao('');
    setErroExclusao(null);
    setModalExclusao(true);
  }

  function fecharExclusao() {
    if (enviandoExclusao) return;
    setModalExclusao(false);
  }

  async function confirmarExclusao() {
    if (!token) {
      setErroExclusao('Sua sessão expirou. Entre novamente.');
      return;
    }
    if (!senhaExclusao) {
      setErroExclusao('Informe sua senha.');
      return;
    }
    if (senhaExclusao !== confirmSenhaExclusao) {
      setErroExclusao('As senhas não coincidem.');
      return;
    }

    setErroExclusao(null);
    setEnviandoExclusao(true);

    try {
      await excluirConta(token, senhaExclusao);
      logout();
      navigate('/');
    } catch (err: any) {
      setErroExclusao(err.message || 'Não foi possível excluir a conta.');
    } finally {
      setEnviandoExclusao(false);
    }
  }

  const iniciais = form.nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <section className="relative w-full bg-[#2E2A6B]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Blobs tint={aba === 'preferencias' ? 'rgba(255,164,0,0.10)' : null} />
      </div>

      <div className="w-full fixed top-0 z-[1000]">
        <Header />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center px-4 pt-[170px] pb-16">
        <div className="w-full max-w-[560px] flex flex-col items-center">
          {/* CABEÇALHO: FOTO + NOME */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-[3px] border-white/25 bg-[#463F9E] flex items-center justify-center overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
              {form.foto ? (
                <img
                  src={form.foto}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-[#E9E6FF]">
                  {iniciais || '?'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setModalFoto(true)}
              disabled={enviandoFoto}
              aria-label="Alterar foto de perfil"
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#FFA400] text-[#2E2A6B] flex items-center justify-center shadow-md hover:brightness-105 transition disabled:opacity-60"
            >
              <FiCamera size={16} strokeWidth={2} />
            </button>
          </div>

          <h1 className="mt-4 text-2xl text-[#F5F3FF] [font-family:'Montserrat',sans-serif] font-bold">
            {form.nome || (carregando ? 'Carregando...' : 'Seu nome')}
          </h1>
          <p className="text-sm text-[#B6AEE8]">@{form.apelido || 'apelido'}</p>
          {enviandoFoto && (
            <p className="mt-2 text-xs text-[#B6AEE8]">Enviando foto...</p>
          )}
          {erroFoto && (
            <p className="mt-2 text-xs text-[#F2A0A0]">{erroFoto}</p>
          )}

          {/* SELETOR DE ABAS */}
          <div className="mt-7 flex gap-8 border-b border-white/10 w-full justify-center">
            {(['dados', 'preferencias'] as const).map((chave) => (
              <button
                key={chave}
                onClick={() => setAba(chave)}
                className={`relative pb-3 text-sm transition-colors ${
                  aba === chave
                    ? 'text-[#F5F3FF]'
                    : 'text-[#9A92D6] hover:text-[#C9C3F2]'
                }`}
              >
                {chave === 'dados' ? 'Meus dados' : 'Preferências'}
                {aba === chave && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#FFA400] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* CONTEÚDO */}
          <div className="mt-6 w-full bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-tl-[36px] rounded-br-[36px] rounded-tr-xl rounded-bl-xl p-6 sm:p-8">
            {aba === 'dados' ? (
              <div className="flex flex-col gap-5">
                {salvo && (
                  <span className="text-sm text-[#B7E8C0] text-center">
                    Alterações salvas
                  </span>
                )}
                <div className="grid sm:grid-cols-2 gap-5">
                  <LinhaDado label="Nome completo" valor={form.nome || '—'} />
                  <LinhaDado
                    label="Apelido"
                    valor={form.apelido ? `@${form.apelido}` : '—'}
                  />
                </div>
                <LinhaDado
                  label="E-mail"
                  valor={form.email ? mascararEmail(form.email) : '—'}
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <LinhaDado label="Estado" valor={nomeEstado(form.estado)} />
                  <LinhaDado
                    label="Data de nascimento"
                    valor={formatarData(form.nascimento)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-[57px] gap-y-3 pt-2">
                  <button
                    type="button"
                    onClick={abrirEdicao}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFA400] text-[#2E2A6B] text-sm font-semibold hover:brightness-105 transition"
                  >
                    <FiEdit2 size={14} strokeWidth={2.5} />
                    Editar informações
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/recuperar-senha', {
                        state: { origem: 'perfil' },
                      })
                    }
                    className="flex items-center gap-1.5 text-sm text-[#FFA400] hover:brightness-110"
                  >
                    <FiLock size={14} strokeWidth={2.5} />
                    Alterar senha
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <section>
                  <h2 className="text-sm text-[#B6AEE8] mb-4">
                    Partido preferido
                  </h2>
                  {partidos.length === 0 ? (
                    <EstadoVazio texto="Você ainda não favoritou nenhum partido." />
                  ) : (
                    <CarrosselAvatares
                      itens={partidos.map((p) => ({
                        id: p.id,
                        legenda: p.sigla,
                        cor: p.cor,
                        rotulo: p.sigla.slice(0, 3),
                      }))}
                      // TODO: confirmar a rota real da página individual do partido.
                      aoClicar={(id) => navigate(`/partido/${id}`)}
                      aoRemover={(id) =>
                        setPartidos((cur) => cur.filter((x) => x.id !== id))
                      }
                    />
                  )}
                </section>

                <section>
                  <h2 className="text-sm text-[#B6AEE8] mb-4">
                    Candidatos favoritos
                  </h2>
                  {candidatos.length === 0 ? (
                    <EstadoVazio texto="Você ainda não favoritou nenhum candidato." />
                  ) : (
                    <CarrosselAvatares
                      itens={candidatos.map((c) => ({
                        id: c.id,
                        legenda: c.nome,
                        rotulo: c.nome
                          .split(' ')
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join(''),
                      }))}
                      // TODO: confirmar a rota real da página individual do candidato.
                      aoClicar={(id) => navigate(`/candidato/${id}`)}
                      aoRemover={(id) =>
                        setCandidatos((cur) => cur.filter((x) => x.id !== id))
                      }
                    />
                  )}
                </section>

                <p className="text-xs text-[#8A82C4] leading-relaxed">
                  Esses dados são de teste. Quando os partidos e candidatos
                  estiverem conectados à API, a foto/bandeira real de cada um
                  aparece aqui, e o clique leva para a página individual deles.
                </p>
              </div>
            )}
          </div>

          {/* ZONA DE CONFIGURAÇÕES — última opção da página */}
          <div className="mt-10 pt-6 border-t border-white/10 w-full flex justify-center gap-8">
            <button
              type="button"
              onClick={handleSair}
              className="flex items-center gap-2 text-sm text-[#C9C3F2] hover:text-[#D05D5D] transition"
            >
              <FiLogOut size={15} strokeWidth={2.5} />
              Sair da conta
            </button>
            <button
              type="button"
              onClick={abrirExclusao}
              className="flex items-center gap-2 text-sm text-[#F2A0A0] hover:text-[#D05D5D] transition"
            >
              <FiTrash2 size={15} strokeWidth={2.5} />
              Excluir conta
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-6 sm:p-7 text-[#2d2d6b] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.45)] max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={cancelarEdicao}
              aria-label="Fechar"
              className="absolute top-5 right-5 text-[#8b87a3] hover:text-[#2d2d6b] transition"
            >
              <FiX size={20} />
            </button>

            <h2 className="[font-family:'Montserrat',sans-serif] font-bold text-[19px] mb-5">
              Editar informações
            </h2>

            <div className="flex flex-col gap-4">
              <CampoModal label="Nome completo">
                <input
                  value={rascunho.nome}
                  onChange={(e) => atualizarRascunho('nome', e.target.value)}
                  className="campo-input-modal"
                />
              </CampoModal>

              <div className="grid sm:grid-cols-2 gap-4">
                <CampoModal label="Apelido">
                  <input
                    value={rascunho.apelido}
                    onChange={(e) =>
                      atualizarRascunho('apelido', e.target.value)
                    }
                    className="campo-input-modal"
                  />
                </CampoModal>
                <CampoModal label="E-mail">
                  <input
                    type="email"
                    value={rascunho.email}
                    onChange={(e) => atualizarRascunho('email', e.target.value)}
                    className="campo-input-modal"
                  />
                </CampoModal>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <CampoModal label="Estado">
                  <select
                    value={rascunho.estado}
                    onChange={(e) =>
                      atualizarRascunho('estado', e.target.value)
                    }
                    className="campo-input-modal"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.uf} value={e.uf}>
                        {e.nome}
                      </option>
                    ))}
                  </select>
                </CampoModal>
                <CampoModal label="Data de nascimento">
                  <input
                    type="date"
                    value={rascunho.nascimento}
                    onChange={(e) =>
                      atualizarRascunho('nascimento', e.target.value)
                    }
                    className="campo-input-modal"
                  />
                </CampoModal>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={cancelarEdicao}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#5b5776] hover:bg-[#F4F3FA] transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={salvarEdicao}
                className="px-6 py-2.5 rounded-full bg-[#2E2A47] text-white text-sm font-semibold hover:brightness-110 transition"
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO DE CONTA */}
      {modalExclusao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-6 sm:p-7 text-[#2d2d6b] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              onClick={fecharExclusao}
              aria-label="Fechar"
              className="absolute top-5 right-5 text-[#8b87a3] hover:text-[#2d2d6b] transition"
            >
              <FiX size={20} />
            </button>

            <h2 className="[font-family:'Montserrat',sans-serif] font-bold text-[19px] mb-2">
              Excluir conta
            </h2>
            <p className="text-sm text-[#5b5776] mb-5 leading-relaxed">
              Essa ação é permanente: seus dados e favoritos serão apagados e
              não dá para recuperar. Digite sua senha duas vezes para confirmar.
            </p>

            <div className="flex flex-col gap-4">
              <CampoModal label="Senha">
                <input
                  type="password"
                  autoComplete="current-password"
                  value={senhaExclusao}
                  onChange={(e) => setSenhaExclusao(e.target.value)}
                  className="campo-input-modal"
                />
              </CampoModal>
              <CampoModal label="Confirmar senha">
                <input
                  type="password"
                  autoComplete="off"
                  value={confirmSenhaExclusao}
                  onChange={(e) => setConfirmSenhaExclusao(e.target.value)}
                  className="campo-input-modal"
                />
              </CampoModal>
            </div>

            {erroExclusao && (
              <p className="mt-3 text-xs text-[#C0392B]">{erroExclusao}</p>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={fecharExclusao}
                disabled={enviandoExclusao}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#5b5776] hover:bg-[#F4F3FA] transition disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={
                  enviandoExclusao || !senhaExclusao || !confirmSenhaExclusao
                }
                className="px-6 py-2.5 rounded-full bg-[#C0392B] text-white text-sm font-semibold hover:brightness-110 transition disabled:opacity-50"
              >
                {enviandoExclusao ? 'Excluindo...' : 'Excluir conta'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SeletorPfpModal
        aberto={modalFoto}
        onFechar={() => setModalFoto(false)}
        onEscolher={enviarFoto}
      />

      <style>{`
        .campo-input-modal {
          width: 100%;
          background: #F7F5FF;
          border: 1px solid #E4E0F7;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: #2d2d6b;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .campo-input-modal:focus {
          border-color: #FFA400;
        }
        .carrossel-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .carrossel-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function LinhaDado({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[#9A92D6]">{label}</span>
      <span className="text-sm text-[#F5F3FF]">{valor}</span>
    </div>
  );
}

function CampoModal({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-[#5b5776] font-semibold">{label}</span>
      {children}
    </label>
  );
}

function EstadoVazio({ texto }: { texto: string }) {
  return (
    <div className="border border-dashed border-white/15 rounded-2xl px-4 py-5 text-sm text-[#8A82C4]">
      {texto}
    </div>
  );
}

// -----------------------------------------------------------------------------
// CARROSSEL DE AVATARES — usado pra partidos e candidatos favoritos
// -----------------------------------------------------------------------------
interface ItemCarrossel {
  id: string;
  legenda: string;
  rotulo: string;
  cor?: string;
  foto?: string | null;
}

function CarrosselAvatares({
  itens,
  aoClicar,
  aoRemover,
}: {
  itens: ItemCarrossel[];
  aoClicar: (id: string) => void;
  aoRemover: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [podeEsquerda, setPodeEsquerda] = useState(false);
  const [podeDireita, setPodeDireita] = useState(false);

  function atualizarSetas() {
    const el = scrollRef.current;
    if (!el) return;
    setPodeEsquerda(el.scrollLeft > 4);
    setPodeDireita(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    atualizarSetas();
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => atualizarSetas();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itens.length]);

  function rolar(direcao: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direcao * 220, behavior: 'smooth' });
  }

  return (
    <div className="relative flex items-center">
      {podeEsquerda && (
        <button
          type="button"
          onClick={() => rolar(-1)}
          aria-label="Ver anteriores"
          className="absolute left-[-8px] z-10 w-7 h-7 rounded-full bg-[#2E2A6B] border border-white/20 text-white flex items-center justify-center shadow-md hover:bg-[#3A3480] transition"
        >
          <FiChevronLeft size={15} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="carrossel-scroll flex gap-4 overflow-x-auto scroll-smooth px-1 py-1"
      >
        {itens.map((item) => (
          <div key={item.id} className="relative shrink-0 w-[68px]">
            <button
              type="button"
              onClick={() => aoClicar(item.id)}
              className="flex flex-col items-center gap-1.5 w-full group"
            >
              <span
                className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden border-2 border-white/10 group-hover:border-[#FFA400] transition"
                style={{ background: item.cor ?? '#463F9E' }}
              >
                {item.foto ? (
                  <img
                    src={item.foto}
                    alt={item.legenda}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  item.rotulo
                )}
              </span>
              <span className="text-[11px] text-[#B6AEE8] text-center leading-tight line-clamp-2 w-full">
                {item.legenda}
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                aoRemover(item.id);
              }}
              aria-label="Remover dos favoritos"
              className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#2E2A6B] border border-white/20 flex items-center justify-center hover:bg-[#3A3480] transition"
            >
              <FiStar
                size={10}
                strokeWidth={2}
                color="#FFA400"
                fill="#FFA400"
              />
            </button>
          </div>
        ))}
      </div>

      {podeDireita && (
        <button
          type="button"
          onClick={() => rolar(1)}
          aria-label="Ver mais"
          className="absolute right-[-8px] z-10 w-7 h-7 rounded-full bg-[#2E2A6B] border border-white/20 text-white flex items-center justify-center shadow-md hover:bg-[#3A3480] transition"
        >
          <FiChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

export default Perfil;
