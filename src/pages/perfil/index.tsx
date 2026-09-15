import { useEffect, useRef, useState } from 'react';

function Perfil() {
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

  // Dados de teste — quando a página individual de partidos/candidatos existir,
  // isso passa a vir da tabela de favoritos do usuário.
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
    nome: 'Camila Duarte',
    apelido: 'caduarte',
    email: 'camila.duarte@email.com',
    estado: 'SP',
    nascimento: '1998-04-12',
    foto: null,
  });

  const [aba, setAba] = useState<'dados' | 'preferencias'>('dados');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senha, setSenha] = useState({ atual: '', nova: '', confirmar: '' });
  const [salvo, setSalvo] = useState(false);
  const fotoInputRef = useRef<HTMLInputElement | null>(null);

  const [partidos, setPartidos] = useState(PARTIDOS_TESTE);
  const [candidatos, setCandidatos] = useState(CANDIDATOS_TESTE);

  function atualizarCampo<K extends keyof PerfilForm>(
    campo: K,
    valor: PerfilForm[K],
  ) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function escolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const url = URL.createObjectURL(arquivo);
    atualizarCampo('foto', url);
  }

  function salvarAlteracoes() {
    // TODO: integrar com a API — aqui só simula o retorno de sucesso.
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2400);
  }

  const senhasConferem =
    senha.nova.length === 0 || senha.nova === senha.confirmar;
  const iniciais = form.nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <div className="relative w-full h-full min-h-[640px] bg-[#2E2A6B] overflow-hidden flex flex-col items-center px-4 py-10">
      <Blobs tint={aba === 'preferencias' ? 'rgba(232,176,75,0.10)' : null} />

      <div className="relative z-10 w-full max-w-[560px] flex flex-col items-center">
        {/* CABEÇALHO: FOTO + NOME */}
        <div className="flex justify-center items-center gap-5">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-[3px] border-white/25 bg-[#463F9E] flex items-center justify-center overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
              {form.foto ? (
                <img
                  src={form.foto}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-3xl text-[#E9E6FF]"
                  style={{ fontFamily: "'Fraunces', 'Georgia', serif" }}
                >
                  {iniciais || '?'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fotoInputRef.current?.click()}
              aria-label="Alterar foto de perfil"
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#E8B04B] text-[#2E2A6B] flex items-center justify-center shadow-md hover:brightness-105 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="3.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
            <input
              ref={fotoInputRef}
              type="file"
              accept="image/*"
              onChange={escolherFoto}
              className="hidden"
            />
          </div>
          <div className="flex flex-col ">
            <h1
              className="mt-4 text-2xl text-[#F5F3FF]"
              style={{ fontFamily: "'Fraunces', 'Georgia', serif" }}
            >
              {form.nome || 'Seu nome'}
            </h1>
            <p className="text-sm text-[#B6AEE8]">
              @{form.apelido || 'apelido'}
            </p>
          </div>
        </div>
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
                <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#E8B04B] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* CONTEÚDO */}
        <div className="mt-6 w-full bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-tl-[36px] rounded-br-[36px] rounded-tr-xl rounded-bl-xl p-6 sm:p-8">
          {aba === 'dados' ? (
            <div className="flex flex-col gap-5">
              <Campo label="Nome completo">
                <input
                  value={form.nome}
                  onChange={(e) => atualizarCampo('nome', e.target.value)}
                  className="campo-input"
                />
              </Campo>

              <div className="grid sm:grid-cols-2 gap-5">
                <Campo label="Apelido">
                  <input
                    value={form.apelido}
                    onChange={(e) => atualizarCampo('apelido', e.target.value)}
                    className="campo-input"
                  />
                </Campo>
                <Campo label="E-mail">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => atualizarCampo('email', e.target.value)}
                    className="campo-input"
                  />
                </Campo>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Campo label="Estado">
                  <select
                    value={form.estado}
                    onChange={(e) => atualizarCampo('estado', e.target.value)}
                    className="campo-input"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.uf} value={e.uf} className="text-black">
                        {e.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Data de nascimento">
                  <input
                    type="date"
                    value={form.nascimento}
                    onChange={(e) =>
                      atualizarCampo('nascimento', e.target.value)
                    }
                    className="campo-input"
                  />
                </Campo>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="text-sm text-[#E8B04B] hover:brightness-110"
                >
                  {mostrarSenha
                    ? 'Cancelar alteração de senha'
                    : 'Alterar senha'}
                </button>

                {mostrarSenha && (
                  <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4">
                    <Campo label="Senha atual">
                      <input
                        type="password"
                        value={senha.atual}
                        onChange={(e) =>
                          setSenha((s) => ({ ...s, atual: e.target.value }))
                        }
                        className="campo-input"
                      />
                    </Campo>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Campo label="Nova senha">
                        <input
                          type="password"
                          value={senha.nova}
                          onChange={(e) =>
                            setSenha((s) => ({ ...s, nova: e.target.value }))
                          }
                          className="campo-input"
                        />
                      </Campo>
                      <Campo label="Confirmar nova senha">
                        <input
                          type="password"
                          value={senha.confirmar}
                          onChange={(e) =>
                            setSenha((s) => ({
                              ...s,
                              confirmar: e.target.value,
                            }))
                          }
                          className="campo-input"
                        />
                      </Campo>
                    </div>
                    {!senhasConferem && (
                      <p className="text-xs text-[#F2A6A6]">
                        As senhas novas não coincidem.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {salvo && (
                  <span className="text-sm text-[#B7E8C0]">
                    Alterações salvas
                  </span>
                )}
                <button
                  type="button"
                  onClick={salvarAlteracoes}
                  disabled={!senhasConferem}
                  className="px-6 py-2.5 rounded-full bg-[#E8B04B] text-[#2E2A6B] text-sm font-medium hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Salvar alterações
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-7">
              <section>
                <h2 className="text-sm text-[#B6AEE8] mb-3">
                  Partido preferido
                </h2>
                {partidos.length === 0 ? (
                  <EstadoVazio texto="Você ainda não favoritou nenhum partido." />
                ) : (
                  <div className="flex flex-col gap-2">
                    {partidos.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3"
                      >
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-[#1c1a45]"
                          style={{ background: p.cor }}
                        >
                          {p.sigla.slice(0, 3)}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-[#F5F3FF]">{p.nome}</p>
                          <p className="text-xs text-[#9A92D6]">{p.sigla}</p>
                        </div>
                        <BotaoFavorito
                          ativo
                          onClick={() =>
                            setPartidos((cur) =>
                              cur.filter((x) => x.id !== p.id),
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-sm text-[#B6AEE8] mb-3">
                  Candidatos favoritos
                </h2>
                {candidatos.length === 0 ? (
                  <EstadoVazio texto="Você ainda não favoritou nenhum candidato." />
                ) : (
                  <div className="flex flex-col gap-2">
                    {candidatos.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3"
                      >
                        <span className="w-9 h-9 rounded-full bg-[#463F9E] flex items-center justify-center text-xs text-[#E9E6FF]">
                          {c.nome
                            .split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-[#F5F3FF]">{c.nome}</p>
                          <p className="text-xs text-[#9A92D6]">
                            {c.cargo} · {c.partido}
                          </p>
                        </div>
                        <BotaoFavorito
                          ativo
                          onClick={() =>
                            setCandidatos((cur) =>
                              cur.filter((x) => x.id !== c.id),
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <p className="text-xs text-[#8A82C4] leading-relaxed">
                Esses dados são de teste. Quando a página individual de partidos
                e candidatos existir, o botão de favoritar em cada uma delas vai
                alimentar essa lista automaticamente.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .campo-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: #F5F3FF;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .campo-input:focus {
          border-color: #E8B04B;
        }
        .campo-input::placeholder {
          color: #8A82C4;
        }
      `}</style>
    </div>
  );
}

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-[#9A92D6]">{label}</span>
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

function BotaoFavorito({
  ativo,
  onClick,
}: {
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ativo ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={ativo ? '#E8B04B' : 'none'}
      >
        <path
          d="M12 4.5l2.4 5.1 5.6.7-4.1 3.9 1.1 5.5-4.9-2.8-4.9 2.8 1.1-5.5-4.1-3.9 5.6-.7L12 4.5z"
          stroke="#E8B04B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default Perfil;
