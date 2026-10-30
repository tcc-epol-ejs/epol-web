import { useEffect, useMemo, useRef, useState } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';
import Header from '../../components/header';
import Footer from '../../components/footer/footer';
import Brazil from '@react-map/brazil';
import CardEstado from '../../components/cardEstado/index';
import CardBrasil from '../../components/cardBrasil/index';
import { listarCandidatos } from '../../services/api';
import type { Candidato } from '../../services/api';

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

const COR_MAPA = '#D5D5D5';
const COR_DESTAQUE = '#2A82D7';

function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

function siglaPorNome(nome: string): string | null {
  return (
    ESTADOS.find((e) => normalizar(e.nome) === normalizar(nome))?.sigla ?? null
  );
}

function obterSiglaDoElemento(alvo: EventTarget): string | null {
  const path = (alvo as Element).closest?.('path');
  const id = path?.getAttribute('id');
  if (!id) return null;
  return siglaPorNome(id.replace(/-[^-]*$/, ''));
}

// Estados com formato irregular, onde o centro da "caixa" fica perto da borda.
// Para centralizar outro estado, é só adicionar a sigla aqui.
const CENTRO_VISUAL = new Set(['PI', 'RJ', 'SC']);

// Acha o ponto dentro do estado que fica mais longe de qualquer borda
function centroVisual(path: SVGPathElement): { x: number; y: number } {
  const b = path.getBBox();
  const total = path.getTotalLength();

  const borda: { x: number; y: number }[] = [];
  const amostras = 160;
  for (let i = 0; i < amostras; i++) {
    const p = path.getPointAtLength((total * i) / amostras);
    borda.push({ x: p.x, y: p.y });
  }

  let melhor = { x: b.x + b.width / 2, y: b.y + b.height / 2, d: -1 };
  const passos = 24;

  for (let i = 0; i <= passos; i++) {
    for (let j = 0; j <= passos; j++) {
      const x = b.x + (b.width * i) / passos;
      const y = b.y + (b.height * j) / passos;
      if (!path.isPointInFill(new DOMPoint(x, y))) continue;

      let menor = Infinity;
      for (const p of borda) {
        const d = (p.x - x) ** 2 + (p.y - y) ** 2;
        if (d < menor) menor = d;
      }
      if (menor > melhor.d) melhor = { x, y, d: menor };
    }
  }

  return { x: melhor.x, y: melhor.y };
}

