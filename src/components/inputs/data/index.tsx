import { useEffect, useRef, useState } from 'react';

const NOMES_MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function toISODate(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function parseISODate(iso: string): Date | null {
  if (!iso) return null;
  const [ano, mes, dia] = iso.split('-').map(Number);
  if (!ano || !mes || !dia) return null;
  return new Date(ano, mes - 1, dia);
}

function formatarDataExibicao(iso: string): string {
  const data = parseISODate(iso);
  if (!data) return '';
  return `${String(data.getDate()).padStart(2, '0')}/${String(
    data.getMonth() + 1,
  ).padStart(2, '0')}/${data.getFullYear()}`;
}

export interface DateFieldProps {
  value: string;
  onChange: (isoDate: string) => void;
  placeholder?: string;
  /** Cor do dia selecionado / destaque principal */
  corDestaque?: string;
  /** Cor do texto, ícones e setas de navegação */
  corTexto?: string;
  /** Fundo do botão fechado (campo em si) */
  corFundoCampo?: string;
  /** Borda do botão fechado */
  corBordaCampo?: string;
  /** Cor do placeholder (quando vazio) */
  corPlaceholder?: string;
  /** Fundo do painel do calendário aberto */
  corFundoPainel?: string;
  /** Borda do painel do calendário aberto */
  corBordaPainel?: string;
  /** Cor de fundo no hover dos dias/anos */
  corHover?: string;
}

export default function DateField({
  value,
  onChange,
  placeholder = '',
  corDestaque = '#FFA400',
  corTexto = '#2a2a72',
  corFundoCampo = '#a9a9f6',
  corBordaCampo = '#a9a9f6',
  corPlaceholder = '#5A5A70',
  corFundoPainel = '#A9A9F6',
  corBordaPainel = '#8888D3',
  corHover = '#CBCBFF',
}: DateFieldProps) {
  const [aberto, setAberto] = useState(false);
  // 'dias' = calendário normal | 'anos' = grade rápida de anos (para pular décadas)
  const [visualizacao, setVisualizacao] = useState<'dias' | 'anos'>('dias');
  const dataSelecionada = parseISODate(value);
  const hoje = new Date();
  const [dataVisualizada, setDataVisualizada] = useState<Date>(
    dataSelecionada ?? new Date(hoje.getFullYear() - 18, hoje.getMonth(), 1),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function aoClicarFora(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setAberto(false);
        setVisualizacao('dias');
      }
    }
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, []);

  function alternarAberto() {
    setAberto((prev) => {
      const novoEstado = !prev;
      if (!novoEstado) setVisualizacao('dias');
      return novoEstado;
    });
  }

  const ano = dataVisualizada.getFullYear();
  const mes = dataVisualizada.getMonth();
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const celulas: (number | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from({ length: totalDiasMes }, (_, i) => i + 1),
  ];

  const inicioIntervaloAnos = Math.floor(ano / 12) * 12;
  const anosDoIntervalo = Array.from(
    { length: 12 },
    (_, i) => inicioIntervaloAnos + i,
  );

  function mudarMes(delta: number) {
    setDataVisualizada(new Date(ano, mes + delta, 1));
  }

  function mudarAno(delta: number) {
    setDataVisualizada(new Date(ano + delta, mes, 1));
  }

  function mudarIntervaloAnos(delta: number) {
    setDataVisualizada(new Date(ano + delta * 12, mes, 1));
  }

  function selecionarAno(anoEscolhido: number) {
    setDataVisualizada(new Date(anoEscolhido, mes, 1));
    setVisualizacao('dias');
  }

  function selecionarDia(dia: number) {
    onChange(toISODate(new Date(ano, mes, dia)));
    setAberto(false);
    setVisualizacao('dias');
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={alternarAberto}
        className="w-full flex items-center justify-between rounded-full border px-4 py-2.5 font-medium text-sm outline-none transition-all duration-300 focus:brightness-[1.05]"
        style={{ backgroundColor: corFundoCampo, borderColor: corBordaCampo }}
      >
        <span style={{ color: value ? corTexto : corPlaceholder }}>
          {value ? formatarDataExibicao(value) : placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={corTexto}
          strokeWidth={2}
          className="w-4 h-4 flex-shrink-0"
        >
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {aberto && (
        <div
          className="absolute z-50 top-full left-0 mt-2 w-full min-w-[240px] rounded-2xl border p-3 shadow-xl"
          style={{
            backgroundColor: corFundoPainel,
            borderColor: corBordaPainel,
          }}
        >
          {visualizacao === 'dias' ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => mudarAno(-1)}
                    aria-label="Ano anterior"
                    className="px-1 transition-colors"
                    style={{ color: corTexto }}
                  >
                    «
                  </button>
                  <button
                    type="button"
                    onClick={() => mudarMes(-1)}
                    aria-label="Mês anterior"
                    className="px-1 transition-colors"
                    style={{ color: corTexto }}
                  >
                    ‹
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setVisualizacao('anos')}
                  className="text-xs font-semibold capitalize transition-colors"
                  style={{ color: corTexto }}
                >
                  {NOMES_MESES[mes]} {ano}
                </button>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => mudarMes(1)}
                    aria-label="Próximo mês"
                    className="px-1 transition-colors"
                    style={{ color: corTexto }}
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    onClick={() => mudarAno(1)}
                    aria-label="Próximo ano"
                    className="px-1 transition-colors"
                    style={{ color: corTexto }}
                  >
                    »
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {celulas.map((dia, idx) => {
                  if (dia === null) return <span key={`vazio-${idx}`} />;

                  const selecionado =
                    dataSelecionada &&
                    dataSelecionada.getFullYear() === ano &&
                    dataSelecionada.getMonth() === mes &&
                    dataSelecionada.getDate() === dia;

                  const ehHoje =
                    hoje.getFullYear() === ano &&
                    hoje.getMonth() === mes &&
                    hoje.getDate() === dia;

                  return (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => selecionarDia(dia)}
                      className="w-7 h-7 rounded-full text-xs flex items-center justify-center transition-colors font-medium"
                      style={
                        selecionado
                          ? {
                              backgroundColor: corDestaque,
                              color: '#ffffff',
                              fontWeight: 600,
                            }
                          : ehHoje
                            ? {
                                border: `1px solid ${corDestaque}`,
                                color: corTexto,
                              }
                            : { color: corTexto }
                      }
                      onMouseEnter={(e) => {
                        if (!selecionado)
                          e.currentTarget.style.backgroundColor = `${corHover}60`;
                      }}
                      onMouseLeave={(e) => {
                        if (!selecionado)
                          e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => mudarIntervaloAnos(-1)}
                  aria-label="Década anterior"
                  className="px-1 transition-colors"
                  style={{ color: corTexto }}
                >
                  «
                </button>
                <span
                  className="text-xs font-semibold"
                  style={{ color: corTexto }}
                >
                  {anosDoIntervalo[0]} – {anosDoIntervalo[11]}
                </span>
                <button
                  type="button"
                  onClick={() => mudarIntervaloAnos(1)}
                  aria-label="Próxima década"
                  className="px-1 transition-colors"
                  style={{ color: corTexto }}
                >
                  »
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {anosDoIntervalo.map((anoOpcao) => (
                  <button
                    key={anoOpcao}
                    type="button"
                    onClick={() => selecionarAno(anoOpcao)}
                    className="py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={
                      anoOpcao === ano
                        ? {
                            backgroundColor: corDestaque,
                            color: '#ffffff',
                            fontWeight: 600,
                          }
                        : { color: corTexto }
                    }
                    onMouseEnter={(e) => {
                      if (anoOpcao !== ano)
                        e.currentTarget.style.backgroundColor = `${corHover}60`;
                    }}
                    onMouseLeave={(e) => {
                      if (anoOpcao !== ano)
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {anoOpcao}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
