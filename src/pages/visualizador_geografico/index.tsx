import { useEffect, useMemo, useRef, useState } from 'react';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';

import Header from '../../components/header';
import Footer from '../../components/footer/footer';
import Brazil from '@react-map/brazil';
import CardEstado from '../../components/cardEstado/index';
import CardBrasil from '../../components/cardBrasil/index';
import { listarCandidatos } from '../../services/api';
import type { Candidato } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import BandeiraEstado from '../../components/bandeiraEstado';
import { REGIOES, VICE_VAGO, acharGovernador } from '../../utils/governadores';

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
const COR_FILTRO = '#8EC5F4'; // estados que passam nos filtros

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
  const svg = path.ownerSVGElement;

  const borda: { x: number; y: number }[] = [];
  const amostras = 160;
  for (let i = 0; i < amostras; i++) {
    const p = path.getPointAtLength((total * i) / amostras);
    borda.push({ x: p.x, y: p.y });
  }

  let melhor = { x: b.x + b.width / 2, y: b.y + b.height / 2, d: -1 };
  const passos = 24;

  // Reaproveita um único ponto SVG (compatível com todos os navegadores)
  const ponto = svg?.createSVGPoint();

  for (let i = 0; i <= passos; i++) {
    for (let j = 0; j <= passos; j++) {
      const x = b.x + (b.width * i) / passos;
      const y = b.y + (b.height * j) / passos;

      if (ponto) {
        ponto.x = x;
        ponto.y = y;
        if (!path.isPointInFill(ponto)) continue;
      }

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

type FiltroVice = 'todos' | 'com' | 'vago';

const alternar = (lista: string[], valor: string) =>
  lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];

const norm = (texto?: string | null) =>
  (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

function pontuar(campos: string[], tokens: string[]): number {
  let total = 0;

  for (const token of tokens) {
    let melhor = 0;

    for (const campo of campos) {
      if (!campo) continue;
      let p = 0;
      if (campo === token) p = 100;
      else if (campo.startsWith(token)) p = 60;
      else if (campo.split(' ').some((palavra) => palavra.startsWith(token)))
        p = 40;
      else if (campo.includes(token)) p = 20;
      if (p > melhor) melhor = p;
    }

    if (melhor === 0) return 0;
    total += melhor;
  }

  return total;
}

type Item =
  | { tipo: 'estado'; chave: string; estado: Estado }
  | {
      tipo: 'politico';
      chave: string;
      candidato: Candidato;
    }
  | {
      tipo: 'partido';
      chave: string;
      sigla: string;
      nome: string;
      governos: number;
    }
  | {
      tipo: 'vice';
      chave: string;
      nome: string;
      governador: Candidato;
      estado: Estado;
    };

const TITULO_GRUPO: Record<Item['tipo'], string> = {
  estado: 'Estados',
  politico: 'Políticos',
  partido: 'Partidos',
  vice: 'Vice-governadores',
};

export default function VisualizadorGeografico() {
  const navigate = useNavigate();
  const [estadoHover, setEstadoHover] = useState<string | null>(null);
  const [estadoFixo, setEstadoFixo] = useState<string | null>(null);
  const [pesquisa, setPesquisa] = useState('');
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [siglasProntas, setSiglasProntas] = useState(false);
  const mapaRef = useRef<HTMLDivElement>(null);
  const barraRef = useRef<HTMLDivElement>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [regioesAtivas, setRegioesAtivas] = useState<string[]>([]);
  const [partidosAtivos, setPartidosAtivos] = useState<string[]>([]);
  const [viceFiltro, setViceFiltro] = useState<FiltroVice>('todos');
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    listarCandidatos().then(setCandidatos).catch(console.error);
  }, []);

  useEffect(() => {
    function aoClicarFora(event: MouseEvent) {
      if (
        barraRef.current &&
        !barraRef.current.contains(event.target as Node)
      ) {
        setBuscaAberta(false);
        setFiltrosAbertos(false);
      }
    }
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, []);

  const governadoresPorUF = useMemo(() => {
    const mapa: Record<string, Candidato | null> = {};
    ESTADOS.forEach((e) => {
      mapa[e.sigla] = acharGovernador(candidatos, e.sigla);
    });
    return mapa;
  }, [candidatos]);

  // Partidos que têm governador hoje (para o filtro)
  const partidosDosGovernos = useMemo(() => {
    const siglas = Object.values(governadoresPorUF)
      .map((g) => g?.partidos?.sigla)
      .filter((s): s is string => !!s);
    return [...new Set(siglas)].sort();
  }, [governadoresPorUF]);

  const qtdFiltros =
    regioesAtivas.length +
    partidosAtivos.length +
    (viceFiltro !== 'todos' ? 1 : 0);

  const estadosFiltrados = useMemo(() => {
    if (qtdFiltros === 0) return null;

    const ufsDasRegioes = new Set<string>(
      REGIOES.filter((r) => regioesAtivas.includes(r.id)).flatMap((r) => [
        ...r.ufs,
      ]),
    );

    const resultado = new Set<string>();

    ESTADOS.forEach((e) => {
      const governador = governadoresPorUF[e.sigla];

      const okRegiao = regioesAtivas.length === 0 || ufsDasRegioes.has(e.sigla);
      const okPartido =
        partidosAtivos.length === 0 ||
        (!!governador?.partidos &&
          partidosAtivos.includes(governador.partidos.sigla));
      const okVice =
        viceFiltro === 'todos' ||
        (viceFiltro === 'vago' ? VICE_VAGO.has(e.sigla) : !!governador?.vice);

      if (okRegiao && okPartido && okVice) resultado.add(e.sigla);
    });

    return resultado;
  }, [
    qtdFiltros,
    regioesAtivas,
    partidosAtivos,
    viceFiltro,
    governadoresPorUF,
  ]);

  function limparFiltros() {
    setRegioesAtivas([]);
    setPartidosAtivos([]);
    setViceFiltro('todos');
  }

  const rotulosFiltros = [
    ...regioesAtivas.map((id) => ({
      chave: `r-${id}`,
      texto: REGIOES.find((r) => r.id === id)?.nome ?? id,
      remover: () => setRegioesAtivas((prev) => prev.filter((v) => v !== id)),
    })),
    ...partidosAtivos.map((sigla) => ({
      chave: `p-${sigla}`,
      texto: sigla,
      remover: () =>
        setPartidosAtivos((prev) => prev.filter((v) => v !== sigla)),
    })),
    ...(viceFiltro !== 'todos'
      ? [
          {
            chave: 'vice',
            texto:
              viceFiltro === 'vago' ? 'Vice: cargo vago' : 'Vice: com vice',
            remover: () => setViceFiltro('todos'),
          },
        ]
      : []),
  ];

  const cityColors = useMemo(() => {
    const cores: Record<string, string> = {};

    estadosFiltrados?.forEach((sigla) => {
      const nome = ESTADOS.find((e) => e.sigla === sigla)?.nome;
      if (nome) cores[nome] = COR_FILTRO;
    });

    const nomeFixo = ESTADOS.find((e) => e.sigla === estadoFixo)?.nome;
    if (nomeFixo) cores[nomeFixo] = COR_DESTAQUE;

    return cores;
  }, [estadosFiltrados, estadoFixo]);
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

      // Tamanho vem do mapa inteiro. Para aumentar/diminuir as siglas, mude o 0.017
      const tamanhoFonte = svg.getBBox().width * 0.017;

      maiores.forEach((path, sigla) => {
        const b = path.getBBox();
        const texto = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text',
        );
        texto.setAttribute('class', 'epol-sigla');
        texto.setAttribute('data-sigla', sigla);

        // Se o cálculo do centro falhar, usa o centro da caixa (não quebra a página)
        let centro = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        if (CENTRO_VISUAL.has(sigla)) {
          try {
            centro = centroVisual(path);
          } catch (err) {
            console.error(`Falha ao centralizar ${sigla}:`, err);
          }
        }

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

  const siglaAtual = estadoFixo ?? estadoHover;
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

  // Todos os partidos conhecidos (para a pesquisa)
  const partidosConhecidos = useMemo(() => {
    const mapa = new Map<string, { sigla: string; nome: string }>();
    candidatos.forEach((c) => {
      if (c.partidos) {
        mapa.set(c.partidos.sigla, {
          sigla: c.partidos.sigla,
          nome: c.partidos.nome_completo,
        });
      }
    });
    return [...mapa.values()];
  }, [candidatos]);

  const itens = useMemo<Item[]>(() => {
    const tokens = norm(pesquisa).split(' ').filter(Boolean);
    if (tokens.length === 0) return [];

    const estados: Item[] = ESTADOS.map((estado) => ({
      estado,
      p: pontuar([norm(estado.nome), norm(estado.sigla)], tokens),
    }))
      .filter((x) => x.p > 0)
      .sort((a, b) => b.p - a.p)
      .slice(0, 5)
      .map((x) => ({
        tipo: 'estado' as const,
        chave: `e-${x.estado.sigla}`,
        estado: x.estado,
      }));

    const politicos: Item[] = candidatos
      .map((candidato) => ({
        candidato,
        p: pontuar(
          [norm(candidato.nome_politico), norm(candidato.nome_completo)],
          tokens,
        ),
      }))
      .filter((x) => x.p > 0)
      .sort((a, b) => b.p - a.p)
      .slice(0, 6)
      .map((x) => ({
        tipo: 'politico' as const,
        chave: `c-${x.candidato.id}`,
        candidato: x.candidato,
      }));

    const vices: Item[] = ESTADOS.flatMap((estado) => {
      const governador = governadoresPorUF[estado.sigla];
      return governador?.vice
        ? [{ estado, governador, nome: governador.vice }]
        : [];
    })
      .map((x) => ({ ...x, p: pontuar([norm(x.nome)], tokens) }))
      .filter((x) => x.p > 0)
      .sort((a, b) => b.p - a.p)
      .slice(0, 5)
      .map((x) => ({
        tipo: 'vice' as const,
        chave: `v-${x.estado.sigla}`,
        nome: x.nome,
        governador: x.governador,
        estado: x.estado,
      }));

    const partidos: Item[] = partidosConhecidos
      .map((partido) => ({
        partido,
        p: pontuar([norm(partido.sigla), norm(partido.nome)], tokens),
      }))
      .filter((x) => x.p > 0)
      .sort((a, b) => b.p - a.p)
      .slice(0, 3)
      .map((x) => ({
        tipo: 'partido' as const,
        chave: `p-${x.partido.sigla}`,
        sigla: x.partido.sigla,
        nome: x.partido.nome,
        governos: Object.values(governadoresPorUF).filter(
          (g) => g?.partidos?.sigla === x.partido.sigla,
        ).length,
      }));

    return [...estados, ...politicos, ...vices, ...partidos];
  }, [pesquisa, candidatos, partidosConhecidos, governadoresPorUF]);

  function escolher(item: Item) {
    if (item.tipo === 'estado') {
      setEstadoFixo(item.estado.sigla);
    } else if (item.tipo === 'partido') {
      setPartidosAtivos((prev) =>
        prev.includes(item.sigla) ? prev : [...prev, item.sigla],
      );
    } else if (item.tipo === 'vice') {
      setEstadoFixo(item.estado.sigla);
    } else {
      // Político: vai para a página de perfil e o "Voltar" retorna ao visualizador
      navigate(`/pagina_politico?id=${encodeURIComponent(item.candidato.id)}`, {
        state: { voltarPara: '/visualizador' },
      });
    }

    setPesquisa('');
    setAtivo(0);
    setBuscaAberta(false);
  }

  function aoDigitar(valor: string) {
    setPesquisa(valor);
    setAtivo(0);
    setBuscaAberta(true);
    setFiltrosAbertos(false);
  }

  function aoPressionarTecla(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setAtivo((a) => Math.min(a + 1, itens.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setAtivo((a) => Math.max(a - 1, 0));
    } else if (event.key === 'Enter') {
      const item = itens[ativo];
      if (item) escolher(item);
    } else if (event.key === 'Escape') {
      setBuscaAberta(false);
    }
  }

  return (
    <>
      <main className="min-h-[100dvh] w-full bg-[#FFA400]">
        <style>{`
          .epol-map {
            display: block;
            width: 100%;
            max-width: 600px;
            height: auto;
            margin: 0 auto;
            overflow: visible;
          }

          .epol-map .map { width: 100% !important; }
          .epol-map svg { display: block; width: 100%; height: auto; }

          .epol-map svg path {
            stroke: #B4B4B4;
            stroke-width: 1.2;
            transition: fill 0.2s ease;
            cursor: pointer !important;
          }

          .epol-map svg text.epol-sigla {
            fill: #2A2A72;
            stroke: none;
            font-weight: 800;
            font-family: 'Montserrat', sans-serif;
            pointer-events: none;
            user-select: none;
            transition: fill 0.2s ease;
          }

          .epol-map svg text.epol-sigla.epol-branca { fill: #FFFFFF; }

          /* Desktop: mapa maior */
          @media (min-width: 1280px) {
            .epol-map { max-width: 780px; }
          }

          /* Monitores largos: ainda maior */
          @media (min-width: 1536px) {
            .epol-map { max-width: 900px; }
          }

          @media (max-width: 1279px) and (max-height: 520px) and (orientation: landscape) {
            .epol-map { max-width: min(600px, 72dvh); }
          }
        `}</style>

        <div className="fixed inset-x-0 top-0 z-[1000]">
          <Header isBgWhite />
        </div>

        <section className="min-h-[100dvh] w-full px-4 pb-10 pt-32 sm:px-6 md:px-10 md:pt-[135px] xl:px-[65px] xl:pt-[135px]">
          <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)_300px] xl:grid-rows-[auto_1fr] xl:gap-x-8 xl:gap-y-0 xl:pt-4">
            <div className="min-w-0 select-none xl:col-start-1 xl:row-start-1">
              <h1 className="text-[#2A2A72]">
                <span className="block font-[Fraunces] text-[clamp(1.5rem,5vw,2rem)] font-black italic uppercase leading-[0.95] tracking-[-0.03em]">
                  Visualizador
                </span>
                <span className="mt-1 block text-[clamp(0.95rem,3.5vw,1.1rem)] font-black uppercase leading-none tracking-wide">
                  Geográfico
                </span>
              </h1>
            </div>

            <div className="min-w-0 xl:col-start-3 xl:row-start-1">
              <div className="relative w-full" ref={barraRef}>
                <div className="flex min-h-[52px] items-center gap-1 rounded-full bg-[#FFFBF2] px-3 shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:gap-3 sm:px-5">
                  <FiSearch
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-[#888]"
                  />
                  <input
                    type="text"
                    aria-label="Pesquisar estado, político ou partido"
                    value={pesquisa}
                    onChange={(e) => aoDigitar(e.target.value)}
                    onFocus={() => {
                      setBuscaAberta(true);
                      setFiltrosAbertos(false);
                    }}
                    onKeyDown={aoPressionarTecla}
                    placeholder="Pesquisar estado, político ou partido..."
                    className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#A0A0A0] xl:text-[13px]"
                  />

                  {pesquisa && (
                    <button
                      type="button"
                      onClick={() => {
                        setPesquisa('');
                        setAtivo(0);
                      }}
                      aria-label="Limpar pesquisa"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#888] transition-colors hover:text-[#2A2A72] xl:h-8 xl:w-8"
                    >
                      <FiX size={18} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setFiltrosAbertos((v) => !v);
                      setBuscaAberta(false);
                    }}
                    aria-label="Filtros"
                    aria-expanded={filtrosAbertos}
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#FFA400] xl:h-8 xl:w-8"
                  >
                    <FiSliders size={20} />
                    {qtdFiltros > 0 && (
                      <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#2A2A72] text-[9px] font-bold text-white xl:-right-1 xl:-top-1">
                        {qtdFiltros}
                      </span>
                    )}
                  </button>
                </div>

                {filtrosAbertos && (
                  <div className="mt-2 max-h-[min(55dvh,30rem)] overflow-y-auto rounded-2xl bg-[#FFFBF2] p-4 shadow-xl xl:absolute xl:inset-x-0 xl:top-full xl:z-50 xl:max-h-[min(65dvh,34rem)]">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-black uppercase tracking-wide text-[#2A2A72]">
                        Filtros
                      </p>
                      {qtdFiltros > 0 && (
                        <button
                          type="button"
                          onClick={limparFiltros}
                          className="text-xs font-bold text-[#FFA400]"
                        >
                          Limpar tudo
                        </button>
                      )}
                    </div>

                    <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#999]">
                      Região
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {REGIOES.map((regiao) => {
                        const marcado = regioesAtivas.includes(regiao.id);
                        return (
                          <button
                            key={regiao.id}
                            type="button"
                            onClick={() =>
                              setRegioesAtivas((prev) =>
                                alternar(prev, regiao.id),
                              )
                            }
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                              marcado
                                ? 'bg-[#2A2A72] text-white'
                                : 'bg-[#EDEDED] text-[#555] hover:bg-[#E0E0E0]'
                            }`}
                          >
                            {regiao.nome}
                          </button>
                        );
                      })}
                    </div>

                    <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#999]">
                      Partido do governador
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5 xl:max-h-28 xl:overflow-y-auto">
                      {partidosDosGovernos.length === 0 && (
                        <span className="text-xs text-[#999]">
                          Carregando partidos...
                        </span>
                      )}
                      {partidosDosGovernos.map((sigla) => {
                        const marcado = partidosAtivos.includes(sigla);
                        return (
                          <button
                            key={sigla}
                            type="button"
                            onClick={() =>
                              setPartidosAtivos((prev) => alternar(prev, sigla))
                            }
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                              marcado
                                ? 'bg-[#2A2A72] text-white'
                                : 'bg-[#EDEDED] text-[#555] hover:bg-[#E0E0E0]'
                            }`}
                          >
                            {sigla}
                          </button>
                        );
                      })}
                    </div>

                    <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#999]">
                      Vice-governador
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {(
                        [
                          ['todos', 'Todos'],
                          ['com', 'Com vice'],
                          ['vago', 'Cargo vago'],
                        ] as const
                      ).map(([valor, texto]) => (
                        <button
                          key={valor}
                          type="button"
                          onClick={() => setViceFiltro(valor)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            viceFiltro === valor
                              ? 'bg-[#2A2A72] text-white'
                              : 'bg-[#EDEDED] text-[#555] hover:bg-[#E0E0E0]'
                          }`}
                        >
                          {texto}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-3">
                      <span className="text-xs text-[#777]">
                        {estadosFiltrados
                          ? `${estadosFiltrados.size} ${estadosFiltrados.size === 1 ? 'estado' : 'estados'} no mapa`
                          : 'Nenhum filtro ativo'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiltrosAbertos(false)}
                        className="rounded-full bg-[#FFA400] px-4 py-1.5 text-xs font-bold text-white"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                )}

                {buscaAberta && pesquisa.trim() && !filtrosAbertos && (
                  <div className="mt-2 max-h-[min(50dvh,420px)] overflow-y-auto rounded-2xl bg-[#FFFBF2] p-2 shadow-xl xl:absolute xl:inset-x-0 xl:top-full xl:z-50 xl:max-h-[min(60dvh,420px)]">
                    {itens.length === 0 ? (
                      <p className="px-3 py-3 text-sm text-[#777]">
                        Nenhum resultado para “{pesquisa.trim()}”.
                      </p>
                    ) : (
                      itens.map((item, i) => (
                        <div key={item.chave}>
                          {(i === 0 || itens[i - 1].tipo !== item.tipo) && (
                            <p className="px-3 pb-1 pt-2 text-[10px] font-extrabold uppercase tracking-wider text-[#999]">
                              {TITULO_GRUPO[item.tipo]}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() => escolher(item)}
                            onMouseEnter={() => setAtivo(i)}
                            className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                              i === ativo ? 'bg-[#F1F1F1]' : ''
                            }`}
                          >
                            {item.tipo === 'estado' && (
                              <>
                                <BandeiraEstado
                                  sigla={item.estado.sigla}
                                  className="h-[22px] w-[32px] shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-bold text-[#333]">
                                    {item.estado.nome}
                                  </p>
                                  <p className="text-xs text-[#777]">
                                    {item.estado.sigla}
                                  </p>
                                </div>
                                <span className="text-xs font-bold text-[#FFA400]">
                                  Ver estado
                                </span>
                              </>
                            )}

                            {item.tipo === 'politico' && (
                              <>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-bold text-[#333]">
                                    {item.candidato.nome_politico}
                                  </p>
                                  <p className="truncate text-xs text-[#777]">
                                    {item.candidato.cargo_atual}
                                    {item.candidato.partidos
                                      ? ` · ${item.candidato.partidos.sigla}`
                                      : ''}
                                  </p>
                                </div>
                                <span className="shrink-0 text-xs font-bold text-[#FFA400]">
                                  Ver perfil
                                </span>
                              </>
                            )}

                            {item.tipo === 'vice' && (
                              <>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-bold text-[#333]">
                                    {item.nome}
                                  </p>
                                  <p className="truncate text-xs text-[#777]">
                                    Vice-governador(a) de {item.estado.nome} ·
                                    Governador(a):{' '}
                                    {item.governador.nome_politico}
                                  </p>
                                </div>
                                <span className="shrink-0 text-xs font-bold text-[#FFA400]">
                                  Ver {item.estado.sigla}
                                </span>
                              </>
                            )}

                            {item.tipo === 'partido' && (
                              <>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-bold text-[#333]">
                                    {item.sigla}
                                  </p>
                                  <p className="truncate text-xs text-[#777]">
                                    {item.nome}
                                    {item.governos > 0
                                      ? ` · ${item.governos} ${item.governos === 1 ? 'governo' : 'governos'}`
                                      : ''}
                                  </p>
                                </div>
                                <span className="shrink-0 text-xs font-bold text-[#FFA400]">
                                  Filtrar
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {rotulosFiltros.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {rotulosFiltros.map((r) => (
                    <button
                      key={r.chave}
                      type="button"
                      onClick={r.remover}
                      className="flex items-center gap-1 rounded-full bg-[#2A2A72] px-3 py-1 text-[11px] font-semibold text-white"
                    >
                      {r.texto}
                      <FiX size={12} />
                    </button>
                  ))}
                  <span className="text-[11px] font-semibold text-[#2A2A72]">
                    {estadosFiltrados?.size ?? 0}{' '}
                    {estadosFiltrados?.size === 1 ? 'estado' : 'estados'}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 xl:col-start-2 xl:row-span-2 xl:row-start-1">
              <div
                ref={mapaRef}
                className="epol-map"
                onMouseOver={obterEstadoDoMapa}
                onMouseOut={limparEstado}
                onClick={clicarEstadoNoMapa}
              >
                {mapa}
              </div>
            </div>

            {estadoAtual && (
              <div className="flex min-w-0 justify-center xl:col-start-1 xl:row-start-2 xl:pt-32">
                <CardEstado
                  nomeEstado={estadoAtual.nome}
                  sigla={estadoAtual.sigla}
                  candidatos={candidatos}
                />
              </div>
            )}

            <div className="flex min-w-0 justify-center xl:col-start-3 xl:row-start-2 xl:pt-16">
              <CardBrasil candidatos={candidatos} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
