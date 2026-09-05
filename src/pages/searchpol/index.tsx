import { FiChevronDown, FiChevronUp, FiFilter, FiSearch } from 'react-icons/fi';
import { FormEvent, useEffect, useState } from 'react';
import Header from '../../components/header';
import { Candidato, listarCandidatos } from '../../services/api';

const partidos = [
  {
    keyword: 'agir',
    nome: 'AGIR',
    sigla: 'AGIR',
    numero: '36',
    foto: '/logos/partidos/agir.svg',
    cor: '#6a9dde',
    borda: '#456691',
  },
  {
    keyword: 'avante',
    nome: 'AVANTE',
    sigla: 'AVANTE',
    numero: '70',
    foto: '/logos/partidos/avante.svg',
    cor: '#f3854c',
    borda: '#a65b34',
  },
  {
    keyword: 'cidadania',
    nome: 'CIDADANIA',
    sigla: 'CIDADANIA',
    numero: '23',
    foto: '/logos/partidos/cidadania.svg',
    cor: '#ed0277',
    borda: '#a00150',
  },
  {
    keyword: 'democracia crista',
    nome: 'DEMOCRACIA CRISTÃ',
    sigla: 'DC',
    numero: '27',
    foto: '/logos/partidos/dc.svg',
    cor: '#6161c0',
    borda: '#3a3a73',
  },
  {
    keyword: 'democrata',
    nome: 'DEMOCRATAS',
    sigla: 'DEMOCRATA',
    numero: '20',
    foto: '/logos/partidos/democrata.svg',
    cor: '#ddffad',
    borda: '#9ab279',
  },
  {
    keyword: 'mdb',
    nome: 'MOVIMENTO DEMOCRÁTICO BRASILEIRO',
    sigla: 'MDB',
    numero: '15',
    foto: '/logos/partidos/mdb.svg',
    cor: '#6bcf9b',
    borda: '#438261',
  },
  {
    keyword: 'missao',
    nome: 'MISSÃO',
    sigla: 'MISSÃO',
    numero: '14',
    foto: '/logos/partidos/missao.svg',
    cor: '#fbc84b',
    borda: '#ae8b34',
  },
  {
    keyword: 'mobiliza',
    nome: 'MOBILIZA',
    sigla: 'MOBILIZA',
    numero: '33',
    foto: '/logos/partidos/mobiliza.svg',
    cor: '#ffffff',
    borda: '#b2b2b2',
  },
  {
    keyword: 'novo',
    nome: 'NOVO',
    sigla: 'NOVO',
    numero: '30',
    foto: '/logos/partidos/novo.svg',
    cor: '#f1f1f1',
    borda: '#a5a5a5',
  },
  {
    keyword: 'pcb',
    nome: 'PARTIDO COMUNISTA BRASILEIRO',
    sigla: 'PCB',
    numero: '21',
    foto: '/logos/partidos/pcb.svg',
    cor: '#ff3434',
    borda: '#b22424',
  },
  {
    keyword: 'pcdob',
    nome: 'PARTIDO COMUNISTA DO BRASIL',
    sigla: 'PCdoB',
    numero: '65',
    foto: '/logos/partidos/pcdob.svg',
    cor: '#da251c',
    borda: '#8d1812',
  },
  {
    keyword: 'pco',
    nome: 'PARTIDO DA CAUSA OPERÁRIA',
    sigla: 'PCO',
    numero: '29',
    foto: '/logos/partidos/pco.svg',
    cor: '#c90b1c',
    borda: '#7c0611',
  },
  {
    keyword: 'pdt',
    nome: 'PARTIDO DEMOCRÁTICO TRABALHISTA',
    sigla: 'PDT',
    numero: '12',
    foto: '/logos/partidos/pdt.svg',
    cor: '#27AE60',
    borda: '#156135',
  },
  {
    keyword: 'pl',
    nome: 'PARTIDO LIBERAL',
    sigla: 'PL',
    numero: '22',
    foto: '/logos/partidos/pl.svg',
    cor: '#0075eb',
    borda: '#004e9e',
  },
  {
    keyword: 'pode',
    nome: 'PODEMOS',
    sigla: 'PODE',
    numero: '20',
    foto: '/logos/partidos/pode.svg',
    cor: '#6fd571',
    borda: '#478848',
  },
  {
    keyword: 'pp',
    nome: 'PROGRESSISTAS',
    sigla: 'PP',
    numero: '11',
    foto: '/logos/partidos/pp.svg',
    cor: '#a8d6ee',
    borda: '#7191a1',
  },
  {
    keyword: 'prd',
    nome: 'PARTIDO RENOVAÇÃO DEMOCRÁTICA',
    sigla: 'PRD',
    numero: '25',
    foto: '/logos/partidos/prd.svg',
    cor: '#d8c35a',
    borda: '#8b7d3a',
  },
  {
    keyword: 'prtb',
    nome: 'PARTIDO RENOVADOR TRABALHISTA BRASILEIRO',
    sigla: 'PRTB',
    numero: '28',
    foto: '/logos/partidos/prtb.svg',
    cor: '#7ebe6c',
    borda: '#4b7140',
  },
  {
    keyword: 'psb',
    nome: 'PARTIDO SOCIALISTA BRASILEIRO',
    sigla: 'PSB',
    numero: '40',
    foto: '/logos/partidos/psb.svg',
    cor: '#e34450',
    borda: '#962d35',
  },
  {
    keyword: 'psd',
    nome: 'PARTIDO SOCIAL DEMOCRÁTICO',
    sigla: 'PSD',
    numero: '55',
    foto: '/logos/partidos/psd.svg',
    cor: '#386edc',
    borda: '#24478f',
  },
  {
    keyword: 'psdb',
    nome: 'PARTIDO DA SOCIAL DEMOCRACIA BRASILEIRA',
    sigla: 'PSDB',
    numero: '45',
    foto: '/logos/partidos/psdb.svg',
    cor: '#f3bb34',
    borda: '#a68023',
  },
  {
    keyword: 'psol',
    nome: 'PARTIDO SOCIALISMO E LIBERDADE',
    sigla: 'PSOL',
    numero: '50',
    foto: '/logos/partidos/psol.svg',
    cor: '#953fb5',
    borda: '#562468',
  },
  {
    keyword: 'pstu',
    nome: 'PARTIDO SOCIALISTA DOS TRABALHADORES UNIFICADO',
    sigla: 'PSTU',
    numero: '16',
    foto: '/logos/partidos/pstu.svg',
    cor: '#ff7979',
    borda: '#b25454',
  },
  {
    keyword: 'pt',
    nome: 'PARTIDO DOS TRABALHADORES',
    sigla: 'PT',
    numero: '13',
    foto: '/logos/partidos/pt.svg',
    cor: '#e4142c',
    borda: '#970d1d',
  },
  {
    keyword: 'pv',
    nome: 'PARTIDO VERDE',
    sigla: 'PV',
    numero: '43',
    foto: '/logos/partidos/pv.svg',
    cor: '#299329',
    borda: '#134613',
  },
  {
    keyword: 'rede',
    nome: 'REDE SUSTENTABILIDADE',
    sigla: 'REDE',
    numero: '18',
    foto: '/logos/partidos/rede.svg',
    cor: '#63b9c2',
    borda: '#3b7075',
  },
  {
    keyword: 'republicanos',
    nome: 'REPUBLICANOS',
    sigla: 'REPUBLICANOS',
    numero: '10',
    foto: '/logos/partidos/republicanos.svg',
    cor: '#2D9CDB',
    borda: '#17628D',
  },
  {
    keyword: 'solidariedade',
    nome: 'SOLIDARIEDADE',
    sigla: 'SOLIDARIEDADE',
    numero: '77',
    foto: '/logos/partidos/solidariedade.svg',
    cor: '#f39963',
    borda: '#a66843',
  },
  {
    keyword: 'uniao',
    nome: 'UNIÃO BRASIL',
    sigla: 'UNIÃO',
    numero: '44',
    foto: '/logos/partidos/uniao.svg',
    cor: '#fbd64f',
    borda: '#ae9436',
  },
  {
    keyword: 'up',
    nome: 'UNIDADE POPULAR',
    sigla: 'UP',
    numero: '80',
    foto: '/logos/partidos/up.svg',
    cor: '#8a8a8a',
    borda: '#494949',
  },
];

