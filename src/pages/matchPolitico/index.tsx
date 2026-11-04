import { useState, useRef, useMemo, useEffect } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiX,
  FiMinus,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiFlag,
  FiShare2,
  FiDownload,
  FiEdit2,
} from 'react-icons/fi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import Header from '../../components/header';
import RoundButton from '../../components/botoes/roundButton';
import PipoCoracao from '../../assets/Imagens/pipoCoracao.png';
import PipoDefault from '../../assets/Imagens/pipoDefault.png';
import PipoTriste from '../../assets/Imagens/pipoTriste.png';
import { useAuth } from '../../contexts/AuthContext';
import {
  listarPerguntas,
  listarPartidos,
  salvarResposta,
  limparRespostas,
  buscarCompatibilidade,
  type Pergunta as PerguntaAPI,
  type Partido as PartidoAPI,
  type CompatibilidadePartido,
} from '../../services/api';
import Footer from '../../components/footer/footer';

// -----------------------------------------------------------------------------
// TIPOS
// -----------------------------------------------------------------------------
type Mood = 'neutral' | 'happy' | 'sad';
type Valor = -1 | 0 | 1;

interface Pergunta {
  id: string;
  categoria: string;
  texto: string;
  tags: string[];
}

interface Partido {
  id: string;
  sigla: string;
  nome: string;
  cor: string;
  logoSrc: string;
  tags: string[];
}

interface PartidoResultado extends Partido {
  pct: number;
}

interface Resposta {
  tags: string[];
  valor: Valor;
}

interface AcaoErro {
  titulo: string;
  mensagem: string;
  acao?: { label: string; onClick: () => void };
}

// -----------------------------------------------------------------------------
// MAPEAMENTO API -> TIPOS DO FRONT
// -----------------------------------------------------------------------------

const PALETA_CORES = [
  '#FF9F1C',
  '#4C9AFF',
  '#2E2A47',
  '#8B84D6',
  '#22C55E',
  '#EF4444',
  '#F472B6',
  '#0EA5E9',
];

function corPorSigla(sigla: string): string {
  let hash = 0;
  for (let i = 0; i < sigla.length; i++) {
    hash = (hash * 31 + sigla.charCodeAt(i)) >>> 0;
  }
  return PALETA_CORES[hash % PALETA_CORES.length];
}

function mapearPergunta(p: PerguntaAPI): Pergunta {
  return {
    id: p.id,
    categoria: p.categoria,
    texto: p.texto,
    tags: p.tag ?? [],
  };
}

function mapearPartido(p: PartidoAPI): Partido {
  return {
    id: p.id,
    sigla: p.sigla,
    nome: p.nome_completo,
    cor: corPorSigla(p.sigla),
    logoSrc: p.bandeira_url ?? p.sigla,
    tags: p.tag ?? [],
  };
}

// Junta o ranking que veio do backend (calcular_compatibilidade, com o
// percentual já certo) com os dados visuais que só existem no front
// (cor, logo, tags) — combinando pelo id do partido.
function montarRanking(
  ranking: CompatibilidadePartido[],
  partidos: Partido[],
): PartidoResultado[] {
  return ranking.map((r) => {
    const partido = partidos.find((p) => p.id === r.partido_id);
    return {
      id: r.partido_id,
      sigla: r.sigla,
      nome: r.nome_completo,
      cor: partido?.cor ?? corPorSigla(r.sigla),
      logoSrc: partido?.logoSrc ?? r.sigla,
      tags: partido?.tags ?? [],
      pct: r.compatibilidade_pct,
    };
  });
}

// Tags vêm do banco (livres, cadastradas por quem administra as perguntas/
// partidos), então não dá pra confiar só num dicionário fixo. Usa um rótulo
// bonito se existir aqui, senão formata o próprio valor da tag.
const LABELS: Record<string, string> = {
  intervencionismo: 'Intervenção estatal',
  estado_forte: 'Estado forte',
  educacao_tecnica: 'Educação técnica',
  reforma_educacional: 'Reforma educacional',
  saude_publica: 'Saúde pública',
  seguranca_dura: 'Segurança',
  ordem: 'Ordem pública',
  pauta_ambiental: 'Meio ambiente',
  tributacao_progressiva: 'Tributação',
};

function formatarTag(tag: string): string {
  if (LABELS[tag]) return LABELS[tag];
  return tag
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
}

// Texto/cores de cada tipo de resposta (usado na revisão e na navegação)
const VALOR_INFO: Record<Valor, { label: string; chip: string; dot: string }> =
  {
    '1': {
      label: 'Concordo',
      chip: 'bg-green-100 text-green-700',
      dot: 'bg-green-500 text-white',
    },
    '0': {
      label: 'Neutro',
      chip: 'bg-[#EDE9FE] text-[#6F68C9]',
      dot: 'bg-[#8B84D6] text-white',
    },
    '-1': {
      label: 'Discordo',
      chip: 'bg-red-100 text-red-600',
      dot: 'bg-red-500 text-white',
    },
  };

// -----------------------------------------------------------------------------
// MASCOTE — Pipo (usado só na tela de quiz, pra refletir a reação do usuário)
// -----------------------------------------------------------------------------
const PIPO_IMAGES: Record<Mood, string> = {
  happy: PipoCoracao,
  neutral: PipoDefault,
  sad: PipoTriste,
};

interface PipoProps {
  mood?: Mood;
  size?: number;
  animated?: boolean;
}