export default function VisualizadorGeografico() {
  const [estadoHover, setEstadoHover] = useState<string | null>(null);
  const [estadoFixo, setEstadoFixo] = useState<string | null>(null);
  const [pesquisa, setPesquisa] = useState('');
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [siglasProntas, setSiglasProntas] = useState(false);
  const mapaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listarCandidatos().then(setCandidatos).catch(console.error);
  }, []);

  // Pinta de azul o estado fixado (inclusive quando ele vem da pesquisa)
  const cityColors = useMemo(() => {
    const nome = ESTADOS.find((e) => e.sigla === estadoFixo)?.nome;
    return nome ? { [nome]: COR_DESTAQUE } : {};
  }, [estadoFixo]);

  // Memorizado para o mapa não ser re-renderizado a cada hover (isso apagaria as cores)
  const mapa = useMemo(
    () => (
      <Brazil
        type="select-single"
        mapColor={COR_MAPA}
        hoverColor={COR_DESTAQUE}
        cityColors={cityColors}
        disableClick
      />
    ),
    [cityColors],
  );

  // 1) Cria a sigla no centro de cada estado
  useEffect(() => {
    let frame = 0;
    let tentativas = 0;

    function criarSiglas() {
      const svg = mapaRef.current?.querySelector('svg');
      const paths = svg ? Array.from(svg.querySelectorAll('path')) : [];

      if (!svg || paths.length === 0) {
        if (tentativas++ < 60) frame = requestAnimationFrame(criarSiglas);
        return;
      }

      svg.querySelectorAll('text.epol-sigla').forEach((t) => t.remove());

      // Estados com mais de uma parte (ilhas): usa a maior
      const maiores = new Map<string, SVGPathElement>();
      paths.forEach((path) => {
        const sigla = obterSiglaDoElemento(path);
        if (!sigla) return;
        const b = path.getBBox();
        const atual = maiores.get(sigla);
        const ba = atual?.getBBox();
        if (!atual || b.width * b.height > ba!.width * ba!.height) {
          maiores.set(sigla, path);
        }
      });

      // Tamanho vem do mapa inteiro. Para aumentar/diminuir as siglas, mude o 0.02
      const tamanhoFonte = svg.getBBox().width * 0.017;

      maiores.forEach((path, sigla) => {
        const b = path.getBBox();
        const texto = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text',
        );
        texto.setAttribute('class', 'epol-sigla');
        texto.setAttribute('data-sigla', sigla);
        const centro = CENTRO_VISUAL.has(sigla)
          ? centroVisual(path)
          : { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        texto.setAttribute('x', String(centro.x));
        texto.setAttribute('y', String(centro.y));
        texto.setAttribute('text-anchor', 'middle');
        texto.setAttribute('dominant-baseline', 'central');
        texto.setAttribute('font-size', String(tamanhoFonte));
        texto.textContent = sigla;
        svg.appendChild(texto);
      });

      setSiglasProntas(true);
    }

    criarSiglas();
    return () => cancelAnimationFrame(frame);
  }, []);

  // 2) Sigla branca no hover e no estado fixado
  useEffect(() => {
    const svg = mapaRef.current?.querySelector('svg');
    if (!svg) return;
    svg.querySelectorAll('text.epol-sigla').forEach((t) => {
      const sigla = t.getAttribute('data-sigla');
      t.classList.toggle(
        'epol-branca',
        sigla === estadoHover || sigla === estadoFixo,
      );
    });
  }, [estadoHover, estadoFixo, siglasProntas]);

  const estadoEncontrado = useMemo(() => {
    const valor = pesquisa.trim().toLowerCase();
    if (!valor) return null;
    return (
      ESTADOS.find(
        (e) =>
          e.nome.toLowerCase().includes(valor) ||
          e.sigla.toLowerCase() === valor,
      ) ?? null
    );
  }, [pesquisa]);

  const siglaAtual =
    estadoFixo ?? estadoHover ?? estadoEncontrado?.sigla ?? null;
  const estadoAtual = siglaAtual
    ? (ESTADOS.find((e) => e.sigla === siglaAtual) ?? null)
    : null;

  function obterEstadoDoMapa(event: React.MouseEvent<HTMLDivElement>) {
    const sigla = obterSiglaDoElemento(event.target);
    if (sigla) setEstadoHover(sigla);
  }

  function clicarEstadoNoMapa(event: React.MouseEvent<HTMLDivElement>) {
    const sigla = obterSiglaDoElemento(event.target);
    if (!sigla) return;
    setEstadoFixo((prev) => (prev === sigla ? null : sigla));
  }

  function limparEstado() {
    setEstadoHover(null);
  }

  return (
    <>
      <main className="min-h-screen w-full bg-[#FFA400] overflow-hidden">
        <style>{`
        .epol-map { width: 100%; max-width: 620px; height: auto; display: block; overflow: visible; }
        .epol-map svg { width: 100%; height: auto; }
        .epol-map svg path { stroke: #B4B4B4; stroke-width: 1.2; transition: fill 0.2s ease; cursor: pointer !important; }
        .epol-map svg text.epol-sigla { fill: #2A2A72; stroke: none; font-weight: 800; font-family: 'Montserrat', sans-serif; pointer-events: none; user-select: none; transition: fill 0.2s ease; }
        .epol-map svg text.epol-sigla.epol-branca { fill: #FFFFFF; }
      `}</style>

        <div className="fixed top-0 left-0 z-[1000] w-full">
          <Header isBgWhite />
        </div>

        <section className="min-h-screen w-full px-6 pb-10 pt-[155px] md:px-10 lg:px-[65px]">
          <div className="mx-auto grid min-h-[calc(100vh-155px)] w-full max-w-[1600px] grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(420px,1fr)_300px] items-start pt-8">
            {/*ESQUERDA*/}
            <div className="flex flex-col justify-center gap-32">
              <div className="select-none">
                <h1 className="font-[Fraunces] text-[43px] font-black italic uppercase leading-[0.95] tracking-[-0.03em] text-[#2A2A72] md:text-[48px]">
                  Visualizador
                </h1>
                <h2 className="mt-1 text-[28px] font-black uppercase leading-none tracking-wide text-[#2A2A72]">
                  Geográfico
                </h2>
              </div>

              {estadoAtual && (
                <CardEstado
                  nomeEstado={estadoAtual.nome}
                  sigla={estadoAtual.sigla}
                  candidatos={candidatos}
                />
              )}
            </div>

            {/* MAPA */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[620px]">
                <div
                  ref={mapaRef}
                  className="epol-map w-full max-w-[620px]"
                  onMouseOver={obterEstadoDoMapa}
                  onMouseOut={limparEstado}
                  onClick={clicarEstadoNoMapa}
                >
                  {mapa}
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
                    onChange={(e) => setPesquisa(e.target.value)}
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
                        onClick={() => {
                          setEstadoFixo(estadoEncontrado.sigla);
                          setPesquisa('');
                        }}
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

              {/* mt-16 afasta o card da barra de pesquisa; aumente ou diminua à vontade */}
              <div className="mt-16">
                <CardBrasil candidatos={candidatos} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
