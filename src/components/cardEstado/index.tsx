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
    <div className="w-full max-w-[285px] rounded-[14px] bg-white px-4 py-3 shadow-[0_5px_15px_rgba(0,0,0,0.15)]">
      {/* CABEÇALHO */}
      <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
        <BandeiraEstado sigla={sigla} className="h-[26px] w-[38px] shrink-0" />

        <div className="leading-none">
          <p className="text-[13px] font-black uppercase text-[#2A2A72]">
            {nomeEstado}
          </p>

          <p className="mt-[2px] text-[10px] font-bold text-gray-400">
            {sigla}
          </p>
        </div>
      </div>

      {/* CIDADE */}
      <div className="mb-3">
        <p className="mb-1 text-[8px] font-extrabold uppercase tracking-wide text-[#555]">
          Cidade
        </p>

        <select
          defaultValue=""
          className="h-[27px] w-full rounded-[6px] border border-gray-200 bg-[#F7F7F7] px-2 text-[9px] font-semibold text-[#555] outline-none"
        >
          <option value="" disabled>
            Selecione uma cidade
          </option>

          <option value="capital">Capital</option>
        </select>
      </div>

      {/* GOVERNADOR */}
      <div className="mb-3">
        <p className="mb-1 text-[8px] font-extrabold uppercase tracking-wide text-[#555]">
          Governador(a):
        </p>

        {governador ? (
          <button
            type="button"
            onClick={() => navigate(`/candidatos/${governador.id}`)}
            className="flex w-full items-center gap-2 text-left"
          >
            {governador.foto_url ? (
              <img
                src={governador.foto_url}
                alt={governador.nome_politico}
                className="h-[38px] w-[38px] shrink-0 rounded-[5px] object-cover"
              />
            ) : (
              <div className="h-[38px] w-[38px] shrink-0 rounded-[5px] bg-gray-200" />
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-black leading-tight text-[#2A2A72]">
                {governador.nome_politico}
              </p>

              {governador.partidos && (
                <p className="mt-[2px] text-[8px] font-semibold text-gray-400">
                  {governador.partidos.sigla}
                </p>
              )}
            </div>
          </button>
        ) : (
          <div className="flex items-center justify-end">
            <p className="text-right text-[9px] font-bold text-gray-400">
              Informação em breve
            </p>
          </div>
        )}
      </div>

      {/* VICE GOVERNADOR */}
      <div className="mb-3">
        <p className="mb-1 text-[8px] font-extrabold uppercase tracking-wide text-[#555]">
          Vice-Governador(a):
        </p>

        <div className="flex items-center justify-end">
          {governador?.vice ? (
            <p className="max-w-[190px] text-right text-[9px] font-bold leading-tight text-[#2A2A72]">
              {governador.vice}
            </p>
          ) : (
            <p className="text-right text-[9px] font-bold text-gray-400">
              {VICE_VAGO.has(sigla) ? 'Cargo vago' : 'Informação em breve'}
            </p>
          )}
        </div>
      </div>

      {/* PREFEITO */}
      <div className="mb-3">
        <p className="mb-1 text-[8px] font-extrabold uppercase tracking-wide text-[#555]">
          Prefeito(a):
        </p>

        <div className="flex items-center justify-end">
          <p className="text-right text-[9px] font-bold text-gray-400">
            Informação em breve
          </p>
        </div>
      </div>

      {/* VICE-PREFEITO */}
      <div>
        <p className="mb-1 text-[8px] font-extrabold uppercase tracking-wide text-[#555]">
          Vice-Prefeito(a):
        </p>

        <div className="flex items-center justify-end">
          <p className="text-right text-[9px] font-bold text-gray-400">
            Informação em breve
          </p>
        </div>
      </div>
    </div>
  );
}
