import { useNavigate } from 'react-router-dom';
import type { Candidato } from '../../services/api';
import BandeiraEstado from '../bandeiraEstado';

interface CardEstadoProps {
  nomeEstado: string;
  sigla: string;
  candidatos: Candidato[];
}

const limpar = (texto?: string | null) =>
  (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Aceita "Governador" e "Governadora"
const candidatoAGovernador = (c: Candidato) =>
  limpar(String(c.candidatura)).startsWith('governador');

// Quem ocupa o governo hoje: "Governador do...", "Governadora de...", "Governador Interino"
// (não pega "Ex-Governador" nem "Não ocupa cargo")
const ocupaGoverno = (c: Candidato) =>
  limpar(c.cargo_atual).startsWith('governador');

// Estados onde o cargo de vice-governador está vago em 2026
// (o vice assumiu o governo, ou o cargo já estava vago)
const VICE_VAGO = new Set([
  'DF',
  'ES',
  'GO',
  'MT',
  'MG',
  'PA',
  'PB',
  'AC',
  'RR',
  'RJ',
]);

export default function CardEstado({
  nomeEstado,
  sigla,
  candidatos,
}: CardEstadoProps) {
  const navigate = useNavigate();

  const governador =
    candidatos.find(
      (c) =>
        candidatoAGovernador(c) &&
        c.uf_candidatura === sigla &&
        ocupaGoverno(c),
    ) ?? null;

  return (
    <div className="w-full min-w-0 max-w-[340px] rounded-[16px] bg-white px-4 py-5 shadow-[0_5px_15px_rgba(0,0,0,0.15)] sm:px-6">
      <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
        <BandeiraEstado sigla={sigla} className="h-[34px] w-[50px] shrink-0" />

        <div className="min-w-0 leading-none">
          <p className="text-[17px] font-black uppercase text-[#2A2A72] [overflow-wrap:anywhere]">
            {nomeEstado}
          </p>
          <p className="mt-[3px] text-[12px] font-bold text-gray-400">
            {sigla}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wide text-[#555]">
          Governador(a):
        </p>

        {governador ? (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/pagina_politico?id=${encodeURIComponent(governador.id)}`,
                { state: { voltarPara: '/visualizador' } },
              )
            }
            aria-label={`Ver perfil de ${governador.nome_politico}`}
            className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-80"
          >
            {governador.foto_url ? (
              <img
                src={governador.foto_url}
                alt={governador.nome_politico}
                className="h-[56px] w-[56px] shrink-0 rounded-[7px] object-cover"
              />
            ) : (
              <div className="h-[56px] w-[56px] shrink-0 rounded-[7px] bg-gray-200" />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-black leading-tight text-[#2A2A72] [overflow-wrap:anywhere] xl:truncate">
                {governador.nome_politico}
              </p>

              {governador.partidos && (
                <p className="mt-[3px] text-[11px] font-semibold text-gray-400">
                  {governador.partidos.sigla}
                </p>
              )}
            </div>
          </button>
        ) : (
          <div className="flex items-center justify-end">
            <p className="text-right text-[12px] font-bold text-gray-400">
              Informação em breve
            </p>
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wide text-[#555]">
          Vice-Governador(a):
        </p>

        <div className="flex items-center justify-end">
          {governador?.vice ? (
            <p className="min-w-0 max-w-[240px] text-right text-[12px] font-bold leading-tight text-[#2A2A72] [overflow-wrap:anywhere]">
              {governador.vice}
            </p>
          ) : (
            <p className="text-right text-[12px] font-bold text-gray-400">
              {VICE_VAGO.has(sigla) ? 'Cargo vago' : 'Informação em breve'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
