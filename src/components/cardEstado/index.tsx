import { useNavigate } from 'react-router-dom';
import type { Candidato } from '../../services/api';

interface CardEstadoProps {
  nomeEstado: string;
  sigla: string;
  candidatos: Candidato[];
}

export default function CardEstado({
  nomeEstado,
  sigla,
  candidatos,
}: CardEstadoProps) {
  const navigate = useNavigate();

  const governador = candidatos.find(
    (c) => c.candidatura === 'Governador' && c.uf_candidatura === sigla,
  );

  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg w-full max-w-[260px]">
      <div className="flex items-center gap-2 mb-3">
        {governador?.partidos?.bandeira_url && (
          <img
            src={governador.partidos.bandeira_url}
            alt=""
            className="w-6 h-6 rounded-full object-cover"
          />
        )}
        <p className="font-black text-[#2A2A72] uppercase text-sm tracking-wide">
          {nomeEstado} ({sigla})
        </p>
      </div>

      {governador ? (
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Governador(a)
          </p>
          <button
            onClick={() => navigate(`/candidatos/${governador.id}`)}
            className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity"
          >
            {governador.foto_url && (
              <img
                src={governador.foto_url}
                alt={governador.nome_politico}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div>
              <p className="text-xs font-bold text-[#2A2A72]">
                {governador.nome_politico}
              </p>
              {governador.partidos && (
                <p className="text-[10px] text-gray-500">
                  ({governador.partidos.sigla})
                </p>
              )}
            </div>
          </button>

          {governador.vice && (
            <div className="mt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Vice-Governador(a)
              </p>
              <p className="text-xs text-[#2A2A72] font-semibold">
                {governador.vice}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400">Nenhum governador cadastrado.</p>
      )}
    </div>
  );
}
