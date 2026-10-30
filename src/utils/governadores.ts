import type { Candidato } from '../services/api';

// Tira acentos, deixa minúsculo e remove espaços das pontas
export const limpar = (texto?: string | null) =>
  (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Aceita "Governador" e "Governadora"
export const candidatoAGovernador = (c: Candidato) =>
  limpar(String(c.candidatura)).startsWith('governador');

// Quem ocupa o governo hoje: "Governador do...", "Governadora de...", "Governador Interino"
// (não pega "Ex-Governador" nem "Não ocupa cargo")
export const ocupaGoverno = (c: Candidato) =>
  limpar(c.cargo_atual).startsWith('governador');

export function acharGovernador(
  candidatos: Candidato[],
  sigla: string,
): Candidato | null {
  return (
    candidatos.find(
      (c) =>
        candidatoAGovernador(c) &&
        c.uf_candidatura === sigla &&
        ocupaGoverno(c),
    ) ?? null
  );
}

// Estados onde o cargo de vice-governador está vago em 2026
// (o vice assumiu o governo, ou o cargo já estava vago)
export const VICE_VAGO = new Set([
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

export const REGIOES = [
  {
    id: 'norte',
    nome: 'Norte',
    ufs: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  },
  {
    id: 'nordeste',
    nome: 'Nordeste',
    ufs: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  },
  { id: 'centro-oeste', nome: 'Centro-Oeste', ufs: ['DF', 'GO', 'MT', 'MS'] },
  { id: 'sudeste', nome: 'Sudeste', ufs: ['ES', 'MG', 'RJ', 'SP'] },
  { id: 'sul', nome: 'Sul', ufs: ['PR', 'RS', 'SC'] },
] as const;
