import { useMemo, useState } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';

import Header from '../../components/header';
import Brazil from '@react-map/brazil';

interface Estado {
  id: string;
  nome: string;
  sigla: string;
}

const ESTADOS: Estado[] = [
  { id: 'AC', nome: 'Acre', sigla: 'AC' },
  { id: 'AL', nome: 'Alagoas', sigla: 'AL' },
  { id: 'AP', nome: 'Amapá', sigla: 'AP' },
  { id: 'AM', nome: 'Amazonas', sigla: 'AM' },
  { id: 'BA', nome: 'Bahia', sigla: 'BA' },
  { id: 'CE', nome: 'Ceará', sigla: 'CE' },
  { id: 'DF', nome: 'Distrito Federal', sigla: 'DF' },
  { id: 'ES', nome: 'Espírito Santo', sigla: 'ES' },
  { id: 'GO', nome: 'Goiás', sigla: 'GO' },
  { id: 'MA', nome: 'Maranhão', sigla: 'MA' },
  { id: 'MT', nome: 'Mato Grosso', sigla: 'MT' },
  { id: 'MS', nome: 'Mato Grosso do Sul', sigla: 'MS' },
  { id: 'MG', nome: 'Minas Gerais', sigla: 'MG' },
  { id: 'PA', nome: 'Pará', sigla: 'PA' },
  { id: 'PB', nome: 'Paraíba', sigla: 'PB' },
  { id: 'PR', nome: 'Paraná', sigla: 'PR' },
  { id: 'PE', nome: 'Pernambuco', sigla: 'PE' },
  { id: 'PI', nome: 'Piauí', sigla: 'PI' },
  { id: 'RJ', nome: 'Rio de Janeiro', sigla: 'RJ' },
  { id: 'RN', nome: 'Rio Grande do Norte', sigla: 'RN' },
  { id: 'RS', nome: 'Rio Grande do Sul', sigla: 'RS' },
  { id: 'RO', nome: 'Rondônia', sigla: 'RO' },
  { id: 'RR', nome: 'Roraima', sigla: 'RR' },
  { id: 'SC', nome: 'Santa Catarina', sigla: 'SC' },
  { id: 'SP', nome: 'São Paulo', sigla: 'SP' },
  { id: 'SE', nome: 'Sergipe', sigla: 'SE' },
  { id: 'TO', nome: 'Tocantins', sigla: 'TO' },
];

export default function VisualizadorGeografico() {
  const [estadoHover, setEstadoHover] = useState<string | null>(null);
  const [pesquisa, setPesquisa] = useState('');

  const estadoEncontrado = useMemo(() => {
    const valor = pesquisa.trim().toLowerCase();
    if (!valor) return null;
    return (
      ESTADOS.find(
        (estado) =>
          estado.nome.toLowerCase().includes(valor) ||
          estado.sigla.toLowerCase() === valor,
      ) ?? null
    );
  }, [pesquisa]);

  const estadoAtual =
    estadoEncontrado ??
    ESTADOS.find(
      (estado) =>
        estado.nome === estadoHover ||
        estado.sigla === estadoHover ||
        estado.id === estadoHover,
    ) ??
    null;

  function obterEstadoDoMapa(event: React.MouseEvent<SVGPathElement>) {
    const target = event.currentTarget;
    const id =
      target.getAttribute('id') ??
      target.getAttribute('name') ??
      target.getAttribute('data-id');
    if (!id) return;
    setEstadoHover(id);
  }

  function limparEstado() {
    if (!pesquisa) {
      setEstadoHover(null);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#FFA400] overflow-hidden">
      <style>{`
        .epol-map {
          width: 100%;
          max-width: 620px;
          height: auto;
          display: block;
          overflow: visible;
        }

        .epol-map path {
          fill: #D5D5D5;
          stroke: #B4B4B4;
          stroke-width: 1.2;
          cursor: pointer;
          transition:
            fill 0.2s ease,
            transform 0.2s ease,
            filter 0.2s ease;
          transform-box: fill-box;
          transform-origin: center;
        }

        .epol-map path:hover {
          fill: #2A82D7;
          filter: brightness(1.05);
        }
      `}</style>

      {/* HEADER */}
      <div className="fixed top-0 left-0 z-[1000] w-full">
        <Header isBgWhite />
      </div>

      {/* CONTEÚDO */}
      <section className="min-h-screen w-full px-6 pb-10 pt-[155px] md:px-10 lg:px-[65px]">
        <div className="mx-auto grid min-h-[calc(100vh-155px)] w-full max-w-[1600px] grid-cols-1 gap-8 lg:grid-cols-[250px_minmax(420px,1fr)_300px]">
          {/* ESQUERDA */}
          <div className="flex flex-col justify-center">
            <div className="select-none">
              <h1 className="font-[Fraunces] text-[43px] font-black italic uppercase leading-[0.95] tracking-[-0.03em] text-[#2A2A72] md:text-[48px]">
                Visualizador
              </h1>
              <h2 className="mt-1 text-[28px] font-black uppercase leading-none tracking-wide text-[#2A2A72]">
                Geográfico
              </h2>
            </div>

            <div className="mt-8 min-h-[220px]">
              {estadoAtual && (
                <div className="rounded-2xl border border-[#2A2A72]/10 bg-[#FFA400] p-1">
                  {/* Espaço reservado para o futuro componente */}
                </div>
              )}
            </div>
          </div>

          {/* MAPA */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[620px]">
              <div
                className="epol-map w-full max-w-[620px]"
                onMouseOver={
                  obterEstadoDoMapa as unknown as React.MouseEventHandler<HTMLDivElement>
                }
                onMouseOut={limparEstado}
              >
                <Brazil type="select-single" />
              </div>
            </div>
          </div>

          {/* DIREITA */}
          <div className="flex flex-col justify-center gap-7">
            <div className="w-full">
              <div className="flex h-[48px] items-center gap-3 rounded-full bg-[#FFFBF2] px-4 shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
                <FiSearch size={20} className="shrink-0 text-[#888]" />
                <input
                  type="text"
                  value={pesquisa}
                  onChange={(event) => setPesquisa(event.target.value)}
                  placeholder="Pesquisar..."
                  className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#A0A0A0]"
                />
                <FiSliders size={18} className="shrink-0 text-[#FFA400]" />
                {pesquisa && (
                  <button
                    type="button"
                    onClick={() => {
                      setPesquisa('');
                      setEstadoHover(null);
                    }}
                    className="text-[12px] font-bold text-[#2A2A72]"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {pesquisa && (
                <div className="mt-2 rounded-2xl bg-[#FFFBF2] p-3 shadow-lg">
                  {estadoEncontrado ? (
                    <button
                      type="button"
                      onClick={() => setEstadoHover(estadoEncontrado.sigla)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors hover:bg-[#F1F1F1]"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#333]">
                          {estadoEncontrado.nome}
                        </p>
                        <p className="text-xs text-[#777]">
                          {estadoEncontrado.sigla}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#FFA400]">
                        Ver estado
                      </span>
                    </button>
                  ) : (
                    <p className="px-3 py-2 text-sm text-[#777]">
                      Nenhum estado encontrado.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="min-h-[220px]" />
          </div>
        </div>
      </section>
    </main>
  );
}
