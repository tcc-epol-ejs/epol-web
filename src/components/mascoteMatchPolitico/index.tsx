import { useEffect, useRef } from 'react';

type Mood = 'neutral' | 'happy' | 'sad';

interface MascoteProps {
  mood?: Mood;
  color?: string;
  size?: number;
  /** Desliga as animações (flutuar/piscar) — útil pra mascotes pequenos em cards/listas. */
  animated?: boolean;
}

// Escurece (percent negativo) ou clareia (percent positivo) uma cor hex.
// Usado pra derivar o tom das pernas/pés a partir da cor do corpo, em vez de
// cravar um cinza fixo — assim funciona bem com qualquer cor de partido.
function shadeColor(hex: string, percent: number): string {
  const clean = hex.replace('#', '');
  const num = parseInt(
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean,
    16,
  );
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

const EYES: Record<Mood, string> = {
  neutral: 'M35,35 h6 M59,35 h6',
  happy: 'M33,33 q4,-6 8,0 M57,33 q4,-6 8,0',
  sad: 'M33,37 q4,6 8,0 M57,37 q4,6 8,0',
};
const MOUTH: Record<Mood, string> = {
  neutral: 'M42,50 h16',
  happy: 'M40,48 q10,10 20,0',
  sad: 'M40,54 q10,-10 20,0',
};

function Mascote({
  mood = 'neutral',
  color = '#8B84D6',
  size = 120,
  animated = true,
}: MascoteProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2); // fase aleatória: vários mascotes na tela não boiam em sincronia

  // Flutuar suave (respiração), leve, sem re-render — mexe direto no transform do wrapper
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

  const legColor = shadeColor(color, -20);
  const footColor = shadeColor(color, -28);

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
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* sombra de contato */}
        <ellipse cx="50" cy="95" rx="24" ry="3.5" fill="#000" opacity="0.1" />

        {/* pés */}
        <rect x="31" y="82" width="18" height="8" rx="4" fill={footColor} />
        <rect x="51" y="82" width="18" height="8" rx="4" fill={footColor} />

        {/* pernas — curtas, tipo "pill" */}
        <rect x="34" y="68" width="12" height="18" rx="6" fill={legColor} />
        <rect x="54" y="68" width="12" height="18" rx="6" fill={legColor} />

        {/* corpo — proporção tipo emblema/badge, bem arredondado */}
        <rect x="10" y="6" width="80" height="66" rx="20" fill={color} />
        <ellipse cx="35" cy="24" rx="22" ry="14" fill="#fff" opacity="0.12" />

        {/* rosto */}
        <path
          d={EYES[mood]}
          stroke="#1B1B3A"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d={MOUTH[mood]}
          stroke="#1B1B3A"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default Mascote;
