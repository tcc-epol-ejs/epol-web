import { useState } from 'react';

interface BandeiraEstadoProps {
  sigla: string;
  className?: string;
}

// Mostra a bandeira do estado (public/bandeiras/xx.svg).
// Se o arquivo não existir, cai de volta para o quadradinho azul com a sigla.
export default function BandeiraEstado({
  sigla,
  className = '',
}: BandeiraEstadoProps) {
  const [falhou, setFalhou] = useState<string | null>(null);

  if (falhou === sigla) {
    return (
      <div
        className={`flex items-center justify-center rounded-[4px] bg-[#2A2A72] text-[9px] font-black text-white ${className}`}
      >
        {sigla}
      </div>
    );
  }

  return (
    <img
      src={`/bandeiras/${sigla.toLowerCase()}.svg`}
      alt={`Bandeira de ${sigla}`}
      onError={() => setFalhou(sigla)}
      className={`rounded-[3px] border border-gray-200 bg-white object-contain ${className}`}
    />
  );
}
