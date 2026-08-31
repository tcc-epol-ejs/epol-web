import { useState, useRef, useMemo, useEffect } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  FiX,
  FiMinus,
  FiHeart,
  FiChevronLeft,
  FiFlag,
  FiTarget,
} from 'react-icons/fi';
import Header from '../../components/header';
import RoundButton from '../../components/botoes/roundButton';
import PipoCoracao from '../../assets/Imagens/pipoCoracao.png';
import PipoDefault from '../../assets/Imagens/pipoDefault.png';
import PipoTriste from '../../assets/Imagens/pipoTriste.png';

// -----------------------------------------------------------------------------
// TIPOS
// -----------------------------------------------------------------------------
type Mood = 'neutral' | 'happy' | 'sad';
type Valor = -1 | 0 | 1;

interface Pergunta {
  id: number;
  categoria: string;
  texto: string;
  tags: string[];
}

interface Partido {
  sigla: string;
  nome: string;
  cor: string;
  tags: string[];
}

interface PartidoComScore extends Partido {
  pct: number;
}

interface Resposta {
  tags: string[];
  valor: Valor;
}

// -----------------------------------------------------------------------------
// MASCOTE — Pipo (imagens, no lugar do SVG antigo do componente Mascote)
// -----------------------------------------------------------------------------
// happy = concordou (coração), neutral = parado/abstenção, sad = discordou
const PIPO_IMAGES: Record<Mood, string> = {
  happy: PipoCoracao,
  neutral: PipoDefault,
  sad: PipoTriste,
};

interface PipoProps {
  mood?: Mood;
  size?: number;
  /** Desliga o flutuar suave — útil pros mascotes pequenos dos cards de resultado. */
  animated?: boolean;
}

function Pipo({ mood = 'neutral', size = 120, animated = true }: PipoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2); // fase aleatória: vários Pipos na tela não boiam em sincronia

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
// DADOS DE DEMONSTRAÇÃO (trocar pela chamada real da API depois)
// -----------------------------------------------------------------------------
const QUESTIONS: Pergunta[] = [
  {
    id: 1,
    categoria: 'Economia',
    texto: 'O Estado deve ter participação ativa em empresas estratégicas?',
    tags: ['intervencionismo', 'estado_forte'],
  },
  {
    id: 2,
    categoria: 'Educação',
    texto:
      'O ensino técnico deveria ter prioridade sobre o ensino superior tradicional?',
    tags: ['educacao_tecnica', 'reforma_educacional'],
  },
  {
    id: 3,
    categoria: 'Saúde',
    texto:
      'A saúde pública deveria receber mais investimento do que incentivos à saúde privada?',
    tags: ['saude_publica', 'intervencionismo'],
  },
  {
    id: 4,
    categoria: 'Segurança',
    texto:
      'As polícias deveriam ter mais autonomia para atuar em operações de risco?',
    tags: ['seguranca_dura', 'ordem'],
  },
  {
    id: 5,
    categoria: 'Meio Ambiente',
    texto:
      'Empresas poluentes deveriam pagar taxas mais altas por seus impactos?',
    tags: ['pauta_ambiental', 'intervencionismo'],
  },
  {
    id: 6,
    categoria: 'Economia',
    texto: 'Os impostos sobre grandes fortunas deveriam aumentar?',
    tags: ['tributacao_progressiva', 'intervencionismo'],
  },
];

const PARTIDOS: Partido[] = [
  {
    sigla: 'PF',
    nome: 'Partido Fuleco',
    cor: '#FF9F1C',
    tags: [
      'intervencionismo',
      'estado_forte',
      'saude_publica',
      'pauta_ambiental',
      'tributacao_progressiva',
    ],
  },
  {
    sigla: 'PA',
    nome: 'Partido Avante',
    cor: '#4C9AFF',
    tags: [
      'educacao_tecnica',
      'reforma_educacional',
      'seguranca_dura',
      'ordem',
    ],
  },
  {
    sigla: 'PC',
    nome: 'Partido Central',
    cor: '#2E2A47',
    tags: ['saude_publica', 'educacao_tecnica', 'ordem'],
  },
];

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

