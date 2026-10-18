import { useNavigate } from 'react-router-dom';
import type { Candidato } from '../../services/api';

interface CardBrasilProps {
  candidatos: Candidato[];
}

function BandeiraBrasil() {
  return (
    <svg
      viewBox="0 0 28 20"
      className="h-[16px] w-[22px] rounded-[2px] shadow-sm"
      aria-label="Bandeira do Brasil"
    >
      <rect width="28" height="20" fill="#009C3B" />
      <polygon points="14,2 26,10 14,18 2,10" fill="#FFDF00" />
      <circle cx="14" cy="10" r="4.2" fill="#002776" />
      <path
        d="M9.9 9.4 Q14 8.2 18.1 10.6"
        stroke="#fff"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

const limpar = (texto?: string | null) =>
  (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Reconhece "Presidente", "Presidente da República", "Presidente do Brasil"...
// mas NÃO "Presidente do partido X", "Presidente Nacional" etc.
function ehPresidente(c: Candidato) {
  const cargo = limpar(c.cargo_atual);
  return (
    cargo === 'presidente' ||
    cargo.startsWith('presidente da republica') ||
    cargo.startsWith('presidente do brasil')
  );
}

function ehVicePresidente(c: Candidato) {
  const cargo = limpar(c.cargo_atual);
  return (
    cargo === 'vice-presidente' ||
    cargo === 'vice presidente' ||
    cargo.startsWith('vice-presidente da republica') ||
    cargo.startsWith('vice presidente da republica') ||
    cargo.startsWith('vice-presidente do brasil')
  );
}

function Pessoa({ pessoa, titulo }: { pessoa: Candidato; titulo: string }) {
  const navigate = useNavigate();

  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {titulo}
      </p>
      <button
        onClick={() => navigate(`/candidatos/${pessoa.id}`)}
        className="flex w-full items-center gap-2 text-left transition-opacity hover:opacity-80"
      >
        {pessoa.foto_url && (
          <img
            src={pessoa.foto_url}
            alt={pessoa.nome_politico}
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-xs font-bold text-[#2A2A72]">
            {pessoa.nome_politico}
          </p>
          {pessoa.partidos && (
            <p className="text-[10px] text-gray-500">
              ({pessoa.partidos.sigla})
            </p>
          )}
        </div>
      </button>
    </div>
  );
}

export default function CardBrasil({ candidatos }: CardBrasilProps) {
  const presidente = candidatos.find(ehPresidente) ?? null;
  const vice = candidatos.find(ehVicePresidente) ?? null;

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center gap-2">
        <BandeiraBrasil />
        <p className="text-sm font-black uppercase tracking-wide text-[#2A2A72]">
          Brasil
        </p>
      </div>

      {presidente && <Pessoa pessoa={presidente} titulo="Presidente" />}
      {vice && <Pessoa pessoa={vice} titulo="Vice-Presidente" />}

      {!presidente && !vice && (
        <p className="text-xs text-gray-400">Nenhum dado cadastrado.</p>
      )}
    </div>
  );
}
