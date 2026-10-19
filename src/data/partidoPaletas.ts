export interface PaletaPartido {
  cor: string;
  borda: string;
  corDivisoriaSecao?: string;
  corBolhasFundo?: string;
  corFundoTela: string;
  corFundoCabecalho: string;
  corTextoCabecalho: string;
  corTextoBotaoVoltar: string;
}

const paletasPorSigla: Record<string, PaletaPartido> = {
  AGIR: {
    cor: '#2670cb',
    borda: '#17457e',
    corFundoTela: '#edf3fb',
    corFundoCabecalho: '#17457e',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#17457e',
  },
  AVANTE: {
    cor: '#f36318',
    borda: '#a64310',
    corFundoTela: '#fef0ea',
    corFundoCabecalho: '#a64310',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#a64310',
  },
  CIDADANIA: {
    cor: '#ed0277',
    borda: '#a00150',
    corFundoTela: '#fde1ef',
    corFundoCabecalho: '#a00150',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#a00150',
  },
  DC: {
    cor: '#6161c0',
    borda: '#3a3a73',
    corFundoTela: '#ececf7',
    corFundoCabecalho: '#3a3a73',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#3a3a73',
  },
  DEMOCRATA: {
    cor: '#103d80',
    borda: '#061833',
    corFundoTela: '#e2e8f0',
    corFundoCabecalho: '#061833',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#061833',
  },
  MDB: {
    cor: '#009649',
    borda: '#004923',
    corFundoTela: '#edf9f3',
    corFundoCabecalho: '#004923',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#004923',
  },
  MISSAO: {
    cor: '#fbbd24',
    borda: '#ae8319',
    corFundoTela: '#fff8e9',
    corFundoCabecalho: '#000000',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#ae8319',
  },
  MOBILIZA: {
    cor: '#ffffff',
    borda: '#ed1c24',
    corDivisoriaSecao: '#ed1c24',
    corBolhasFundo: '#ed1c24',
    corFundoTela: '#ffffff',
    corFundoCabecalho: '#000000',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#ed1c24',
  },
  NOVO: {
    cor: '#f1f1f1',
    borda: '#a4a4a4',
    corBolhasFundo: '#ff6500',
    corFundoTela: '#fdfdfd',
    corFundoCabecalho: '#ff6500',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#ff6500',
  },
  PCB: {
    cor: '#ff3434',
    borda: '#b22424',
    corFundoTela: '#ffe7e7',
    corFundoCabecalho: '#b22424',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#b22424',
  },
  PCDOB: {
    cor: '#da251c',
    borda: '#8d1812',
    corFundoTela: '#fbe5e4',
    corFundoCabecalho: '#8d1812',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#8d1812',
  },
  PCO: {
    cor: '#c90b1c',
    borda: '#7c0611',
    corFundoTela: '#f9e2e4',
    corFundoCabecalho: '#7c0611',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#7c0611',
  },
  PDT: {
    cor: '#27AE60',
    borda: '#156135',
    corFundoTela: '#e5f5ec',
    corFundoCabecalho: '#156135',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#156135',
  },
  PL: {
    cor: '#004f9f',
    borda: '#002852',
    corFundoTela: '#e0eefd',
    corFundoCabecalho: '#002852',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#002852',
  },
  PODE: {
    cor: '#3ab73d',
    borda: '#216a23',
    corFundoTela: '#eefaee',
    corFundoCabecalho: '#216a23',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#216a23',
  },
  PP: {
    cor: '#a8d6ee',
    borda: '#7191a1',
    corFundoTela: '#f5fafd',
    corFundoCabecalho: '#7191a1',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#7191a1',
  },
  PRD: {
    cor: '#f6d73b',
    borda: '#a99428',
    corFundoTela: '#faf8eb',
    corFundoCabecalho: '#a99428',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#a99428',
  },
  PRTB: {
    cor: '#4dad32',
    borda: '#2a601b',
    corFundoTela: '#f0f7ed',
    corFundoCabecalho: '#2a601b',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#2a601b',
  },
  PSB: {
    cor: '#e30414',
    borda: '#96020d',
    corFundoTela: '#fce9ea',
    corFundoCabecalho: '#96020d',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#96020d',
  },
  PSD: {
    cor: '#254890',
    borda: '#112143',
    corFundoTela: '#e7eefb',
    corFundoCabecalho: '#112143',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#112143',
  },
  PSDB: {
    cor: '#f3bb34',
    borda: '#a68023',
    corFundoTela: '#fef7e7',
    corFundoCabecalho: '#a68023',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#a68023',
  },
  PSOL: {
    cor: '#68008e',
    borda: '#2f0041',
    corFundoTela: '#f2e8f6',
    corFundoCabecalho: '#2f0041',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#2f0041',
  },
  PSTU: {
    cor: '#ff7979',
    borda: '#b25454',
    corFundoTela: '#ffefef',
    corFundoCabecalho: '#b25454',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#b25454',
  },
  PT: {
    cor: '#e4142c',
    borda: '#970d1d',
    corFundoTela: '#fce3e6',
    corFundoCabecalho: '#970d1d',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#970d1d',
  },
  PV: {
    cor: '#006600',
    borda: '#001900',
    corFundoTela: '#e5f2e5',
    corFundoCabecalho: '#001900',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#001900',
  },
  REDE: {
    cor: '#63b9c2',
    borda: '#3b7075',
    corFundoTela: '#ecf7f8',
    corFundoCabecalho: '#3b7075',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#3b7075',
  },
  REPUBLICANOS: {
    cor: '#005ca9',
    borda: '#00325c',
    corFundoTela: '#e6f3fb',
    corFundoCabecalho: '#00325c',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#00325c',
  },
  SOLIDARIEDADE: {
    cor: '#f37021',
    borda: '#a64c16',
    corFundoTela: '#fef3ec',
    corFundoCabecalho: '#a64c16',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#a64c16',
  },
  UNIAO: {
    cor: '#fbc707',
    borda: '#ae8a04',
    corFundoTela: '#fffaea',
    corFundoCabecalho: '#ae8a04',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#ae8a04',
  },
  UP: {
    cor: '#4c4c4c',
    borda: '#181818',
    corFundoTela: '#f1f1f1',
    corFundoCabecalho: '#181818',
    corTextoCabecalho: '#ffffff',
    corTextoBotaoVoltar: '#181818',
  },
};

const paletaPadrao: PaletaPartido = {
  cor: '#eaf6ff',
  borda: '#2A2A72',
  corFundoTela: '#eaf6ff',
  corFundoCabecalho: '#2A2A72',
  corTextoCabecalho: '#ffffff',
  corTextoBotaoVoltar: '#2A2A72',
};

function normalizarIdentificadorPartido(identificador: string): string {
  return identificador
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '');
}

export function obterPaletaPartido(
  sigla: string,
  nomeCompleto = '',
): PaletaPartido {
  const identificadores = [sigla, nomeCompleto].map(
    normalizarIdentificadorPartido,
  );

  if (
    identificadores.some(
      (identificador) =>
        identificador === 'PMN' || identificador.includes('MOBILIZA'),
    )
  ) {
    return paletasPorSigla.MOBILIZA;
  }

  for (const identificador of identificadores) {
    const paleta = paletasPorSigla[identificador];
    if (paleta) return paleta;
  }

  return paletaPadrao;
}
