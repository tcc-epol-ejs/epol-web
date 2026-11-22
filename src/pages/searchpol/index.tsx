import {
  FiArrowDown,
  FiArrowUp,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/index';
import { obterPaletaPartido } from '../../data/partidoPaletas';
import {
  type Candidato,
  listarCandidatos,
  listarPartidos,
  type Partido,
} from '../../services/api';

/*
 * Breakpoints (Tailwind):
 *  - base (< 640px)  -> celular: filtro vira botão + painel (modal), cards compactos
 *  - sm   (≥ 640px)  -> celular grande / tablet pequeno
 *  - md   (≥ 768px)  -> tablet
 *  - lg   (≥ 1024px) -> desktop: barra lateral de filtros fixa (layout original)
 */

const logosPartidosPorSigla: Record<string, string> = {
  AGIR: '/logos/partidos/agir.svg',
  AVANTE: '/logos/partidos/avante.svg',
  CIDADANIA: '/logos/partidos/cidadania.svg',
  DC: '/logos/partidos/dc.svg',
  DEMOCRATA: '/logos/partidos/democrata.svg',
  MDB: '/logos/partidos/mdb.svg',
  MISSAO: '/logos/partidos/missao.svg',
  MOBILIZA: '/logos/partidos/mobiliza.svg',
  NOVO: '/logos/partidos/novo.svg',
  PCB: '/logos/partidos/pcb.svg',
  PCDOB: '/logos/partidos/pcdob.svg',
  PCO: '/logos/partidos/pco.svg',
  PDT: '/logos/partidos/pdt.svg',
  PL: '/logos/partidos/pl.svg',
  PODE: '/logos/partidos/pode.svg',
  PP: '/logos/partidos/pp.svg',
  PRD: '/logos/partidos/prd.svg',
  PRTB: '/logos/partidos/prtb.svg',
  PSB: '/logos/partidos/psb.svg',
  PSD: '/logos/partidos/psd.svg',
  PSDB: '/logos/partidos/psdb.svg',
  PSOL: '/logos/partidos/psol.svg',
  PSTU: '/logos/partidos/pstu.svg',
  PT: '/logos/partidos/pt.svg',
  PV: '/logos/partidos/pv.svg',
  REDE: '/logos/partidos/rede.svg',
  REPUBLICANOS: '/logos/partidos/republicanos.svg',
  SOLIDARIEDADE: '/logos/partidos/solidariedade.svg',
  UNIAO: '/logos/partidos/uniao.svg',
  UP: '/logos/partidos/up.svg',
};

const escalasLogoPartido: Record<string, string> = {
  AVANTE: 'scale-[1.25]',
  CIDADANIA: 'scale-[1.25]',
  DEMOCRATA: 'scale-[1.60]',
  PCB: 'scale-[1.30]',
  PL: 'scale-[1.30]',
  PSOL: 'scale-[1.25]',
  REPUBLICANOS: 'scale-[2.05]',
};

function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

// -----------------------------------------------------------------------------
// COMPONENTES DE APRESENTAÇÃO
// -----------------------------------------------------------------------------

interface CabecalhoSecaoProps {
  titulo: string;
  rotulo: string;
  aberto: boolean;
  onToggle: () => void;
  className?: string;
}

function CabecalhoSecao({
  titulo,
  rotulo,
  aberto,
  onToggle,
  className = '',
}: CabecalhoSecaoProps) {
  return (
    <div
      className={`relative w-full lg:-ml-4 lg:mr-[-2.5rem] lg:w-[calc(100%+5rem)] ${className}`}
    >
      <div className="flex w-full items-center gap-3 text-[#2A2A72] sm:gap-4">
        <div className="h-px min-w-0 flex-1 bg-[#2A2A72]/30" />
        <h2 className="shrink-0 text-[15px] font-bold uppercase tracking-[0.12em] sm:text-[18px]">
          {titulo}
        </h2>
        <div className="h-px min-w-0 flex-1 bg-[#2A2A72]/30" />
        <button
          type="button"
          onClick={onToggle}
          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2A2A72]/30 bg-white text-[#2A2A72] transition-colors hover:bg-[#2A2A72] hover:text-white"
          aria-expanded={aberto}
          aria-label={aberto ? `Ocultar ${rotulo}` : `Mostrar ${rotulo}`}
        >
          {aberto ? (
            <FiChevronUp aria-hidden="true" className="text-[18px]" />
          ) : (
            <FiChevronDown aria-hidden="true" className="text-[18px]" />
          )}
        </button>
      </div>
    </div>
  );
}

function CardPartido({
  party,
  onClick,
}: {
  party: Partido;
  onClick: () => void;
}) {
  const paleta = obterPaletaPartido(party.sigla);
  const siglaNormalizada = normalizarTexto(party.sigla).toUpperCase();
  const logo = party.bandeira_url || logosPartidosPorSigla[siglaNormalizada];
  const escalaLogo = escalasLogoPartido[siglaNormalizada] || '';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver informações do partido ${party.nome_completo}`}
      className="flex min-h-[170px] w-full flex-col items-center gap-2 rounded-2xl border-2 p-2.5 text-center transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#2A2A72] sm:min-h-[200px] sm:p-3"
      style={{
        borderColor: paleta.borda,
        backgroundColor: paleta.cor,
      }}
    >
      <div className="flex h-20 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/45 p-2.5 sm:h-28 sm:p-3">
        {logo ? (
          <img
            src={logo}
            alt={`Logo de ${party.nome_completo}`}
            loading="lazy"
            className={`h-full w-full object-contain ${escalaLogo}`}
          />
        ) : (
          <span className="text-xl font-black text-[#2A2A72] sm:text-2xl">
            {party.sigla}
          </span>
        )}
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col items-start justify-between gap-1 text-left sm:flex-row sm:items-end sm:gap-3">
        <div className="flex min-w-0 max-w-full flex-col items-start sm:max-w-[75%]">
          <h2 className="max-w-full text-[9px] font-bold uppercase tracking-[0.12em] opacity-60 sm:text-[10px]">
            PARTIDO
          </h2>
          <p className="max-w-full break-words text-[12px] font-bold leading-tight tracking-[0.04em] sm:text-[15px] sm:tracking-[0.06em]">
            {party.nome_completo}
          </p>
        </div>
        <p className="shrink-0 text-[18px] font-black leading-tight tracking-[0.06em] opacity-60 sm:text-[20px]">
          {party.numero_legenda}
        </p>
      </div>
    </button>
  );
}

interface CardPessoaProps {
  foto?: string | null;
  nome: string;
  etiqueta: string;
  subtitulo: string;
  rodape: string;
  destaque?: string | number;
  ariaLabel: string;
  onClick: () => void;
}

function CardPessoa({
  foto,
  nome,
  etiqueta,
  subtitulo,
  rodape,
  destaque,
  ariaLabel,
  onClick,
}: CardPessoaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex min-h-[116px] w-full flex-row overflow-hidden rounded-2xl border-2 border-[#2A2A72] bg-white text-left text-[#2A2A72] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#2A2A72] sm:min-h-[300px] sm:flex-col"
    >
      <div className="relative flex w-[104px] shrink-0 items-center justify-center self-stretch overflow-hidden bg-[#2A2A72] sm:h-44 sm:w-full sm:self-auto">
        {foto ? (
          <img
            src={foto}
            alt={`Foto de ${nome}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
          />
        ) : (
          <span className="px-2 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-white/70 sm:text-[12px]">
            Sem foto
          </span>
        )}
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col p-3 sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2A2A72]/70">
          {etiqueta}
        </p>
        <h3 className="mt-1 break-words text-[15px] font-bold uppercase leading-tight sm:text-[20px]">
          {nome}
        </h3>
        <p className="mt-1.5 text-[13px] font-semibold text-[#333] sm:mt-2 sm:text-[14px]">
          {subtitulo}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3 sm:pt-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#333] sm:text-[13px]">
            {rodape}
          </p>
          {destaque !== undefined && (
            <p className="text-[20px] font-black leading-none text-[#FFA400] sm:text-[24px]">
              {destaque}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function etiquetaCandidatura(candidatura: Candidato['candidatura']) {
  if (candidatura === 'Governadora') return 'Candidata a governadora';
  if (candidatura === 'Presidente') return 'Candidato(a) a presidente';
  return 'Candidato a governador';
}

// -----------------------------------------------------------------------------
// PÁGINA
// -----------------------------------------------------------------------------
function SearchPol() {
  const navigate = useNavigate();
  const resultadosRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isSm = useMediaQuery('(min-width: 640px)');
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
  const [selectedPartido, setSelectedPartido] = useState('');
  const [selectedEstadoCandidato, setSelectedEstadoCandidato] = useState('');
  const [selectedPartidoCandidato, setSelectedPartidoCandidato] = useState('');
  const [selectedTipoCandidatura, setSelectedTipoCandidatura] = useState('');
  const [filtroSelecionado, setFiltroSelecionado] = useState<
    'partidos' | 'candidatos' | 'politicos' | null
  >(null);
  const [sortBy, setSortBy] = useState<'nome' | 'numero'>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [candidatosSortDirection, setCandidatosSortDirection] = useState<
    'asc' | 'desc'
  >('asc');
  const [politicosSortDirection, setPoliticosSortDirection] = useState<
    'asc' | 'desc'
  >('asc');
  const [partidosOpen, setPartidosOpen] = useState(true);
  const [candidatosOpen, setCandidatosOpen] = useState(true);
  const [politicosOpen, setPoliticosOpen] = useState(true);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [partidosLoading, setPartidosLoading] = useState(true);
  const [partidosError, setPartidosError] = useState('');
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [candidatosLoading, setCandidatosLoading] = useState(true);
  const [candidatosError, setCandidatosError] = useState('');

  useLayoutEffect(() => {
    resultadosRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const carregarPartidos = async () => {
      try {
        setPartidos(await listarPartidos());
      } catch (error) {
        console.error('Não foi possível carregar os partidos.', error);
        setPartidosError('Não foi possível carregar os partidos.');
      } finally {
        setPartidosLoading(false);
      }
    };

    carregarPartidos();
  }, []);

  useEffect(() => {
    const carregarCandidatos = async () => {
      try {
        setCandidatos(await listarCandidatos());
      } catch (error) {
        console.error(
          'Não foi possível carregar candidatos e políticos.',
          error,
        );
        setCandidatosError('Não foi possível carregar os candidatos.');
      } finally {
        setCandidatosLoading(false);
      }
    };

    carregarCandidatos();
  }, []);

  useEffect(() => {
    if (!filtrosOpen) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFiltrosOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener('keydown', onKey);
    };
  }, [filtrosOpen]);

  useEffect(() => {
    if (isDesktop) setFiltrosOpen(false);
  }, [isDesktop]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchedTerm(normalizarTexto(search.trim()));
  };

  const results = [...partidos]
    .filter((party) => {
      const nome = normalizarTexto(party.nome_completo);
      const sigla = normalizarTexto(party.sigla);
      const numero = String(party.numero_legenda);

      return (
        (searchedTerm === '' ||
          nome.includes(searchedTerm) ||
          sigla.includes(searchedTerm) ||
          numero.includes(searchedTerm)) &&
        (!selectedPartido || party.nome_completo === selectedPartido)
      );
    })
    .sort((firstParty, secondParty) => {
      const comparison =
        sortBy === 'nome'
          ? firstParty.nome_completo.localeCompare(
              secondParty.nome_completo,
              'pt-BR',
            )
          : firstParty.numero_legenda - secondParty.numero_legenda;

      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (nextSortBy: 'nome' | 'numero') => {
    if (sortBy === nextSortBy) {
      setSortDirection((currentDirection) =>
        currentDirection === 'asc' ? 'desc' : 'asc',
      );
      return;
    }

    setSortBy(nextSortBy);
    setSortDirection('asc');
  };

  const sortIcon = (option: 'nome' | 'numero') => {
    if (sortBy !== option || sortDirection === 'asc') {
      return <FiArrowUp aria-hidden="true" />;
    }

    return <FiArrowDown aria-hidden="true" />;
  };

  const toggleCandidatosSort = () => {
    setFiltroSelecionado('candidatos');
    setCandidatosSortDirection((currentDirection) =>
      currentDirection === 'asc' ? 'desc' : 'asc',
    );
  };

  const togglePoliticosSort = () => {
    setFiltroSelecionado('politicos');
    setPoliticosSortDirection((currentDirection) =>
      currentDirection === 'asc' ? 'desc' : 'asc',
    );
  };

  const limparFiltros = () => {
    setSelectedPartido('');
    setSelectedEstadoCandidato('');
    setSelectedPartidoCandidato('');
    setSelectedTipoCandidatura('');
    setFiltroSelecionado(null);
    setSortBy('nome');
    setSortDirection('asc');
    setCandidatosSortDirection('asc');
    setPoliticosSortDirection('asc');
  };

  const candidatosResults = [...candidatos]
    .filter((candidate) => candidate.concorrentes === true)
    .filter((candidate) => {
      const termo = searchedTerm;
      const nome = normalizarTexto(
        candidate.nome_politico || candidate.nome_completo,
      );
      const nomeCompleto = normalizarTexto(candidate.nome_completo);
      const partido = normalizarTexto(candidate.partidos?.nome_completo || '');

      return (
        (termo === '' ||
          nome.includes(termo) ||
          nomeCompleto.includes(termo) ||
          partido.includes(termo)) &&
        (!selectedEstadoCandidato ||
          candidate.uf_candidatura === selectedEstadoCandidato) &&
        (!selectedPartidoCandidato ||
          candidate.partidos?.id === selectedPartidoCandidato) &&
        (!selectedTipoCandidatura ||
          candidate.candidatura === selectedTipoCandidatura)
      );
    })
    .sort((firstCandidate, secondCandidate) => {
      const comparison = (
        firstCandidate.nome_politico || firstCandidate.nome_completo
      ).localeCompare(
        secondCandidate.nome_politico || secondCandidate.nome_completo,
        'pt-BR',
      );

      return candidatosSortDirection === 'asc' ? comparison : -comparison;
    });

  const politicosResults = [...candidatos]
    .filter((politico) => politico.concorrentes === false)
    .filter((politico) => {
      const nome = normalizarTexto(
        politico.nome_politico || politico.nome_completo,
      );
      const nomeCompleto = normalizarTexto(politico.nome_completo);
      const partido = normalizarTexto(politico.partidos?.nome_completo || '');
      const cargo = normalizarTexto(politico.cargo_atual || '');

      return (
        searchedTerm === '' ||
        nome.includes(searchedTerm) ||
        nomeCompleto.includes(searchedTerm) ||
        partido.includes(searchedTerm) ||
        cargo.includes(searchedTerm)
      );
    })
    .sort((firstPolitico, secondPolitico) => {
      const comparison = (
        firstPolitico.nome_politico || firstPolitico.nome_completo
      ).localeCompare(
        secondPolitico.nome_politico || secondPolitico.nome_completo,
        'pt-BR',
      );

      return politicosSortDirection === 'asc' ? comparison : -comparison;
    });

  const estadosCandidatos = [
    ...new Set(
      candidatos
        .filter((candidate) => candidate.concorrentes === true)
        .map((candidate) => candidate.uf_candidatura)
        .filter((estado): estado is string => Boolean(estado)),
    ),
  ].sort((firstState, secondState) =>
    firstState.localeCompare(secondState, 'pt-BR'),
  );

  const tiposCandidatura = [
    ...new Set(
      candidatos
        .filter((candidate) => candidate.concorrentes === true)
        .map((candidate) => candidate.candidatura)
        .filter((tipo): tipo is Candidato['candidatura'] => Boolean(tipo)),
    ),
  ].sort((firstType, secondType) =>
    firstType.localeCompare(secondType, 'pt-BR'),
  );

  const partidosCandidatos = candidatos
    .filter((candidate) => candidate.concorrentes === true)
    .filter((candidate) => candidate.partidos)
    .map(
      (candidate) => candidate.partidos as NonNullable<Candidato['partidos']>,
    )
    .filter(
      (party, index, parties) =>
        parties.findIndex((item) => item.id === party.id) === index,
    )
    .sort((firstParty, secondParty) =>
      firstParty.nome_completo.localeCompare(
        secondParty.nome_completo,
        'pt-BR',
      ),
    );

  const filtroPartidoAtivo = selectedPartido !== '';
  const filtroCandidatoAtivo =
    selectedEstadoCandidato !== '' ||
    selectedPartidoCandidato !== '' ||
    selectedTipoCandidatura !== '';

  const chipsAtivos: { label: string; remover: () => void }[] = [];
  if (selectedEstadoCandidato) {
    chipsAtivos.push({
      label: selectedEstadoCandidato,
      remover: () => setSelectedEstadoCandidato(''),
    });
  }
  if (selectedTipoCandidatura) {
    chipsAtivos.push({
      label: selectedTipoCandidatura,
      remover: () => setSelectedTipoCandidatura(''),
    });
  }
  if (selectedPartidoCandidato) {
    const partidoSelecionado = partidosCandidatos.find(
      (party) => party.id === selectedPartidoCandidato,
    );
    chipsAtivos.push({
      label:
        partidoSelecionado?.sigla ||
        partidoSelecionado?.nome_completo ||
        'Partido',
      remover: () => setSelectedPartidoCandidato(''),
    });
  }
  if (selectedPartido) {
    chipsAtivos.push({
      label: selectedPartido,
      remover: () => setSelectedPartido(''),
    });
  }

  const semResultados =
    !partidosLoading &&
    !candidatosLoading &&
    partidosError === '' &&
    candidatosError === '' &&
    results.length === 0 &&
    candidatosResults.length === 0 &&
    politicosResults.length === 0;

  useEffect(() => {
    if (filtroSelecionado === 'partidos') {
      setPartidosOpen(true);
      setCandidatosOpen(false);
      setPoliticosOpen(false);
      return;
    }

    if (filtroSelecionado === 'candidatos') {
      setPartidosOpen(false);
      setCandidatosOpen(true);
      setPoliticosOpen(false);
      return;
    }

    if (filtroSelecionado === 'politicos') {
      setPartidosOpen(false);
      setCandidatosOpen(false);
      setPoliticosOpen(true);
      return;
    }

    if (filtroPartidoAtivo && !filtroCandidatoAtivo) {
      setPartidosOpen(true);
      setCandidatosOpen(false);
      setPoliticosOpen(false);
      return;
    }

    if (filtroCandidatoAtivo && !filtroPartidoAtivo) {
      setPartidosOpen(false);
      setCandidatosOpen(true);
      setPoliticosOpen(false);
      return;
    }

    if (searchedTerm.trim() === '') {
      setPartidosOpen(true);
      setCandidatosOpen(true);
      setPoliticosOpen(true);
      return;
    }

    const temPartidos = results.length > 0;
    const temCandidatos = candidatosResults.length > 0;
    const temPoliticos = politicosResults.length > 0;

    if (temPartidos && !temCandidatos && !temPoliticos) {
      setPartidosOpen(true);
      setCandidatosOpen(false);
      setPoliticosOpen(false);
      return;
    }

    if (!temPartidos && temCandidatos && !temPoliticos) {
      setPartidosOpen(false);
      setCandidatosOpen(true);
      setPoliticosOpen(false);
      return;
    }

    if (!temPartidos && !temCandidatos && temPoliticos) {
      setPartidosOpen(false);
      setCandidatosOpen(false);
      setPoliticosOpen(true);
      return;
    }

    if (temPartidos || temCandidatos || temPoliticos) {
      setPartidosOpen(temPartidos);
      setCandidatosOpen(temCandidatos);
      setPoliticosOpen(temPoliticos);
      return;
    }

    setPartidosOpen(false);
    setCandidatosOpen(false);
    setPoliticosOpen(false);
  }, [
    searchedTerm,
    results.length,
    candidatosResults.length,
    politicosResults.length,
    filtroPartidoAtivo,
    filtroCandidatoAtivo,
    selectedTipoCandidatura,
    filtroSelecionado,
  ]);

  // ---------------------------------------------------------------------------
  // CONTEÚDO DOS FILTROS
  // ---------------------------------------------------------------------------
  const classeSelect =
    'h-11 w-full appearance-none rounded-lg border border-[#2A2A72]/30 bg-white px-3 pr-10 text-[16px] font-medium normal-case tracking-normal text-[#333] outline-none lg:h-10 lg:text-[12px]';

  const filtros = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-[#2A2A72]/20 pb-6">
        <h3 className="text-[14px] font-black uppercase tracking-[0.12em] text-[#2A2A72]">
          Partidos
        </h3>

        <div className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
          Por ordem:
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFiltroSelecionado('partidos');
                toggleSort('nome');
              }}
              className={`flex h-10 flex-1 items-center justify-center gap-1 rounded-lg border px-3 text-left text-[11px] transition-colors ${sortBy === 'nome' ? 'border-[#2A2A72] bg-[#2A2A72] text-white' : 'border-[#2A2A72]/30 bg-white text-[#333]'}`}
              aria-label={`Ordenar partidos alfabeticamente em ordem ${sortBy === 'nome' && sortDirection === 'desc' ? 'decrescente' : 'crescente'}`}
            >
              Alfabética
              <span className="text-[16px]">{sortIcon('nome')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFiltroSelecionado('partidos');
                toggleSort('numero');
              }}
              className={`flex h-10 flex-1 items-center justify-center gap-1 rounded-lg border px-3 text-left text-[11px] transition-colors ${sortBy === 'numero' ? 'border-[#2A2A72] bg-[#2A2A72] text-white' : 'border-[#2A2A72]/30 bg-white text-[#333]'}`}
              aria-label={`Ordenar partidos numericamente em ordem ${sortBy === 'numero' && sortDirection === 'desc' ? 'decrescente' : 'crescente'}`}
            >
              Numérica
              <span className="text-[16px]">{sortIcon('numero')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-[14px] font-black uppercase tracking-[0.12em] text-[#2A2A72]">
          Candidatos
        </h3>

        <label className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
          Por estado
          <div className="relative">
            <select
              value={selectedEstadoCandidato}
              onChange={(event) => {
                setFiltroSelecionado('candidatos');
                setSelectedEstadoCandidato(event.target.value);
              }}
              className={classeSelect}
            >
              <option value="">Todos os estados</option>
              {estadosCandidatos.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            <FiChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#2A2A72]"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
          Tipo de candidatura
          <div className="relative">
            <select
              value={selectedTipoCandidatura}
              onChange={(event) => {
                setFiltroSelecionado('candidatos');
                setSelectedTipoCandidatura(event.target.value);
              }}
              className={classeSelect}
            >
              <option value="">Todos os tipos</option>
              {tiposCandidatura.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <FiChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#2A2A72]"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
          Por partido do candidato
          <div className="relative">
            <select
              value={selectedPartidoCandidato}
              onChange={(event) => {
                setFiltroSelecionado('candidatos');
                setSelectedPartidoCandidato(event.target.value);
              }}
              className={classeSelect}
            >
              <option value="">Todos os partidos</option>
              {partidosCandidatos.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.nome_completo}
                </option>
              ))}
            </select>
            <FiChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#2A2A72]"
            />
          </div>
        </label>

        <div className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
          Por ordem:
          <button
            type="button"
            onClick={toggleCandidatosSort}
            className="flex h-10 w-full items-center justify-between rounded-lg border border-[#2A2A72] bg-[#2A2A72] px-3 text-left text-[11px] text-white transition-colors"
            aria-label={`Ordenar candidatos alfabeticamente em ordem ${candidatosSortDirection === 'desc' ? 'decrescente' : 'crescente'}`}
          >
            Alfabética
            <span className="text-[16px]">
              {candidatosSortDirection === 'asc' ? (
                <FiArrowUp aria-hidden="true" />
              ) : (
                <FiArrowDown aria-hidden="true" />
              )}
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#2A2A72]/20 pt-6">
          <h3 className="text-[14px] font-black uppercase tracking-[0.12em] text-[#2A2A72]">
            Outros Políticos
          </h3>

          <div className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
            Por ordem:
            <button
              type="button"
              onClick={togglePoliticosSort}
              className="flex h-10 w-full items-center justify-between rounded-lg border border-[#2A2A72] bg-[#2A2A72] px-3 text-left text-[11px] text-white transition-colors"
              aria-label={`Ordenar políticos alfabeticamente em ordem ${politicosSortDirection === 'desc' ? 'decrescente' : 'crescente'}`}
            >
              Alfabética
              <span className="text-[16px]">
                {politicosSortDirection === 'asc' ? (
                  <FiArrowUp aria-hidden="true" />
                ) : (
                  <FiArrowDown aria-hidden="true" />
                )}
              </span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={limparFiltros}
          className="mt-2 flex h-10 w-full items-center justify-center rounded-lg border border-[#A72B2B] bg-white px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#A72B2B] transition-colors hover:bg-[#A72B2B] hover:text-white"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative isolate flow-root min-h-screen overflow-hidden bg-[#eaf6ff] lg:h-dvh lg:min-h-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-[#FFA400]/25" />
        <div className="absolute left-8 top-24 h-20 w-20 rounded-full bg-[#FFA400]/35" />
        <div className="absolute left-[18%] top-[28%] h-24 w-24 rounded-full bg-[#FFA400]/20" />
        <div className="absolute right-16 top-10 h-32 w-32 rounded-full bg-[#FFA400]/25" />
        <div className="absolute right-8 top-32 h-24 w-24 rounded-full bg-[#FFA400]/35" />
        <div className="absolute right-[-10px] top-[48%] h-20 w-20 rounded-full bg-[#FFA400]/25" />
        <div className="absolute bottom-10 left-1/3 h-28 w-28 rounded-full bg-[#FFA400]/30" />
        <div className="absolute bottom-0 left-[58%] h-40 w-40 rounded-full bg-[#FFA400]/25" />
        <div className="absolute bottom-[-18px] right-12 h-52 w-52 rounded-full bg-[#FFA400]/25" />
        <div className="absolute bottom-24 right-[28%] h-20 w-20 rounded-full bg-[#FFA400]/35" />
        <div className="absolute bottom-24 left-[-14px] h-24 w-24 rounded-full bg-[#FFA400]/25" />
        <div className="absolute left-[44%] top-[-10px] h-16 w-16 rounded-full bg-[#FFA400]/25" />
      </div>

      <div className="relative z-10 w-full">
        <Header isBgWhite disableScrollHide reservarEspaco />
      </div>

      <section className="relative z-10 isolate overflow-clip bg-transparent lg:h-[calc(100dvh-122px)]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col px-4 pb-10 pt-6 sm:px-10 sm:pt-10 lg:h-full lg:min-h-0 lg:flex-row lg:overflow-visible lg:px-0 lg:pb-0">
          <aside className="hidden w-full self-start pb-8 lg:block lg:h-full lg:w-1/4 lg:shrink-0 lg:self-stretch lg:overflow-x-hidden lg:overflow-y-auto lg:border-r-2 lg:border-[#2A2A72]/30 lg:pb-6 lg:pl-8 lg:pr-8 lg:[scrollbar-color:#2A2A72_#dbeafe] lg:[scrollbar-width:thin] lg:[&::-webkit-scrollbar]:w-2 lg:[&::-webkit-scrollbar-track]:bg-[#dbeafe] lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-thumb]:bg-[#2A2A72]/60">
            <h2 className="flex items-center gap-3 text-[18px] font-bold uppercase tracking-[0.12em] text-[#2A2A72]">
              <FiFilter aria-hidden="true" className="text-[22px]" />
              Filtrar
            </h2>

            <div className="mt-6">{filtros}</div>
          </aside>

          <div className="flex w-full flex-col items-stretch gap-4 lg:min-h-0 lg:overflow-visible lg:pl-10 lg:pr-4">
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-[760px] items-center gap-2 sm:gap-3"
            >
              <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border-2 border-[#2A2A72] bg-white px-4 sm:h-14 sm:px-5">
                <input
                  id="searchpol-search"
                  type="search"
                  value={search}
                  onChange={(event) => {
                    const nextSearch = event.target.value;

                    setSearch(nextSearch);
                    setSearchedTerm(normalizarTexto(nextSearch.trim()));
                  }}
                  placeholder={
                    isSm
                      ? 'Digite o nome de um partido, candidato ou político'
                      : 'Buscar partido ou político'
                  }
                  className="min-w-0 flex-1 bg-transparent text-[16px] text-[#333] outline-none placeholder:text-[#7b7b91] sm:text-[14px]"
                />
              </div>

              <button
                type="submit"
                aria-label="Pesquisar"
                title="Pesquisar"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFA400] text-white transition-transform hover:opacity-85 sm:h-14 sm:w-14"
              >
                <FiSearch aria-hidden="true" className="text-[22px]" />
              </button>
            </form>
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setFiltrosOpen(true)}
                aria-haspopup="dialog"
                className="flex h-10 shrink-0 items-center gap-2 rounded-full border-2 border-[#2A2A72] bg-white px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72] transition-colors hover:bg-[#2A2A72] hover:text-white"
              >
                <FiFilter aria-hidden="true" className="text-[16px]" />
                Filtrar
                {chipsAtivos.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFA400] px-1 text-[11px] font-black text-white">
                    {chipsAtivos.length}
                  </span>
                )}
              </button>

              {chipsAtivos.length > 0 && (
                <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {chipsAtivos.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={chip.remover}
                      aria-label={`Remover filtro ${chip.label}`}
                      className="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[#2A2A72] px-3 text-[11px] font-bold uppercase tracking-[0.06em] text-white"
                    >
                      {chip.label}
                      <FiX aria-hidden="true" className="text-[14px]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              ref={resultadosRef}
              className="flex min-h-0 flex-1 flex-col gap-4 lg:-mr-14 lg:overflow-x-hidden lg:overflow-y-auto lg:pr-20 lg:[scrollbar-color:#2A2A72_#dbeafe] lg:[scrollbar-width:thin] lg:[&::-webkit-scrollbar]:w-2 lg:[&::-webkit-scrollbar-track]:bg-[#dbeafe] lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-thumb]:bg-[#2A2A72]/60"
            >
              {filtroSelecionado !== 'candidatos' &&
                !filtroCandidatoAtivo &&
                (searchedTerm === '' ||
                  results.length > 0 ||
                  partidosLoading ||
                  partidosError !== '') && (
                  <CabecalhoSecao
                    titulo="Partidos"
                    rotulo="partidos"
                    aberto={partidosOpen}
                    onToggle={() => setPartidosOpen((current) => !current)}
                    className="mt-3 lg:mt-5"
                  />
                )}

              {partidosOpen && (
                <>
                  {partidosLoading && (
                    <p className="text-center text-sm text-[#2A2A72]">
                      Carregando partidos...
                    </p>
                  )}
                  {partidosError && (
                    <p
                      role="alert"
                      className="text-center text-sm text-red-700"
                    >
                      {partidosError}
                    </p>
                  )}
                  {!partidosLoading && !partidosError && (
                    <div className="grid w-full max-w-[960px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                      {results.map((party) => (
                        <CardPartido
                          key={party.id}
                          party={party}
                          onClick={() =>
                            navigate(
                              `/pagina_partido?numero=${encodeURIComponent(String(party.numero_legenda))}`,
                            )
                          }
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {filtroSelecionado !== 'partidos' &&
                filtroSelecionado !== 'politicos' &&
                !filtroPartidoAtivo &&
                (searchedTerm.trim() === '' ||
                  candidatosResults.length > 0) && (
                  <CabecalhoSecao
                    titulo="Candidatos"
                    rotulo="candidatos"
                    aberto={candidatosOpen}
                    onToggle={() => setCandidatosOpen((current) => !current)}
                    className="my-2"
                  />
                )}

              {candidatosOpen && (
                <>
                  {candidatosLoading && (
                    <p className="text-center text-sm text-[#2A2A72]">
                      Carregando candidatos...
                    </p>
                  )}

                  {!candidatosLoading && candidatosError && (
                    <p className="text-[14px] text-[#A72B2B]">
                      Não foi possível carregar candidatos e políticos.
                    </p>
                  )}

                  {!candidatosLoading && !candidatosError && (
                    <div className="grid w-full max-w-[960px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                      {candidatosResults.map((candidate) => {
                        const nome =
                          candidate.nome_politico || candidate.nome_completo;

                        return (
                          <CardPessoa
                            key={candidate.id}
                            foto={candidate.foto_url}
                            nome={nome}
                            etiqueta={etiquetaCandidatura(
                              candidate.candidatura,
                            )}
                            subtitulo={
                              candidate.partidos?.nome_completo ||
                              'Partido não informado'
                            }
                            rodape={
                              candidate.uf_candidatura ||
                              candidate.uf_naturalidade ||
                              'UF não informada'
                            }
                            destaque={candidate.numero_urna || 'N/A'}
                            ariaLabel={`Ver informações de ${nome}`}
                            onClick={() =>
                              navigate(
                                `/pagina_politico?id=${encodeURIComponent(candidate.id)}`,
                              )
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {filtroSelecionado !== 'partidos' &&
                filtroSelecionado !== 'candidatos' &&
                !filtroPartidoAtivo &&
                !filtroCandidatoAtivo &&
                (searchedTerm.trim() === '' || politicosResults.length > 0) && (
                  <CabecalhoSecao
                    titulo="Outros Políticos"
                    rotulo="políticos"
                    aberto={politicosOpen}
                    onToggle={() => setPoliticosOpen((current) => !current)}
                    className="my-2"
                  />
                )}

              {politicosOpen &&
                filtroSelecionado !== 'partidos' &&
                filtroSelecionado !== 'candidatos' &&
                !filtroPartidoAtivo &&
                !filtroCandidatoAtivo && (
                  <>
                    {candidatosLoading && (
                      <p className="text-center text-sm text-[#2A2A72]">
                        Carregando políticos...
                      </p>
                    )}

                    {!candidatosLoading && candidatosError && (
                      <p className="text-[14px] text-[#A72B2B]">
                        Não foi possível carregar candidatos e políticos.
                      </p>
                    )}

                    {!candidatosLoading && !candidatosError && (
                      <div className="grid w-full max-w-[960px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                        {politicosResults.map((politico) => {
                          const nome =
                            politico.nome_politico || politico.nome_completo;

                          return (
                            <CardPessoa
                              key={politico.id}
                              foto={politico.foto_url}
                              nome={nome}
                              etiqueta="Político(a)"
                              subtitulo={
                                politico.cargo_atual || 'Cargo não informado'
                              }
                              rodape={
                                politico.partidos?.sigla ||
                                politico.partidos?.nome_completo ||
                                'Partido não informado'
                              }
                              ariaLabel={`Ver informações de ${nome}`}
                              onClick={() =>
                                navigate(
                                  `/pagina_politico?id=${encodeURIComponent(politico.id)}`,
                                )
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

              {semResultados && (
                <div className="flex flex-col items-center gap-3 py-10 text-center text-[#2A2A72]">
                  <p className="text-[16px] font-bold">
                    Nenhum resultado encontrado.
                  </p>
                  <p className="max-w-[320px] text-[13px] text-[#333]/70">
                    Tente outro termo de busca ou ajuste os filtros.
                  </p>
                  <button
                    type="button"
                    onClick={limparFiltros}
                    className="h-10 rounded-lg border border-[#A72B2B] bg-white px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#A72B2B] transition-colors hover:bg-[#A72B2B] hover:text-white"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {filtrosOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="filtros-titulo"
          className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center sm:p-6 lg:hidden"
        >
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={() => setFiltrosOpen(false)}
            className="absolute inset-0 cursor-default bg-[#0f0c3c]/60 backdrop-blur-[2px]"
          />

          <div className="relative flex max-h-[88dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[28px] bg-[#eaf6ff] shadow-[0_-12px_40px_rgba(15,12,60,0.35)] sm:rounded-[28px]">
            <div className="flex items-center justify-between border-b border-[#2A2A72]/15 px-5 pb-4 pt-5">
              <h2
                id="filtros-titulo"
                className="flex items-center gap-3 text-[16px] font-bold uppercase tracking-[0.12em] text-[#2A2A72]"
              >
                <FiFilter aria-hidden="true" className="text-[20px]" />
                Filtrar
              </h2>
              <button
                type="button"
                autoFocus
                onClick={() => setFiltrosOpen(false)}
                aria-label="Fechar filtros"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2A2A72] transition-colors hover:bg-[#2A2A72] hover:text-white"
              >
                <FiX aria-hidden="true" className="text-[18px]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">{filtros}</div>

            <div className="border-t border-[#2A2A72]/15 bg-[#eaf6ff] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setFiltrosOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-[#2A2A72] text-[13px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_0_#16142a] transition-transform active:translate-y-1 active:shadow-[0_1px_0_#16142a]"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPol;
