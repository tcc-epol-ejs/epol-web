import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface BotaoDuvidaProps {
  titulo: string;
  texto?: string;
  children?: ReactNode;
  alinhamento?: 'esquerda' | 'direita';
}

export default function BotaoDuvida({
  titulo,
  texto,
  children,
  alinhamento = 'esquerda',
}: BotaoDuvidaProps) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    function aoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    function aoApertarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') setAberto(false);
    }

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoApertarTecla);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoApertarTecla);
    };
  }, [aberto]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        aria-expanded={aberto}
        aria-label="Ajuda sobre este passo"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFA400] text-lg font-bold text-white shadow transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a2a72]"
      >
        ?
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-label={titulo}
          className={`absolute top-full z-30 mt-2 w-72 rounded-xl border border-[#8888D3] bg-white p-4 shadow-xl sm:w-80 ${
            alinhamento === 'direita' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm font-bold text-[#2a2a72]">{titulo}</h2>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar ajuda"
              className="text-lg leading-none text-[#5A5A70] hover:text-[#2a2a72]"
            >
              ×
            </button>
          </div>

          <div className="mt-2 whitespace-pre-line text-sm leading-5 text-[#1f2a52]">
            {children ?? texto}
          </div>
        </div>
      )}
    </div>
  );
}
