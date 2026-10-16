export interface PaletaPartido {
  cor: string;
  borda: string;
}

const paletasPorSigla: Record<string, PaletaPartido> = {
  AGIR: { cor: '#6a9dde', borda: '#456691' },
  AVANTE: { cor: '#f3854c', borda: '#a65b34' },
  CIDADANIA: { cor: '#ed0277', borda: '#a00150' },
  DC: { cor: '#6161c0', borda: '#3a3a73' },
  DEMOCRATA: { cor: '#103d80', borda: '#061833' },
  MDB: { cor: '#6bcf9b', borda: '#438261' },
  MISSAO: { cor: '#fbc84b', borda: '#ae8b34' },
  MOBILIZA: { cor: '#ffffff', borda: '#b2b2b2' },
  NOVO: { cor: '#f1f1f1', borda: '#a5a5a5' },
  PCB: { cor: '#ff3434', borda: '#b22424' },
  PCDOB: { cor: '#da251c', borda: '#8d1812' },
  PCO: { cor: '#c90b1c', borda: '#7c0611' },
  PDT: { cor: '#27AE60', borda: '#156135' },
  PL: { cor: '#0075eb', borda: '#004e9e' },
  PODE: { cor: '#6fd571', borda: '#478848' },
  PP: { cor: '#a8d6ee', borda: '#7191a1' },
  PRD: { cor: '#d8c35a', borda: '#8b7d3a' },
  PRTB: { cor: '#7ebe6c', borda: '#4b7140' },
  PSB: { cor: '#e34450', borda: '#962d35' },
  PSD: { cor: '#386edc', borda: '#24478f' },
  PSDB: { cor: '#f3bb34', borda: '#a68023' },
  PSOL: { cor: '#953fb5', borda: '#562468' },
  PSTU: { cor: '#ff7979', borda: '#b25454' },
  PT: { cor: '#e4142c', borda: '#970d1d' },
  PV: { cor: '#299329', borda: '#134613' },
  REDE: { cor: '#63b9c2', borda: '#3b7075' },
  REPUBLICANOS: { cor: '#2D9CDB', borda: '#17628D' },
  SOLIDARIEDADE: { cor: '#f39963', borda: '#a66843' },
  UNIAO: { cor: '#fbd64f', borda: '#ae9436' },
  UP: { cor: '#8a8a8a', borda: '#494949' },
};

const paletaPadrao: PaletaPartido = {
  cor: '#eaf6ff',
  borda: '#2A2A72',
};

export function obterPaletaPartido(sigla: string): PaletaPartido {
  const siglaNormalizada = sigla
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  return paletasPorSigla[siglaNormalizada] ?? paletaPadrao;
}
