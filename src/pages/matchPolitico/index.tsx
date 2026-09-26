import { useState, useRef, useMemo, useEffect } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiMinus, FiHeart, FiChevronLeft, FiFlag } from 'react-icons/fi';
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
// TELA 1 — QUIZ
// -----------------------------------------------------------------------------
interface QuizScreenProps {
  perguntas: Pergunta[];
  onAnswer: (perguntaId: string, valor: Valor) => void;
  onFinish: (respostas: Resposta[]) => void;
}

function QuizScreen({ perguntas, onAnswer, onFinish }: QuizScreenProps) {
  const [index, setIndex] = useState(0);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState<'like' | 'dislike' | 'neutral' | null>(null);
  const [mood, setMood] = useState<Mood>('neutral');
  const startX = useRef(0);

  const total = perguntas.length;
  const question = perguntas[index];
  const next1 = perguntas[index + 1];
  const next2 = perguntas[index + 2];
  const progress = total > 0 ? Math.round((index / total) * 100) : 0;

  function commit(valor: Valor, mood: Mood) {
    if (exit || !question) return;
    setMood(mood);
    setExit(valor === 1 ? 'like' : valor === -1 ? 'dislike' : 'neutral');
    onAnswer(question.id, valor); // salva no backend, sem travar a navegação local
    setTimeout(() => {
      const novas: Resposta[] = [...respostas, { tags: question.tags, valor }];
      setRespostas(novas);
      setExit(null);
      setDragX(0);
      if (index + 1 >= total) onFinish(novas);
      else setIndex(index + 1);
    }, 240);
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
                  <span>arraste ou use os botões</span>
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
              {progress}%
            </span>
            <h2 className="[font-family:'Sora',sans-serif] text-[16px] text-[#2E2A47] mt-[6px]">
              Responda e descubra
              <br />
              seu representante ideal!
            </h2>
          </div>
        </div>
      </div>
    </div>
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
        <button
          className="bg-transparent border-none text-[#8B84D6] text-[12px] font-semibold flex items-center gap-0.5 cursor-pointer mb-[10px] p-0 hover:underline"
          onClick={onRestart}
        >
          <FiChevronLeft size={16} /> refazer
        </button>
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
