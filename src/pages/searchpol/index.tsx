import { FiFilter, FiSearch } from 'react-icons/fi';
import { FormEvent, useState } from 'react';
import Header from '../../components/header';

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
    nome: 'DEMOCRATA',
    sigla: 'DEMOCRATA',
    numero: '20',
    foto: '/logos/partidos/democrata.svg',
    cor: '#ddffad',
    borda: '#9ab279',
  },
  {
    keyword: 'mdb',
    nome: 'MDB',
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
    numero: '10',
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
    nome: 'PCB',
    sigla: 'PCB',
    numero: '21',
    foto: '/logos/partidos/pcb.svg',
    cor: '#ff3434',
    borda: '#b22424',
  },
  {
    keyword: 'pcdob',
    nome: 'PCdoB',
    sigla: 'PCdoB',
    numero: '65',
    foto: '/logos/partidos/pcdob.svg',
    cor: '#da251c',
    borda: '#8d1812',
  },
  {
    keyword: 'pco',
    nome: 'PCO',
    sigla: 'PCO',
    numero: '29',
    foto: '/logos/partidos/pco.svg',
    cor: '#c90b1c',
    borda: '#7c0611',
  },
  {
    keyword: 'pdt',
    nome: 'PDT',
    sigla: 'PDT',
    numero: '12',
    foto: '/logos/partidos/pdt.svg',
    cor: '#27AE60',
    borda: '#156135',
  },
  {
    keyword: 'pl',
    nome: 'PL',
    sigla: 'PL',
    numero: '22',
    foto: '/logos/partidos/pl.svg',
    cor: '#0075eb',
    borda: '#004e9e',
  },
  {
    keyword: 'pode',
    nome: 'PODE',
    sigla: 'PODE',
    numero: '20',
    foto: '/logos/partidos/pode.svg',
    cor: '#6fd571',
    borda: '#478848',
  },
  {
    keyword: 'pp',
    nome: 'PP',
    sigla: 'PP',
    numero: '11',
    foto: '/logos/partidos/pp.svg',
    cor: '#a8d6ee',
    borda: '#7191a1',
  },
  {
    keyword: 'prd',
    nome: 'PRD',
    sigla: 'PRD',
    numero: '25',
    foto: '/logos/partidos/prd.svg',
    cor: '#d8c35a',
    borda: '#8b7d3a',
  },
  {
    keyword: 'prtb',
    nome: 'PRTB',
    sigla: 'PRTB',
    numero: '28',
    foto: '/logos/partidos/prtb.svg',
    cor: '#7ebe6c',
    borda: '#4b7140',
  },
  {
    keyword: 'psb',
    nome: 'PSB',
    sigla: 'PSB',
    numero: '40',
    foto: '/logos/partidos/psb.svg',
    cor: '#e34450',
    borda: '#962d35',
  },
  {
    keyword: 'psd',
    nome: 'PSD',
    sigla: 'PSD',
    numero: '55',
    foto: '/logos/partidos/psd.svg',
    cor: '#386edc',
    borda: '#24478f',
  },
  {
    keyword: 'psdb',
    nome: 'PSDB',
    sigla: 'PSDB',
    numero: '45',
    foto: '/logos/partidos/psdb.svg',
    cor: '#f3bb34',
    borda: '#a68023',
  },
  {
    keyword: 'psol',
    nome: 'PSOL',
    sigla: 'PSOL',
    numero: '50',
    foto: '/logos/partidos/psol.svg',
    cor: '#953fb5',
    borda: '#562468',
  },
  {
    keyword: 'pstu',
    nome: 'PSTU',
    sigla: 'PSTU',
    numero: '16',
    foto: '/logos/partidos/pstu.svg',
    cor: '#ff2d2d',
    borda: '#b21f1f',
  },
  {
    keyword: 'pt',
    nome: 'PT',
    sigla: 'PT',
    numero: '13',
    foto: '/logos/partidos/pt.svg',
    cor: '#e4142c',
    borda: '#970d1d',
  },
  {
    keyword: 'pv',
    nome: 'PV',
    sigla: 'PV',
    numero: '43',
    foto: '/logos/partidos/pv.svg',
    cor: '#299329',
    borda: '#134613',
  },
  {
    keyword: 'rede',
    nome: 'REDE',
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

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchedTerm(search.trim().toLowerCase());
  };

  const results = [...partidos]
    .sort((firstParty, secondParty) =>
      firstParty.nome.localeCompare(secondParty.nome, 'pt-BR'),
    )
    .filter(
      (party) =>
        (searchedTerm === '' ||
          party.keyword.includes(searchedTerm) ||
          party.nome.toLowerCase().includes(searchedTerm)) &&
        (!selectedPartido || party.nome === selectedPartido),
    );

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

            <div className="mt-6 flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
                Partido
                <select
                  value={selectedPartido}
                  onChange={(event) => setSelectedPartido(event.target.value)}
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
            </div>
          </aside>

          <div className="flex w-full flex-1 flex-col items-stretch gap-4 lg:pl-10">
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

            <div className="grid w-full max-w-[960px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((party) => (
                <article
                  key={party.keyword}
                  className="flex min-h-[290px] w-full flex-col items-center gap-3 rounded-2xl border-2 p-4 text-center"
                  style={{
                    borderColor: party.borda,
                    backgroundColor: party.cor,
                  }}
                >
                  <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-xl bg-white/40 p-3">
                    <img
                      src={party.foto}
                      alt={`Logo de ${party.nome}`}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col items-center text-[#2A2A72]">
                    <div className="flex items-center gap-2">
                      <h2 className="line-clamp-2 text-[17px] font-bold uppercase tracking-[0.06em]">
                        PARTIDO {party.nome}
                      </h2>
                    </div>
                    <p className="mt-2 text-[24px] font-black leading-tight text-[#FFA400]">
                      {party.numero}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SearchPol;