function SearchPol() {
  const [search, setSearch] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
  const [selectedPartido, setSelectedPartido] = useState('');
  const [selectedEstadoCandidato, setSelectedEstadoCandidato] = useState('');
  const [selectedPartidoCandidato, setSelectedPartidoCandidato] = useState('');
  const [filtroSelecionado, setFiltroSelecionado] = useState<
    'partidos' | 'candidatos' | null
  >(null);
  const [sortBy, setSortBy] = useState<'nome' | 'numero'>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [candidatosSortDirection, setCandidatosSortDirection] = useState<
    'asc' | 'desc'
  >('asc');
  const [partidosOpen, setPartidosOpen] = useState(true);
  const [candidatosOpen, setCandidatosOpen] = useState(true);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [candidatosLoading, setCandidatosLoading] = useState(true);
  const [candidatosError, setCandidatosError] = useState('');

  useEffect(() => {
    const carregarCandidatos = async () => {
      try {
        setCandidatos(await listarCandidatos());
      } catch {
        setCandidatosError('Não foi possível carregar os candidatos.');
      } finally {
        setCandidatosLoading(false);
      }
    };

    carregarCandidatos();
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchedTerm(search.trim().toLowerCase());
  };

  const results = [...partidos]
    .filter(
      (party) =>
        (searchedTerm === '' ||
          party.keyword.includes(searchedTerm) ||
          party.nome.toLowerCase().includes(searchedTerm)) &&
        (!selectedPartido || party.nome === selectedPartido),
    )
    .sort((firstParty, secondParty) => {
      const comparison =
        sortBy === 'nome'
          ? firstParty.nome.localeCompare(secondParty.nome, 'pt-BR')
          : Number(firstParty.numero) - Number(secondParty.numero);

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
      return <FiChevronUp aria-hidden="true" />;
    }

    return <FiChevronDown aria-hidden="true" />;
  };

  const toggleCandidatosSort = () => {
    setFiltroSelecionado('candidatos');
    setCandidatosSortDirection((currentDirection) =>
      currentDirection === 'asc' ? 'desc' : 'asc',
    );
  };

  const limparFiltros = () => {
    setSelectedPartido('');
    setSelectedEstadoCandidato('');
    setSelectedPartidoCandidato('');
    setFiltroSelecionado(null);
  };

  const candidatosResults = [...candidatos]
    .filter((candidate) => {
      const termo = searchedTerm;
      const nome = (
        candidate.nome_politico || candidate.nome_completo
      ).toLowerCase();
      const partido = candidate.partidos?.nome_completo.toLowerCase() || '';

      return (
        (termo === '' ||
          nome.includes(termo) ||
          candidate.nome_completo.toLowerCase().includes(termo) ||
          partido.includes(termo)) &&
        (!selectedEstadoCandidato ||
          candidate.uf_candidatura === selectedEstadoCandidato) &&
        (!selectedPartidoCandidato ||
          candidate.partidos?.id === selectedPartidoCandidato)
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

  const estadosCandidatos = [
    ...new Set(
      candidatos
        .map((candidate) => candidate.uf_candidatura)
        .filter((estado): estado is string => Boolean(estado)),
    ),
  ].sort((firstState, secondState) =>
    firstState.localeCompare(secondState, 'pt-BR'),
  );

  const partidosCandidatos = candidatos
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
    selectedEstadoCandidato !== '' || selectedPartidoCandidato !== '';

  useEffect(() => {
    if (filtroSelecionado === 'partidos') {
      setPartidosOpen(true);
      setCandidatosOpen(false);
      return;
    }

    if (filtroSelecionado === 'candidatos') {
      setPartidosOpen(false);
      setCandidatosOpen(true);
      return;
    }

    if (filtroPartidoAtivo && !filtroCandidatoAtivo) {
      setPartidosOpen(true);
      setCandidatosOpen(false);
      return;
    }

    if (filtroCandidatoAtivo && !filtroPartidoAtivo) {
      setPartidosOpen(false);
      setCandidatosOpen(true);
      return;
    }

    if (searchedTerm.trim() === '') {
      setPartidosOpen(true);
      setCandidatosOpen(true);
      return;
    }

    const temPartidos = results.length > 0;
    const temCandidatos = candidatosResults.length > 0;

    if (temPartidos && !temCandidatos) {
      setPartidosOpen(true);
      setCandidatosOpen(false);
      return;
    }

    if (!temPartidos && temCandidatos) {
      setPartidosOpen(false);
      setCandidatosOpen(true);
      return;
    }

    if (temPartidos && temCandidatos) {
      setPartidosOpen(true);
      setCandidatosOpen(true);
      return;
    }

    setPartidosOpen(false);
    setCandidatosOpen(false);
  }, [
    searchedTerm,
    results.length,
    candidatosResults.length,
    filtroPartidoAtivo,
    filtroCandidatoAtivo,
    filtroSelecionado,
  ]);

  return (
    <>
      <div className="w-full">
        <Header isBgWhite />
      </div>

      <section className="relative isolate overflow-hidden bg-transparent">
        <div className="pointer-events-none absolute inset-0 -z-10">
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

        <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1200px] flex-col px-6 pt-8 sm:px-10 sm:pt-10 lg:flex-row lg:px-0">
          <aside className="w-full pb-8 lg:w-1/4 lg:border-r-2 lg:border-[#2A2A72]/30 lg:pb-0 lg:pl-8 lg:pr-8">
            <h2 className="flex items-center gap-3 text-[18px] font-bold uppercase tracking-[0.12em] text-[#2A2A72]">
              <FiFilter aria-hidden="true" className="text-[22px]" />
              Filtrar
            </h2>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex flex-col gap-4 border-b border-[#2A2A72]/20 pb-6">
                <h3 className="text-[14px] font-black uppercase tracking-[0.12em] text-[#2A2A72]">
                  Partidos
                </h3>

                <label className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
                  Filtrar partido
                  <select
                    value={selectedPartido}
                    onChange={(event) => {
                      setFiltroSelecionado('partidos');
                      setSelectedPartido(event.target.value);
                    }}
                    className="h-10 rounded-lg border border-[#2A2A72]/30 bg-white px-3 text-[12px] font-medium normal-case tracking-normal text-[#333] outline-none"
                  >
                    <option value="">Todos os partidos</option>
                    {partidos.map((party) => (
                      <option key={party.keyword} value={party.nome}>
                        {party.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
                  Ordenar partidos
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFiltroSelecionado('partidos');
                        toggleSort('nome');
                      }}
                      className={`flex h-10 flex-1 items-center justify-between rounded-lg border px-3 text-left text-[11px] transition-colors ${sortBy === 'nome' ? 'border-[#2A2A72] bg-[#2A2A72] text-white' : 'border-[#2A2A72]/30 bg-white text-[#333]'}`}
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
                      className={`flex h-10 flex-1 items-center justify-between rounded-lg border px-3 text-left text-[11px] transition-colors ${sortBy === 'numero' ? 'border-[#2A2A72] bg-[#2A2A72] text-white' : 'border-[#2A2A72]/30 bg-white text-[#333]'}`}
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
                  Filtrar estado
                  <select
                    value={selectedEstadoCandidato}
                    onChange={(event) => {
                      setFiltroSelecionado('candidatos');
                      setSelectedEstadoCandidato(event.target.value);
                    }}
                    className="h-10 rounded-lg border border-[#2A2A72]/30 bg-white px-3 text-[12px] font-medium normal-case tracking-normal text-[#333] outline-none"
                  >
                    <option value="">Todos os estados</option>
                    {estadosCandidatos.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
                  Filtrar partido do candidato
                  <select
                    value={selectedPartidoCandidato}
                    onChange={(event) => {
                      setFiltroSelecionado('candidatos');
                      setSelectedPartidoCandidato(event.target.value);
                    }}
                    className="h-10 rounded-lg border border-[#2A2A72]/30 bg-white px-3 text-[12px] font-medium normal-case tracking-normal text-[#333] outline-none"
                  >
                    <option value="">Todos os partidos</option>
                    {partidosCandidatos.map((party) => (
                      <option key={party.id} value={party.id}>
                        {party.nome_completo}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
                  Ordenar candidatos
                  <button
                    type="button"
                    onClick={toggleCandidatosSort}
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-[#2A2A72] bg-[#2A2A72] px-3 text-left text-[11px] text-white transition-colors"
                    aria-label={`Ordenar candidatos alfabeticamente em ordem ${candidatosSortDirection === 'desc' ? 'decrescente' : 'crescente'}`}
                  >
                    Alfabética
                    <span className="text-[16px]">
                      {candidatosSortDirection === 'asc' ? (
                        <FiChevronUp aria-hidden="true" />
                      ) : (
                        <FiChevronDown aria-hidden="true" />
                      )}
                    </span>
                  </button>
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
          </aside>

          <div className="flex w-full flex-col items-stretch gap-4 lg:pl-10">
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-[760px] items-center gap-3"
            >
              <div className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-full border-2 border-[#2A2A72] bg-white px-5">
                <input
                  id="searchpol-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Digite o nome de um partido ou candidato"
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-[#333] outline-none placeholder:text-[#7b7b91] sm:text-[14px]"
                />
              </div>

              <button
                type="submit"
                aria-label="Pesquisar"
                title="Pesquisar"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FFA400] text-white transition-transform hover:opacity-85"
              >
                <FiSearch aria-hidden="true" className="text-[22px]" />
              </button>
            </form>

            {filtroSelecionado !== 'candidatos' &&
              !filtroCandidatoAtivo &&
              (searchedTerm.trim() === '' || results.length > 0) && (
                <div className="relative -ml-4 mr-[-2.5rem] mt-5 w-[calc(100%+5rem)]">
                  <div className="flex w-full items-center gap-4 text-[#2A2A72]">
                    <div className="h-px min-w-0 flex-1 bg-[#2A2A72]/30" />
                    <h2 className="shrink-0 text-[18px] font-bold uppercase tracking-[0.12em]">
                      Partidos
                    </h2>
                    <div className="h-px min-w-0 flex-1 bg-[#2A2A72]/30" />
                    <button
                      type="button"
                      onClick={() => setPartidosOpen((current) => !current)}
                      className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2A2A72]/30 bg-white text-[#2A2A72] transition-colors hover:bg-[#2A2A72] hover:text-white"
                      aria-expanded={partidosOpen}
                      aria-label={
                        partidosOpen ? 'Ocultar partidos' : 'Mostrar partidos'
                      }
                    >
                      {partidosOpen ? (
                        <FiChevronUp
                          aria-hidden="true"
                          className="text-[18px]"
                        />
                      ) : (
                        <FiChevronDown
                          aria-hidden="true"
                          className="text-[18px]"
                        />
                      )}
                    </button>
                  </div>
                </div>
              )}

            {partidosOpen && (
              <div className="grid w-full max-w-[960px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((party) => (
                  <article
                    key={party.keyword}
                    className="flex min-h-[200px] w-full flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center"
                    style={{
                      borderColor: party.borda,
                      backgroundColor: party.cor,
                    }}
                  >
                    <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-white/40 p-3">
                      <img
                        src={party.foto}
                        alt={`Logo de ${party.nome}`}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex w-full min-w-0 items-end justify-between gap-3 text-left">
                      <div className="flex min-w-0 max-w-[75%] flex-col items-start">
                        <h2 className="max-w-full text-[10px] font-bold uppercase opacity-60 tracking-[0.12em]">
                          PARTIDO
                        </h2>
                        <p className="max-w-full break-words text-[15px] font-bold leading-tight tracking-[0.06em]">
                          {party.nome}
                        </p>
                      </div>
                      <p className="shrink-0 text-[20px] font-black leading-tight opacity-60 tracking-[0.06em]">
                        {party.numero}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {filtroSelecionado !== 'partidos' &&
              !filtroPartidoAtivo &&
              (searchedTerm.trim() === '' || candidatosResults.length > 0) && (
                <div className="relative -ml-4 mr-[-2.5rem] my-2 w-[calc(100%+5rem)]">
                  <div className="flex w-full items-center gap-4 text-[#2A2A72]">
                    <div className="h-px min-w-0 flex-1 bg-[#2A2A72]/30" />
                    <h2 className="shrink-0 text-[18px] font-bold uppercase tracking-[0.12em]">
                      Candidatos
                    </h2>
                    <div className="h-px min-w-0 flex-1 bg-[#2A2A72]/30" />
                    <button
                      type="button"
                      onClick={() => setCandidatosOpen((current) => !current)}
                      className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2A2A72]/30 bg-white text-[#2A2A72] transition-colors hover:bg-[#2A2A72] hover:text-white"
                      aria-expanded={candidatosOpen}
                      aria-label={
                        candidatosOpen
                          ? 'Ocultar candidatos'
                          : 'Mostrar candidatos'
                      }
                    >
                      {candidatosOpen ? (
                        <FiChevronUp
                          aria-hidden="true"
                          className="text-[18px]"
                        />
                      ) : (
                        <FiChevronDown
                          aria-hidden="true"
                          className="text-[18px]"
                        />
                      )}
                    </button>
                  </div>
                </div>
              )}

            {candidatosOpen && (
              <>
                {candidatosLoading && (
                  <p className="text-[14px] text-[#2A2A72]">
                    Carregando candidatos...
                  </p>
                )}

                {!candidatosLoading && candidatosError && (
                  <p className="text-[14px] text-[#A72B2B]">
                    {candidatosError}
                  </p>
                )}

                {!candidatosLoading && !candidatosError && (
                  <div className="grid w-full max-w-[960px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {candidatosResults.map((candidate) => (
                      <article
                        key={candidate.id}
                        className="flex min-h-[300px] w-full flex-col overflow-hidden rounded-2xl border-2 border-[#2A2A72] bg-white text-[#2A2A72]"
                      >
                        <div className="flex h-44 w-full shrink-0 items-center justify-center overflow-hidden bg-[#2A2A72]">
                          {candidate.foto_url ? (
                            <img
                              src={candidate.foto_url}
                              alt={`Foto de ${candidate.nome_politico || candidate.nome_completo}`}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover object-[center_20%]"
                            />
                          ) : (
                            <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/70">
                              Sem foto
                            </span>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2A2A72]/70">
                            Candidato a{' '}
                            {candidate.candidatura?.toLowerCase() ||
                              'cargo não informado'}
                          </p>
                          <h3 className="mt-1 break-words text-[20px] font-bold uppercase leading-tight">
                            {candidate.nome_politico || candidate.nome_completo}
                          </h3>
                          <p className="mt-2 text-[14px] font-semibold text-[#333]">
                            {candidate.partidos?.nome_completo ||
                              'Partido não informado'}
                          </p>
                          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#333]">
                              {candidate.uf_candidatura ||
                                candidate.uf_naturalidade ||
                                'UF não informada'}
                            </p>
                            <p className="text-[24px] font-black leading-none text-[#FFA400]">
                              {candidate.numero_candidatura ||
                                candidate.numero_urna ||
                                'N/A'}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default SearchPol;