// -----------------------------------------------------------------------------
// LÓGICA DE COMPATIBILIDADE
// -----------------------------------------------------------------------------
function intersection(a: string[], b: string[]): number {
  return a.filter((t) => b.includes(t)).length;
}

function calcularCompatibilidade(respostas: Resposta[]): PartidoComScore[] {
  return PARTIDOS.map((p) => {
    let score = 0;
    let max = 0;
    respostas.forEach(({ tags, valor }) => {
      const m = intersection(tags, p.tags);
      max += m;
      if (valor !== 0) score += valor * m;
    });
    const pct = max === 0 ? 50 : Math.round(((score + max) / (2 * max)) * 100);
    return { ...p, pct };
  }).sort((a, b) => b.pct - a.pct);
}

// -----------------------------------------------------------------------------
// BLOBS DE FUNDO
// -----------------------------------------------------------------------------

interface BlobMotion {
  ampX: number; // amplitude horizontal em px
  ampY: number; // amplitude vertical em px
  speed: number; // velocidade angular (rad/s) — baixo = bem sutil
  phase: number; // deslocamento de fase, pra não ficarem todos sincronizados
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
  onFinish: (respostas: Resposta[]) => void;
}

function QuizScreen({ onFinish }: QuizScreenProps) {
  const [index, setIndex] = useState(0);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState<'like' | 'dislike' | 'neutral' | null>(null);
  const [mood, setMood] = useState<Mood>('neutral');
  const startX = useRef(0);

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const next1 = QUESTIONS[index + 1];
  const next2 = QUESTIONS[index + 2];
  const progress = Math.round((index / total) * 100);

  function commit(valor: Valor, mood: Mood) {
    if (exit) return;
    setMood(mood);
    setExit(valor === 1 ? 'like' : valor === -1 ? 'dislike' : 'neutral');
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
  respostas: Resposta[];
  onRestart: () => void;
}

function ResultScreen({ respostas, onRestart }: ResultScreenProps) {
  const ranking = useMemo(
    () => calcularCompatibilidade(respostas),
    [respostas],
  );
  const [top, second, third] = ranking;
  const [reveal, setReveal] = useState(false);
  const [count, setCount] = useState(0);

  const interesses = useMemo(() => {
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
    if (!reveal) return;
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
  }, [reveal, top.pct]);

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
                    {LABELS[t] || t}
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
              className="w-[180px] h-[180px] rounded-[22px] flex items-center justify-center"
              style={{ background: top.cor }}
            >
              <Pipo mood="happy" size={110} />
            </div>
            <div className="flex gap-[10px]">
              {[second, third].map((p) => (
                <div
                  key={p.sigla}
                  className="w-[83px] h-[83px] rounded-2xl flex flex-col items-center justify-center gap-0.5"
                  style={{ background: p.cor }}
                >
                  <Pipo mood="neutral" size={40} />
                  <span className="text-white font-extrabold text-[15px] [font-family:'Sora',sans-serif]">
                    {p.pct}%
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
  const [view, setView] = useState<View>('intro');
  const [respostas, setRespostas] = useState<Resposta[]>([]);

  function handleStart() {
    setView('quiz');
  }
  function handleFinish(novas: Resposta[]) {
    setRespostas(novas);
    setTimeout(() => setView('result'), 150);
  }
  function handleRestart() {
    setRespostas([]);
    setView('quiz');
  }

  return (
    <section className="w-full h-[100dvh]">
      <div className="w-full fixed top-0 z-[1000]">
        <Header />
      </div>
      <div className="w-full h-full">
        {view === 'intro' && <IntroScreen onStart={handleStart} />}
        {view === 'quiz' && <QuizScreen onFinish={handleFinish} />}
        {view === 'result' && (
          <ResultScreen respostas={respostas} onRestart={handleRestart} />
        )}
      </div>
    </section>
  );
}