function Pipo({ mood = 'neutral', size = 120, animated = true }: PipoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  useEffect(() => {
    if (!animated) return;
    let frameId: number;
    function loop(now: number) {
      const t = now / 1000;
      const dy = Math.sin(t * 1.2 + phaseRef.current) * 3;
      const scale = 1 + Math.sin(t * 1.2 + phaseRef.current) * 0.015;
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translateY(${dy}px) scale(${scale})`;
      }
      frameId = requestAnimationFrame(loop);
    }
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [animated]);

  return (
    <div
      ref={wrapperRef}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        willChange: 'transform',
      }}
    >
      <img
        src={PIPO_IMAGES[mood]}
        alt="Pipo"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// LOGO DO PARTIDO
// -----------------------------------------------------------------------------
interface PartidoLogoProps {
  partido: Partido;
  size: number;
}

function PartidoLogo({ partido, size }: PartidoLogoProps) {
  const [erro, setErro] = useState(false);

  if (erro) {
    return (
      <div
        className="rounded-full flex items-center justify-center text-white [font-family:'Sora',sans-serif] font-extrabold"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.32,
          background: partido.cor,
        }}
      >
        {partido.sigla}
      </div>
    );
  }

  return (
    <img
      src={partido.logoSrc}
      alt={`Logo do ${partido.nome}`}
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain' }}
      onError={() => setErro(true)}
    />
  );
}

// -----------------------------------------------------------------------------
// SORTEIO DE PERGUNTAS — 15 por vez
// -----------------------------------------------------------------------------
function embaralhar<T>(lista: T[]): T[] {
  const arr = [...lista];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function selecionarPerguntas(todas: Pergunta[], quantidade = 15): Pergunta[] {
  const porCategoria = new Map<string, Pergunta[]>();
  todas.forEach((p) => {
    const lista = porCategoria.get(p.categoria) ?? [];
    lista.push(p);
    porCategoria.set(p.categoria, lista);
  });
  const grupos = [...porCategoria.values()].map(embaralhar);

  const selecionadas: Pergunta[] = [];
  let indice = 0;
  while (selecionadas.length < quantidade) {
    let adicionouAlguma = false;
    for (const grupo of grupos) {
      if (selecionadas.length >= quantidade) break;
      if (grupo[indice]) {
        selecionadas.push(grupo[indice]);
        adicionouAlguma = true;
      }
    }
    if (!adicionouAlguma) break;
    indice++;
  }

  return embaralhar(selecionadas);
}

// Próxima pergunta ainda sem resposta (procura "pra frente", dando a volta).
// Retorna -1 quando todas já foram respondidas.
function proximaSemResposta(
  perguntas: Pergunta[],
  respostas: Record<string, Valor>,
  aPartirDe: number,
): number {
  for (let k = 1; k <= perguntas.length; k++) {
    const i = (aPartirDe + k) % perguntas.length;
    if (respostas[perguntas[i].id] === undefined) return i;
  }
  return -1;
}

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
        className="absolute inset-0 transition-opacity duration-150 pointer-events-none"
        style={{ background: tint ?? undefined, opacity: tint ? 0.35 : 0 }}
      />
    </>
  );
}

// -----------------------------------------------------------------------------
// MODAL GENÉRICO (overlay + caixa branca, fecha com Esc ou clique fora)
// -----------------------------------------------------------------------------
interface ModalProps {
  onClose: () => void;
  maxW?: string;
  labelledBy?: string;
  children: ReactNode;
}

function Modal({
  onClose,
  maxW = 'max-w-[520px]',
  labelledBy,
  children,
}: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#0f0c3c]/70 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative bg-white rounded-[28px] w-full ${maxW} max-h-[90dvh] flex flex-col overflow-hidden shadow-[0_30px_60px_rgba(15,12,60,0.45)]`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// TELA DE STATUS — carregando / erro / login necessário
// -----------------------------------------------------------------------------
function StatusScreen({
  titulo,
  mensagem,
  acao,
}: {
  titulo: string;
  mensagem: string;
  acao?: { label: string; onClick: () => void };
}) {
  return (
    <div className="relative w-full h-full min-h-[640px] bg-[#2E2A6B] overflow-hidden flex items-center justify-center px-4 py-8">
      <Blobs />
      <div className="relative z-10 bg-white rounded-[28px] p-9 w-full max-w-[420px] shadow-[0_30px_60px_rgba(15,12,60,0.35)] text-center">
        <Pipo mood={acao ? 'sad' : 'neutral'} size={90} />
        <h2 className="[font-family:'Sora',sans-serif] font-bold text-[18px] text-[#1B1B3A] mt-3 mb-1">
          {titulo}
        </h2>
        <p className="text-[13px] text-[#5b5776] leading-[1.5] mb-4">
          {mensagem}
        </p>
        {acao && (
          <button
            onClick={acao.onClick}
            className="bg-[#2E2A47] text-white [font-family:'Sora',sans-serif] font-bold text-[13px] px-5 py-2.5 rounded-full"
          >
            {acao.label}
          </button>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// TELA 0 — INTRODUÇÃO
// -----------------------------------------------------------------------------
interface IntroScreenProps {
  onStart: () => void;
}

function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="relative w-full h-full min-h-[640px] bg-[#2E2A6B] overflow-hidden flex items-center justify-center px-4 py-8">
      <Blobs />
      <div className="relative z-10 bg-white rounded-[28px] p-7 sm:p-9 w-full max-w-[560px] shadow-[0_30px_60px_rgba(15,12,60,0.35)] text-center">
        <h1 className="[font-family:'Sora',sans-serif] font-extrabold text-[24px] sm:text-[28px] text-[#1B1B3A] mt-4 mb-2">
          Descubra seu{' '}
          <em className="italic text-[#FF9F1C] not-italic">match</em> político
        </h1>
        <p className="text-[14px] text-[#5b5776] leading-[1.5] mb-6 max-w-[420px] mx-auto">
          Você vai responder algumas perguntas rápidas sobre economia, educação,
          saúde e outros temas. No final, mostramos com qual partido suas
          respostas mais combinam.
        </p>

        <div className="flex flex-col gap-3 text-left max-w-[400px] mx-auto mb-7">
          <div className="flex items-center gap-3 bg-[#F7F5FF] rounded-2xl px-4 py-3">
            <span className="shrink-0 w-9 h-9 rounded-full bg-[#EDE9FE] text-[#6F68C9] flex items-center justify-center">
              <FiFlag size={16} strokeWidth={2.5} />
            </span>
            <span className="text-[13px] text-[#2E2A47] font-semibold">
              Perguntas sobre vários temas da política
            </span>
          </div>

          <div className="flex items-center gap-3 bg-[#F7F5FF] rounded-2xl px-4 py-3">
            <span className="shrink-0 w-9 h-9 rounded-full bg-[#EDE9FE] text-[#6F68C9] flex items-center justify-center gap-0.5">
              <FiHeart size={16} strokeWidth={2.5} />
            </span>
            <span className="text-[13px] text-[#2E2A47] font-semibold">
              Arraste ou toque nos botões: discordo, neutro ou concordo
            </span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full max-w-[280px] mx-auto block bg-[#2E2A47] text-white [font-family:'Sora',sans-serif] font-bold text-[15px] tracking-[0.02em] py-3.5 rounded-full shadow-[0_5px_0_#16142a] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#16142a]"
        >
          Começar
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// MODAL DE REVISÃO — aparece depois da última pergunta
// -----------------------------------------------------------------------------
interface ReviewModalProps {
  perguntas: Pergunta[];
  respostas: Record<string, Valor>;
  onEdit: (index: number) => void;
  onBack: () => void;
  onConfirm: () => void;
}

function ReviewModal({
  perguntas,
  respostas,
  onEdit,
  onBack,
  onConfirm,
}: ReviewModalProps) {
  const contagem = { '1': 0, '0': 0, '-1': 0 } as Record<string, number>;
  perguntas.forEach((p) => {
    const v = respostas[p.id];
    if (v !== undefined) contagem[String(v)]++;
  });

  return (
    <Modal onClose={onBack} maxW="max-w-[600px]" labelledBy="revisao-titulo">
      <div className="p-6 pb-4 border-b border-[#ECEAFB]">
        <h2
          id="revisao-titulo"
          className="[font-family:'Sora',sans-serif] font-extrabold text-[20px] text-[#1B1B3A]"
        >
          Confira suas respostas
        </h2>
        <p className="text-[13px] text-[#5b5776] mt-1">
          Está tudo certo? Se alguma resposta não for o que você pensa, toque em
          “Editar” para trocar.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {([1, 0, -1] as Valor[]).map((v) => (
            <span
              key={v}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${VALOR_INFO[v].chip}`}
            >
              {contagem[String(v)]} {VALOR_INFO[v].label.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      <ol className="flex-1 overflow-y-auto px-6 py-2 m-0 list-none">
        {perguntas.map((p, i) => {
          const v = respostas[p.id];
          return (
            <li
              key={p.id}
              className="flex items-start gap-3 py-3 border-b border-[#F1EFFB] last:border-b-0"
            >
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#F4F3FA] text-[#6F68C9] text-[12px] font-extrabold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#2E2A47] leading-[1.4] m-0 mb-1.5">
                  {p.texto}
                </p>
                {v !== undefined && (
                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${VALOR_INFO[v].chip}`}
                  >
                    {VALOR_INFO[v].label}
                  </span>
                )}
              </div>
              <button
                onClick={() => onEdit(i)}
                className="shrink-0 flex items-center gap-1 text-[12px] font-semibold text-[#6F68C9] hover:underline mt-0.5"
              >
                <FiEdit2 size={13} /> Editar
              </button>
            </li>
          );
        })}
      </ol>

      <div className="p-5 border-t border-[#ECEAFB] flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        <button
          onClick={onBack}
          className="[font-family:'Sora',sans-serif] font-bold text-[13px] text-[#2E2A47] px-5 py-3 rounded-full bg-[#F4F3FA] hover:bg-[#ECEAFB] transition-colors"
        >
          Voltar ao quiz
        </button>
        <button
          onClick={onConfirm}
          className="[font-family:'Sora',sans-serif] font-bold text-[13px] text-white px-6 py-3 rounded-full bg-[#2E2A47] shadow-[0_4px_0_#16142a] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#16142a]"
        >
          Confirmar e ver resultado
        </button>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// TELA 1 — QUIZ
// -----------------------------------------------------------------------------
interface QuizScreenProps {
  perguntas: Pergunta[];
  onAnswer: (perguntaId: string, valor: Valor) => void;
  onFinish: (respostas: Resposta[]) => void;
}

function QuizScreen({ perguntas, onAnswer, onFinish }: QuizScreenProps) {
  const [index, setIndex] = useState(0);
  // Respostas indexadas pelo id da pergunta, pra dar pra voltar e trocar.
  const [respostas, setRespostas] = useState<Record<string, Valor>>({});
  const [revisando, setRevisando] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState<'like' | 'dislike' | 'neutral' | null>(null);
  const [mood, setMood] = useState<Mood>('neutral');
  const startX = useRef(0);

  const total = perguntas.length;
  const question = perguntas[index];
  const next1 = perguntas[index + 1];
  const next2 = perguntas[index + 2];
  const respondidas = perguntas.filter(
    (p) => respostas[p.id] !== undefined,
  ).length;
  const progress = total > 0 ? Math.round((respondidas / total) * 100) : 0;
  const respostaAtual = question ? respostas[question.id] : undefined;
  const tudoRespondido = total > 0 && respondidas === total;

  function commit(valor: Valor, novoMood: Mood) {
    if (exit || !question) return;
    setMood(novoMood);
    setExit(valor === 1 ? 'like' : valor === -1 ? 'dislike' : 'neutral');
    // Salva no backend (de novo, se for uma troca de resposta).
    onAnswer(question.id, valor);

    const atualizadas = { ...respostas, [question.id]: valor };
    setTimeout(() => {
      setRespostas(atualizadas);
      setExit(null);
      setDragX(0);

      // Vai pra próxima sem resposta; se acabou, abre a revisão.
      const proxima = proximaSemResposta(perguntas, atualizadas, index);
      if (proxima === -1) setRevisando(true);
      else setIndex(proxima);
    }, 240);
  }

  function irPara(i: number) {
    if (exit || i < 0 || i >= total) return;
    setDragX(0);
    setMood('neutral');
    setIndex(i);
  }

  function confirmar() {
    const lista: Resposta[] = perguntas.map((p) => ({
      tags: p.tags,
      valor: respostas[p.id] ?? 0,
    }));
    onFinish(lista);
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    setDragging(true);
    startX.current = e.clientX;
  }
  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragX(e.clientX - startX.current);
  }
  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (dragX > 90) commit(1, 'happy');
    else if (dragX < -90) commit(-1, 'sad');
    else setDragX(0);
  }

  const rotate = dragX / 18;
  const likeOpacity =
    exit === 'like' ? 1 : Math.min(Math.max(dragX / 90, 0), 1);
  const dislikeOpacity =
    exit === 'dislike' ? 1 : Math.min(Math.max(-dragX / 90, 0), 1);
  const tint: string | null =
    exit === 'like'
      ? `radial-gradient(circle at 70% 50%, #22c55e, transparent 60%)`
      : exit === 'dislike'
        ? `radial-gradient(circle at 30% 50%, #ef4444, transparent 60%)`
        : dragX > 10
          ? `radial-gradient(circle at 70% 50%, #22c55e, transparent 60%)`
          : dragX < -10
            ? `radial-gradient(circle at 30% 50%, #ef4444, transparent 60%)`
            : null;

  const exitTransform: string | null =
    exit === 'like'
      ? 'translateX(420px) rotate(18deg)'
      : exit === 'dislike'
        ? 'translateX(-420px) rotate(-18deg)'
        : exit === 'neutral'
          ? 'translateY(-360px) scale(0.9)'
          : null;

  if (!question) {
    return (
      <StatusScreen
        titulo="Nenhuma pergunta disponível"
        mensagem="Não encontramos perguntas ativas cadastradas no momento. Volte mais tarde."
      />
    );
  }

  return (
    <div className="relative w-full h-full min-h-[640px] bg-[#2E2A6B] overflow-hidden flex items-center justify-center px-4 py-8">
      <Blobs tint={tint} />
      <div className="relative z-10 bg-white rounded-[28px] p-7 min-h-[394px] w-full max-w-[620px] shadow-[0_30px_60px_rgba(15,12,60,0.35)]">
        <nav
          aria-label="Perguntas do quiz"
          className="flex items-center justify-center flex-wrap gap-1 mb-5"
        >
          <button
            onClick={() => irPara(index - 1)}
            disabled={index === 0}
            aria-label="Pergunta anterior"
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#6F68C9] hover:bg-[#F4F3FA] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <FiChevronLeft size={14} />
          </button>
          {perguntas.map((p, i) => {
            const v = respostas[p.id];
            const atual = i === index;
            return (
              <button
                key={p.id}
                onClick={() => irPara(i)}
                aria-label={`Pergunta ${i + 1}${
                  v !== undefined
                    ? `, respondida: ${VALOR_INFO[v].label}`
                    : ', sem resposta'
                }`}
                aria-current={atual ? 'step' : undefined}
                className={`w-6 h-6 rounded-full text-[10px] font-extrabold transition-transform focus-visible:outline-2 focus-visible:outline-[#FF9F1C] ${
                  v !== undefined
                    ? VALOR_INFO[v].dot
                    : 'bg-[#ECEAFB] text-[#8B84D6]'
                } ${
                  atual
                    ? 'ring-2 ring-[#FF9F1C] ring-offset-1 scale-110'
                    : 'hover:scale-105'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
          <button
            onClick={() => irPara(index + 1)}
            disabled={index === total - 1}
            aria-label="Próxima pergunta"
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#6F68C9] hover:bg-[#F4F3FA] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <FiChevronRight size={14} />
          </button>
        </nav>

        <div className="flex flex-col sm:flex-row gap-7 items-center sm:items-start flex-wrap">
          <div className="w-[220px] sm:w-[240px]">
            <div className="relative w-[220px] sm:w-[240px] h-[268px]">
              {next2 && (
                <div className="absolute inset-0 rounded-[22px] bg-[#E7E4F8] [transform:translateY(14px)_rotate(6deg)_scale(0.92)]" />
              )}
              {next1 && (
                <div className="absolute inset-0 rounded-[22px] bg-[#D2CDF2] [transform:translateY(7px)_rotate(-4deg)_scale(0.96)]" />
              )}
              <div
                className="absolute inset-0 z-30 rounded-[22px] p-[18px] text-white flex flex-col justify-between cursor-grab touch-none select-none bg-[linear-gradient(160deg,_#6F68C9,_#8B84D6)]"
                style={{
                  transform:
                    exitTransform ||
                    `translateX(${dragX}px) rotate(${rotate}deg)`,
                  transition: dragging
                    ? 'none'
                    : 'transform 0.28s cubic-bezier(.2,.8,.2,1)',
                  opacity: exit === 'neutral' ? 0 : 1,
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                <span className="self-start bg-[#FFE1B0] text-[#7A4A00] text-[10px] font-bold tracking-[0.06em] px-[10px] py-[5px] rounded-full">
                  {question.categoria.toUpperCase()}
                </span>
                <p className="[font-family:'Sora',sans-serif] font-bold text-[17px] leading-[1.35] m-0">
                  {question.texto}
                </p>
                <div className="flex justify-between text-[10px] opacity-80">
                  <span>
                    {respostaAtual !== undefined
                      ? `sua resposta: ${VALOR_INFO[respostaAtual].label.toLowerCase()}`
                      : 'arraste ou use os botões'}
                  </span>
                  <span>
                    {index + 1} / {total}
                  </span>
                </div>
                <div
                  className="absolute top-5 right-[14px] [font-family:'Sora',sans-serif] font-extrabold text-[15px] px-[12px] py-[5px] rounded-lg border-[3px] text-green-500 border-green-500 [transform:rotate(12deg)] transition-opacity duration-150"
                  style={{ opacity: likeOpacity }}
                >
                  CONCORDO
                </div>
                <div
                  className="absolute top-5 left-[14px] [font-family:'Sora',sans-serif] font-extrabold text-[15px] px-[12px] py-[5px] rounded-lg border-[3px] text-red-500 border-red-500 [transform:rotate(-12deg)] transition-opacity duration-150"
                  style={{ opacity: dislikeOpacity }}
                >
                  DISCORDO
                </div>
              </div>
            </div>

            <div className="flex gap-[14px] mt-[18px] justify-center">
              <RoundButton
                ariaLabel="Discordar"
                onClick={() => commit(-1, 'sad')}
              >
                <FiX size={22} strokeWidth={3} />
              </RoundButton>
              <RoundButton
                ariaLabel="Neutro"
                variant="small"
                onClick={() => commit(0, 'neutral')}
              >
                <FiMinus size={20} strokeWidth={3} />
              </RoundButton>
              <RoundButton
                ariaLabel="Concordar"
                variant="accent"
                onClick={() => commit(1, 'happy')}
              >
                <FiHeart size={22} strokeWidth={3} />
              </RoundButton>
            </div>
          </div>

          <div className="flex-1 min-w-[200px] flex flex-col items-center text-center gap-[10px] pt-[10px]">
            <Pipo mood={mood} size={150} />
            <div className="w-full max-w-[220px] h-2 bg-[#ECEAFB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF9F1C] transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[12px] text-[#8B84D6] font-bold">
              {respondidas} de {total} respondidas
            </span>
            {tudoRespondido ? (
              <button
                onClick={() => setRevisando(true)}
                className="[font-family:'Sora',sans-serif] font-bold text-[12px] text-white bg-[#FF9F1C] px-4 py-2 rounded-full hover:brightness-105 mt-[6px]"
              >
                Revisar e finalizar
              </button>
            ) : (
              <h2 className="[font-family:'Sora',sans-serif] text-[16px] text-[#2E2A47] mt-[6px]">
                Responda e descubra
                <br />
                seu representante ideal!
              </h2>
            )}
          </div>
        </div>
      </div>

      {revisando && (
        <ReviewModal
          perguntas={perguntas}
          respostas={respostas}
          onEdit={(i) => {
            setRevisando(false);
            irPara(i);
          }}
          onBack={() => setRevisando(false)}
          onConfirm={confirmar}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// COMPARTILHAMENTO — gera uma imagem (formato story 1080x1920) com o top 3
// -----------------------------------------------------------------------------
const FONTE = "Sora, 'Segoe UI', system-ui, sans-serif";
const NOME_SITE = 'EPOL';

function carregarImagem(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    // Sem CORS no servidor da bandeira a imagem falha; aí caímos no
    // círculo com a sigla (sem "sujar" o canvas).
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function caminhoArredondado(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface OpcoesTexto {
  tamanho: number;
  cor: string;
  peso?: number;
  alinhar?: CanvasTextAlign;
  maxLargura?: number;
}

function escreverTexto(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  { tamanho, cor, peso = 800, alinhar = 'center', maxLargura }: OpcoesTexto,
) {
  let t = tamanho;
  ctx.font = `${peso} ${t}px ${FONTE}`;
  if (maxLargura) {
    while (ctx.measureText(texto).width > maxLargura && t > 16) {
      t -= 2;
      ctx.font = `${peso} ${t}px ${FONTE}`;
    }
  }
  ctx.fillStyle = cor;
  ctx.textAlign = alinhar;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(texto, x, y);
}

// Desenha a imagem dentro de uma caixa mantendo a proporção original
// (sem achatar nem esticar).
function desenharContido(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  maxW: number,
  maxH: number,
) {
  const w0 = img.naturalWidth || maxW;
  const h0 = img.naturalHeight || maxH;
  const esc = Math.min(maxW / w0, maxH / h0);
  const w = w0 * esc;
  const h = h0 * esc;
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
}

function desenharLogo(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  p: Partido,
  cx: number,
  cy: number,
  tamanho: number,
) {
  if (img) {
    desenharContido(ctx, img, cx, cy, tamanho, tamanho);
    return;
  }
  ctx.fillStyle = p.cor;
  ctx.beginPath();
  ctx.arc(cx, cy, tamanho / 2, 0, Math.PI * 2);
  ctx.fill();
  escreverTexto(ctx, p.sigla, cx, cy + tamanho * 0.11, {
    tamanho: tamanho * 0.32,
    cor: '#fff',
    maxLargura: tamanho * 0.8,
  });
}

async function gerarImagemCompartilhamento(
  ranking: PartidoResultado[],
): Promise<Blob | null> {
  const [top, segundo, terceiro] = ranking;
  if (!top) return null;

  try {
    await document.fonts?.load(`800 40px Sora`);
  } catch {
    /* segue com a fonte de fallback */
  }

  const [pipo, logoTop, logo2, logo3] = await Promise.all([
    carregarImagem(PipoCoracao),
    carregarImagem(top.logoSrc),
    segundo ? carregarImagem(segundo.logoSrc) : Promise.resolve(null),
    terceiro ? carregarImagem(terceiro.logoSrc) : Promise.resolve(null),
  ]);

  const W = 1080;
  const H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Fundo
  const fundo = ctx.createLinearGradient(0, 0, W, H);
  fundo.addColorStop(0, '#3A3589');
  fundo.addColorStop(1, '#221E58');
  ctx.fillStyle = fundo;
  ctx.fillRect(0, 0, W, H);

  // Bolhas decorativas
  const bolhas: [number, number, number, number][] = [
    [90, 120, 190, 0.3],
    [990, 300, 130, 0.25],
    [120, 1000, 60, 0.2],
    [1010, 1220, 100, 0.22],
    [60, 1800, 210, 0.3],
    [940, 1780, 130, 0.25],
  ];
  bolhas.forEach(([x, y, r, a]) => {
    ctx.fillStyle = `rgba(166,160,232,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Pipo (mantendo a proporção) + título
  if (pipo) desenharContido(ctx, pipo, W / 2, 255, 320, 300);
  escreverTexto(ctx, 'MEU MATCH POLÍTICO', W / 2, 505, {
    tamanho: 64,
    cor: '#FFFFFF',
    maxLargura: 940,
  });

  // Cartão branco
  const cardX = 60;
  const cardY = 580;
  const cardW = W - 120;
  const cardH = 1010;
  ctx.save();
  ctx.shadowColor = 'rgba(10,8,50,0.45)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 24;
  ctx.fillStyle = '#FFFFFF';
  caminhoArredondado(ctx, cardX, cardY, cardW, cardH, 56);
  ctx.fill();
  ctx.restore();

  // Partido #1 — logo, sigla, nome e porcentagem (tamanhos moderados)
  const lado = 240;
  const lx = (W - lado) / 2;
  const ly = cardY + 50;
  ctx.fillStyle = '#F4F3FA';
  caminhoArredondado(ctx, lx, ly, lado, lado, 44);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = top.cor;
  caminhoArredondado(ctx, lx, ly, lado, lado, 44);
  ctx.stroke();
  desenharLogo(ctx, logoTop, top, W / 2, ly + lado / 2, 160);

  escreverTexto(ctx, top.sigla, W / 2, ly + lado + 80, {
    tamanho: 64,
    cor: '#1B1B3A',
    maxLargura: 840,
  });
  escreverTexto(ctx, top.nome, W / 2, ly + lado + 126, {
    tamanho: 28,
    cor: '#5b5776',
    peso: 600,
    maxLargura: 840,
  });
  escreverTexto(ctx, `${Math.round(top.pct)}%`, W / 2, ly + lado + 255, {
    tamanho: 120,
    cor: '#FF9F1C',
  });
  escreverTexto(ctx, 'de compatibilidade', W / 2, ly + lado + 305, {
    tamanho: 30,
    cor: '#5b5776',
    peso: 600,
  });

  // Divisor + legenda
  const divY = ly + lado + 345;
  ctx.fillStyle = '#ECEAFB';
  ctx.fillRect(cardX + 80, divY, cardW - 160, 3);
  escreverTexto(ctx, 'TAMBÉM COMBINA COM', W / 2, divY + 50, {
    tamanho: 24,
    cor: '#8B84D6',
  });

  // 2º e 3º lugar — linhas empilhadas
  const linhas: [
    PartidoResultado | undefined,
    HTMLImageElement | null,
    number,
  ][] = [
    [segundo, logo2, 2],
    [terceiro, logo3, 3],
  ];
  const rx = cardX + 60;
  const rw = cardW - 120;
  const rh = 130;
  linhas.forEach(([p, img, posicao], i) => {
    if (!p) return;
    const ry = divY + 80 + i * (rh + 20);
    const mid = ry + rh / 2;

    ctx.fillStyle = '#F4F3FA';
    caminhoArredondado(ctx, rx, ry, rw, rh, 32);
    ctx.fill();

    // Número da posição
    ctx.fillStyle = p.cor;
    ctx.beginPath();
    ctx.arc(rx + 64, mid, 32, 0, Math.PI * 2);
    ctx.fill();
    escreverTexto(ctx, String(posicao), rx + 64, mid + 13, {
      tamanho: 36,
      cor: '#FFFFFF',
    });

    // Logo, sigla e nome
    desenharLogo(ctx, img, p, rx + 170, mid, 84);
    escreverTexto(ctx, p.sigla, rx + 240, mid - 2, {
      tamanho: 38,
      cor: '#1B1B3A',
      alinhar: 'left',
      maxLargura: 360,
    });
    escreverTexto(ctx, p.nome, rx + 240, mid + 34, {
      tamanho: 22,
      cor: '#5b5776',
      peso: 600,
      alinhar: 'left',
      maxLargura: 360,
    });

    // Porcentagem à direita
    escreverTexto(ctx, `${Math.round(p.pct)}%`, rx + rw - 40, mid + 20, {
      tamanho: 56,
      cor: p.cor,
      alinhar: 'right',
    });
  });

  // Rodapé
  escreverTexto(ctx, `Descubra o seu no ${NOME_SITE}`, W / 2, 1728, {
    tamanho: 54,
    cor: '#FFFFFF',
    maxLargura: 940,
  });
  escreverTexto(
    ctx,
    'Faça o quiz e veja com qual partido você combina',
    W / 2,
    1788,
    {
      tamanho: 30,
      cor: '#CFCBF5',
      peso: 600,
      maxLargura: 940,
    },
  );

  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  );
}

// -----------------------------------------------------------------------------
// MODAL DE COMPARTILHAR
// -----------------------------------------------------------------------------
function montarTextoCompartilhar(ranking: PartidoResultado[]) {
  const [top] = ranking;
  return `Meu match político deu ${Math.round(top.pct)}% com ${top.nome} (${top.sigla})! 🗳️\nDescubra o seu no ${NOME_SITE}.`;
}

function ShareModal({
  ranking,
  onClose,
}: {
  ranking: PartidoResultado[];
  onClose: () => void;
}) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [erroImagem, setErroImagem] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const texto = montarTextoCompartilhar(ranking);

  useEffect(() => {
    let cancelado = false;
    let url: string | null = null;
    gerarImagemCompartilhamento(ranking)
      .then((b) => {
        if (cancelado) return;
        if (!b) {
          setErroImagem(true);
          return;
        }
        url = URL.createObjectURL(b);
        setBlob(b);
        setPreviewUrl(url);
      })
      .catch(() => !cancelado && setErroImagem(true));
    return () => {
      cancelado = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [ranking]);

  function baixar() {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = 'meu-match-politico.png';
    a.click();
  }

  // Abre a folha de compartilhamento do sistema COM a imagem anexada
  // (celulares e alguns navegadores). Retorna false se não for possível.
  async function compartilharArquivo(): Promise<boolean> {
    if (!blob) return false;
    const file = new File([blob], 'meu-match-politico.png', {
      type: 'image/png',
    });
    if (!navigator.canShare?.({ files: [file] })) return false;
    try {
      await navigator.share({ files: [file], text: texto });
    } catch (err) {
      // AbortError = a pessoa fechou a folha. Não é erro.
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        return false;
      }
    }
    return true;
  }

  async function compartilhar() {
    setAviso(null);
    if (!(await compartilharArquivo())) {
      baixar();
      setAviso(
        'Seu navegador não abre o compartilhamento direto. Baixamos a imagem pra você!',
      );
    }
  }

  async function whatsapp() {
    setAviso(null);
    // Celular: abre o compartilhamento com a imagem (é só escolher o WhatsApp).
    if (await compartilharArquivo()) return;

    // Computador: copia a imagem e abre o WhatsApp; é só colar (Ctrl+V).
    try {
      if (!blob) throw new Error('sem imagem');
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setAviso('Imagem copiada! Cole (Ctrl+V) na conversa do WhatsApp.');
    } catch {
      baixar();
      setAviso('Baixamos a imagem. Anexe ela na conversa do WhatsApp.');
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(texto)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  const botao =
    "flex items-center justify-center gap-2 [font-family:'Sora',sans-serif] font-bold text-[13px] px-4 py-3 rounded-full transition disabled:opacity-40";

  return (
    <Modal onClose={onClose} maxW="max-w-[760px]" labelledBy="share-titulo">
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#F4F3FA] text-[#2E2A47] flex items-center justify-center hover:bg-[#ECEAFB]"
      >
        <FiX size={18} />
      </button>

      <div className="overflow-y-auto p-6 sm:p-8">
        <h2
          id="share-titulo"
          className="[font-family:'Sora',sans-serif] font-extrabold text-[20px] text-[#1B1B3A] mb-1 pr-10"
        >
          Mostre seu match pra galera
        </h2>
        <p className="text-[13px] text-[#5b5776] mb-5">
          Compartilhe o resultado do seu match político!
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-[200px] shrink-0 aspect-[9/16] rounded-2xl overflow-hidden bg-[#F4F3FA] flex items-center justify-center shadow-[0_12px_30px_rgba(46,42,107,0.25)]">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Prévia da imagem de compartilhamento com seu top 3"
                className="w-full h-full object-cover"
              />
            ) : erroImagem ? (
              <span className="text-[12px] text-[#5b5776] text-center px-4">
                Não deu pra gerar a imagem. Tente de novo mais tarde.
              </span>
            ) : (
              <span className="text-[12px] text-[#8B84D6] font-bold">
                Gerando imagem...
              </span>
            )}
          </div>

          <div className="flex-1 w-full flex flex-col gap-3">
            <button
              onClick={compartilhar}
              disabled={!blob}
              className={`${botao} bg-[#2E2A47] text-white shadow-[0_4px_0_#16142a] active:translate-y-1 active:shadow-[0_1px_0_#16142a]`}
            >
              <FiShare2 size={16} /> Compartilhar
            </button>
            <button
              onClick={whatsapp}
              disabled={!blob}
              className={`${botao} bg-[#25D366] text-white hover:brightness-105`}
            >
              <FaWhatsapp size={18} /> WhatsApp
            </button>
            <button
              onClick={baixar}
              disabled={!blob}
              className={`${botao} bg-[#F4F3FA] text-[#2E2A47] hover:bg-[#ECEAFB]`}
            >
              <FiDownload size={16} /> Baixar imagem
            </button>
            {aviso && (
              <p
                role="status"
                className="text-[12px] text-[#6F68C9] font-semibold leading-[1.4] bg-[#F7F5FF] rounded-2xl px-4 py-3 m-0"
              >
                {aviso}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// TELA 2 — RESULTADO
// -----------------------------------------------------------------------------
interface ResultScreenProps {
  ranking: PartidoResultado[];
  respostas: Resposta[];
  onRestart: () => void;
}

function ResultScreen({ ranking, respostas, onRestart }: ResultScreenProps) {
  const [top, second, third] = ranking;
  const [reveal, setReveal] = useState(false);
  const [count, setCount] = useState(0);
  const [compartilhando, setCompartilhando] = useState(false);

  const interesses = useMemo(() => {
    if (!top) return [];
    const likedTags = respostas
      .filter((r) => r.valor === 1)
      .flatMap((r) => r.tags);
    const comuns = [...new Set(likedTags.filter((t) => top.tags.includes(t)))];
    return comuns.slice(0, 4);
  }, [respostas, top]);

  useEffect(() => {
    const revealTimer = setTimeout(() => setReveal(true), 250);
    return () => clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (!reveal || !top) return;
    const duration = 900;
    const start = performance.now();
    let frameId: number;
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * top.pct));
      if (p < 1) frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [reveal, top]);

  if (!top) {
    return (
      <StatusScreen
        titulo="Sem resultado ainda"
        mensagem="Não encontramos compatibilidade calculada. Tente refazer o quiz."
        acao={{ label: 'Refazer quiz', onClick: onRestart }}
      />
    );
  }

  return (
    <div className="relative w-full h-full min-h-[640px] bg-[#2E2A6B] overflow-hidden flex items-center justify-center px-4 py-8">
      <Blobs />
      <div
        className={`relative z-10 bg-white rounded-[28px] p-7 min-h-[394px] w-full max-w-[680px] shadow-[0_30px_60px_rgba(15,12,60,0.35)] transition-all duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          reveal ? 'scale-100 opacity-100' : 'scale-[0.92] opacity-40'
        }`}
      >
        <div className="flex items-center justify-between mb-[10px]">
          <button
            className="bg-transparent border-none text-[#8B84D6] text-[12px] font-semibold flex items-center gap-0.5 cursor-pointer p-0 hover:underline"
            onClick={onRestart}
          >
            <FiChevronLeft size={16} /> refazer
          </button>
          <button
            onClick={() => setCompartilhando(true)}
            className="flex items-center gap-1.5 bg-[#FF9F1C] text-white [font-family:'Sora',sans-serif] font-bold text-[12px] px-4 py-2 rounded-full shadow-[0_3px_0_#c97a0a] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#c97a0a]"
          >
            <FiShare2 size={14} /> Compartilhar
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-7 items-center sm:items-start flex-wrap">
          <div className="flex-[1.3_1_0%] min-w-[260px]">
            <h2 className="[font-family:'Sora',sans-serif] text-[22px] tracking-[0.02em] mb-[14px] text-[#1B1B3A]">
              SEU <em className="italic">MATCH</em> POLÍTICO
            </h2>
            <div className="inline-block bg-[#2E2A47] text-white font-bold text-[12px] tracking-[0.04em] px-[18px] py-[10px] rounded-full mb-5">
              {top.nome.toUpperCase()} ({top.sigla})
            </div>
            <div className="flex items-center gap-3 mb-[22px]">
              <span className="[font-family:'Sora',sans-serif] text-[52px] font-extrabold text-[#FF9F1C] leading-none min-w-[130px]">
                {count}%
              </span>
              <span className="text-[13px] text-[#1B1B3A] font-semibold leading-[1.3]">
                de compatibilidade
                <br />
                com suas respostas
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {interesses.length > 0 ? (
                interesses.map((t) => (
                  <span
                    key={t}
                    className="bg-[#FFE1B0] text-[#7A4A00] text-[11px] font-bold px-3 py-1.5 rounded-full"
                  >
                    {formatarTag(t)}
                  </span>
                ))
              ) : (
                <span className="bg-[#FFE1B0] text-[#7A4A00] text-[11px] font-bold px-3 py-1.5 rounded-full">
                  respostas neutras
                </span>
              )}
            </div>
            <span className="text-[12px] text-[#8b87a3]">
              foram seus principais interesses em comum
            </span>
          </div>

          <div className="min-w-[180px] flex flex-col gap-[14px] items-center">
            <div
              className="w-[180px] h-[180px] rounded-[22px] flex items-center justify-center p-6 bg-[#F4F3FA] border-[4px]"
              style={{ borderColor: top.cor }}
            >
              <PartidoLogo partido={top} size={110} />
            </div>
            <div className="flex gap-[10px]">
              {[second, third].filter(Boolean).map((p) => (
                <div
                  key={p!.sigla}
                  className="w-[83px] h-[83px] rounded-2xl flex flex-col items-center justify-center gap-0.5 p-3 pb-1 bg-[#F4F3FA] border-[3px]"
                  style={{ borderColor: p!.cor }}
                >
                  <PartidoLogo partido={p!} size={55} />
                  <span
                    className="font-extrabold text-[15px] [font-family:'Sora',sans-serif]"
                    style={{ color: p!.cor }}
                  >
                    {p!.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {compartilhando && (
        <ShareModal
          ranking={ranking}
          onClose={() => setCompartilhando(false)}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// PÁGINA — MatchPolitico
// -----------------------------------------------------------------------------
type View = 'intro' | 'quiz' | 'result';

export default function MatchPolitico() {
  const navigate = useNavigate();
  const { usuario, token, carregando: carregandoAuth } = useAuth();

  const [view, setView] = useState<View>('intro');
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [perguntasQuiz, setPerguntasQuiz] = useState<Pergunta[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [rankingServidor, setRankingServidor] = useState<
    CompatibilidadePartido[]
  >([]);

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroDados, setErroDados] = useState<string | null>(null);
  const [carregandoResultado, setCarregandoResultado] = useState(false);
  const [erroAcao, setErroAcao] = useState<AcaoErro | null>(null);

  async function carregarDados() {
    setCarregandoDados(true);
    setErroDados(null);
    try {
      const [perguntasApi, partidosApi] = await Promise.all([
        listarPerguntas(),
        listarPartidos(),
      ]);
      setPerguntas(perguntasApi.map(mapearPergunta));
      setPartidos(partidosApi.map(mapearPartido));
    } catch (err) {
      setErroDados(
        err instanceof Error ? err.message : 'Erro ao carregar dados.',
      );
    } finally {
      setCarregandoDados(false);
    }
  }

  useEffect(() => {
    if (usuario) carregarDados();
  }, [usuario]);

  async function handleStart() {
    if (!token) return;
    setErroAcao(null);
    try {
      await limparRespostas(token);
      setRespostas([]);
      setPerguntasQuiz(selecionarPerguntas(perguntas, 15));
      setView('quiz');
    } catch (err) {
      setErroAcao({
        titulo: 'Não deu pra começar',
        mensagem:
          err instanceof Error
            ? err.message
            : 'Erro ao preparar uma nova tentativa.',
        acao: { label: 'Tentar de novo', onClick: handleStart },
      });
    }
  }

  // Chamado a cada resposta, inclusive quando a pessoa troca uma resposta
  // anterior. O backend precisa SUBSTITUIR a resposta da mesma pergunta
  // (upsert) em vez de criar uma segunda.
  function handleAnswer(perguntaId: string, valor: Valor) {
    if (!token) return;
    salvarResposta(token, perguntaId, valor).catch((err) => {
      console.error('Falha ao salvar resposta:', err);
    });
  }

  async function handleFinish(novas: Resposta[]) {
    setRespostas(novas);
    if (!token) return;
    setErroAcao(null);
    setCarregandoResultado(true);
    try {
      const ranking = await buscarCompatibilidade(token);
      setRankingServidor(ranking);
      setView('result');
    } catch (err) {
      setErroAcao({
        titulo: 'Não foi possível calcular seu resultado',
        mensagem: err instanceof Error ? err.message : 'Tente novamente.',
        acao: { label: 'Tentar de novo', onClick: () => handleFinish(novas) },
      });
    } finally {
      setCarregandoResultado(false);
    }
  }

  const rankingFinal = useMemo(
    () => montarRanking(rankingServidor, partidos),
    [rankingServidor, partidos],
  );

  let conteudo: React.ReactNode;

  if (carregandoAuth) {
    conteudo = (
      <StatusScreen titulo="Carregando..." mensagem="Verificando sua sessão." />
    );
  } else if (!usuario) {
    conteudo = (
      <StatusScreen
        titulo="Faça login para continuar"
        mensagem="O Match Político salva suas respostas na sua conta, então é preciso estar logado antes de começar."
        acao={{ label: 'Fazer login', onClick: () => navigate('/login') }}
      />
    );
  } else if (carregandoDados) {
    conteudo = (
      <StatusScreen
        titulo="Carregando..."
        mensagem="Buscando as perguntas e os partidos cadastrados."
      />
    );
  } else if (erroDados) {
    conteudo = (
      <StatusScreen
        titulo="Algo deu errado"
        mensagem={erroDados}
        acao={{ label: 'Tentar de novo', onClick: carregarDados }}
      />
    );
  } else if (erroAcao) {
    conteudo = (
      <StatusScreen
        titulo={erroAcao.titulo}
        mensagem={erroAcao.mensagem}
        acao={erroAcao.acao}
      />
    );
  } else if (carregandoResultado) {
    conteudo = (
      <StatusScreen
        titulo="Calculando..."
        mensagem="Comparando suas respostas com os partidos cadastrados."
      />
    );
  } else if (view === 'intro') {
    conteudo = <IntroScreen onStart={handleStart} />;
  } else if (view === 'quiz') {
    conteudo = (
      <QuizScreen
        perguntas={perguntasQuiz}
        onAnswer={handleAnswer}
        onFinish={handleFinish}
      />
    );
  } else {
    conteudo = (
      <ResultScreen
        ranking={rankingFinal}
        respostas={respostas}
        onRestart={handleStart}
      />
    );
  }

  return (
    <section className="w-full h-[100dvh]">
      <div className="w-full fixed top-0 z-[1000]">
        <Header />
      </div>
      <div className="w-full h-full">{conteudo}</div>

      <Footer />
    </section>
  );
}
