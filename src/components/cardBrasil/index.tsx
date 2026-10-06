import { useNavigate } from 'react-router-dom';
import type { Candidato } from '../../services/api';

interface CardBrasilProps {
  candidatos: Candidato[];
}

export default function CardBrasil({ candidatos }: CardBrasilProps) {
  const navigate = useNavigate();

  const presidentes = candidatos.filter((c) => c.candidatura === 'Presidente');
  const presidente =
    presidentes.find(
      (c) =>
        c.cargo_atual.toLowerCase().includes('presidente') &&
        !c.cargo_atual.toLowerCase().includes('vice'),
    ) ??
    presidentes[0] ??
    null;

  const vice =
    presidentes.find((c) => c.cargo_atual.toLowerCase().includes('vice')) ??
    null;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🇧🇷</span>
        <p className="font-black text-[#2A2A72] uppercase text-sm tracking-wide">
          Brasil
        </p>
      </div>

      {presidente && (
        <div className="mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Presidente
          </p>
          <button
            onClick={() => navigate(`/candidatos/${presidente.id}`)}
            className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity"
          >
            {presidente.foto_url && (
              <img
                src={presidente.foto_url}
                alt={presidente.nome_politico}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div>
              <p className="text-xs font-bold text-[#2A2A72]">
                {presidente.nome_politico}
              </p>
              {presidente.partidos && (
                <p className="text-[10px] text-gray-500">
                  ({presidente.partidos.sigla})
                </p>
              )}
            </div>
          </button>
        </div>
      )}

      {vice && (
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Vice-Presidente
          </p>
          <button
            onClick={() => navigate(`/candidatos/${vice.id}`)}
            className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity"
          >
            {vice.foto_url && (
              <img
                src={vice.foto_url}
                alt={vice.nome_politico}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div>
              <p className="text-xs font-bold text-[#2A2A72]">
                {vice.nome_politico}
              </p>
              {vice.partidos && (
                <p className="text-[10px] text-gray-500">
                  ({vice.partidos.sigla})
                </p>
              )}
            </div>
          </button>
        </div>
      )}

      {!presidente && !vice && (
        <p className="text-xs text-gray-400">Nenhum dado cadastrado.</p>
      )}
    </div>
  );
}
