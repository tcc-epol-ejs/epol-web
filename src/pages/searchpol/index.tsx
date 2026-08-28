import { FiFilter, FiSearch } from 'react-icons/fi';
import { FormEvent, useState } from 'react';
import Pipo1 from '../../assets/GIFs/pipo1.gif';
import Drago from '../../assets/Imagens/dragonite.png';
import Nico from '../../assets/Imagens/nico.png';
import Irmao from '../../assets/Imagens/irmao.png';
import Bacana from '../../assets/Imagens/bacanas.png';

const candidatos = [
  {
    keyword: 'pipo',
    nome: 'Pipo',
    partido: 'PARTIDO EPOL',
    numero: '6767',
    estado: 'São Paulo',
    candidatura: 'Deputado Federal',
    isPokemon: false,
    foto: Pipo1,
  },
  {
    keyword: 'dragonite',
    nome: 'Dragonite da Silva',
    partido: 'PARTIDO DRAGÕES DA SILVA',
    numero: '25',
    estado: 'Rio de Janeiro',
    candidatura: 'Governador',
    isPokemon: true,
    foto: Drago,
  },
  {
    keyword: 'lixococo',
    nome: 'Nicolas Rodrigues',
    partido: 'PARTIDO DOS LIXOCOCOS',
    numero: '17',
    estado: 'São Paulo',
    candidatura: 'Presidente',
    isPokemon: false,
    foto: Nico,
  },
  {
    keyword: 'irmao',
    nome: 'Irmãozinho',
    partido: 'PARTIDO DOS IRMÃOZINHOS',
    numero: '67123',
    estado: 'Acre',
    candidatura: 'Vereador',
    isPokemon: true,
    foto: Irmao,
  },
];

const partidos = [
  {
    keyword: 'bacana',
    nome: 'PARTIDO BACANA',
    presidente: 'Bacana da Silva',
    numero: '10',
    estado: 'São Paulo',
    foto: Bacana,
  },
];

function SearchPol() {
  const [search, setSearch] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
  const [onlyPokemon, setOnlyPokemon] = useState(false);
  const [selectedCandidatura, setSelectedCandidatura] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedPartido, setSelectedPartido] = useState('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchedTerm(search.trim().toLowerCase());
  };

  const results = [...candidatos]
    .sort((firstCandidate, secondCandidate) =>
      firstCandidate.nome.localeCompare(secondCandidate.nome, 'pt-BR'),
    )
    .filter(
      (candidate) =>
        (searchedTerm === '' || candidate.keyword === searchedTerm) &&
        (!onlyPokemon || candidate.isPokemon) &&
        (!selectedCandidatura ||
          candidate.candidatura === selectedCandidatura) &&
        (!selectedEstado || candidate.estado === selectedEstado) &&
        (!selectedPartido || candidate.partido === selectedPartido),
    );

  const results2 = [...partidos]
    .sort((firstParty, secondParty) =>
      firstParty.nome.localeCompare(secondParty.nome, 'pt-BR'),
    )
    .filter(
      (party) =>
        (searchedTerm === '' || party.keyword === searchedTerm) &&
        !onlyPokemon &&
        !selectedCandidatura &&
        (!selectedEstado || party.estado === selectedEstado) &&
        (!selectedPartido || party.nome === selectedPartido),
    );

  return (
    <main className="min-h-screen bg-[#eaf6ff]">
      <header className="flex items-center justify-center bg-[#FFA400] px-6 py-1 sm:px-10 lg:px-[62px]">
        <h1 className="text-[22px] font-black uppercase tracking-[0.12em] text-white sm:text-[30px]">
          SearchPol
        </h1>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1200px] flex-col px-6 pt-8 sm:px-10 sm:pt-10 lg:flex-row lg:px-0">
        <aside className="w-full pb-8 lg:w-1/4 lg:border-r-2 lg:border-[#2A2A72]/30 lg:pb-0 lg:pl-8 lg:pr-8">
          <h2 className="flex items-center gap-3 text-[18px] font-bold uppercase tracking-[0.12em] text-[#2A2A72]">
            <FiFilter aria-hidden="true" className="text-[22px]" />
            Filtrar
          </h2>

          <div className="mt-6 flex flex-col gap-5">
            <label className="flex items-center gap-2 text-[13px] text-[#333]">
              <input
                type="checkbox"
                checked={onlyPokemon}
                onChange={(event) => setOnlyPokemon(event.target.checked)}
                className="h-4 w-4 accent-[#2A2A72]"
              />
              Pokémon
            </label>

            <label className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
              Tipo de candidatura
              <select
                value={selectedCandidatura}
                onChange={(event) => setSelectedCandidatura(event.target.value)}
                className="h-10 rounded-lg border border-[#2A2A72]/30 bg-white px-3 text-[12px] font-medium normal-case tracking-normal text-[#333] outline-none"
              >
                <option value="">Todos os tipos</option>
                <option value="Deputado Federal">Deputado Federal</option>
                <option value="Governador">Governador</option>
                <option value="Presidente">Presidente</option>
                <option value="Vereador">Vereador</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
              Estado
              <select
                value={selectedEstado}
                onChange={(event) => setSelectedEstado(event.target.value)}
                className="h-10 rounded-lg border border-[#2A2A72]/30 bg-white px-3 text-[12px] font-medium normal-case tracking-normal text-[#333] outline-none"
              >
                <option value="">Todos os estados</option>
                <option value="Acre">Acre</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="São Paulo">São Paulo</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A72]">
              Partido
              <select
                value={selectedPartido}
                onChange={(event) => setSelectedPartido(event.target.value)}
                className="h-10 rounded-lg border border-[#2A2A72]/30 bg-white px-3 text-[12px] font-medium normal-case tracking-normal text-[#333] outline-none"
              >
                <option value="">Todos os partidos</option>
                <option value="PARTIDO DOS IRMÃOZINHOS">
                  Partido dos Irmãozinhos
                </option>
                <option value="PARTIDO DRAGÕES DA SILVA">
                  Partido Dragões da Silva
                </option>
                <option value="PARTIDO EPOL">Partido EPOL</option>
                <option value="PARTIDO DOS LIXOCOCOS">
                  Partido dos Lixococos
                </option>
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

          <div className="flex w-full max-w-[760px] flex-col gap-3">
            {results.map((candidate) => (
              <article
                key={candidate.keyword}
                className="flex w-full items-center gap-4 rounded-2xl border-2 border-[#2A2A72]/30 bg-white p-3"
              >
                <img
                  src={candidate.foto}
                  alt={`Foto de ${candidate.nome}`}
                  className="h-32 w-32 shrink-0 rounded-xl object-cover"
                />

                <div className="flex flex-col gap-0 text-[#2A2A72]">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[22px] font-bold uppercase tracking-[0.06em]">
                      {candidate.nome} -
                    </h2>
                    <span className="shrink-0 text-[22px] font-black text-[#FFA400]">
                      {candidate.numero}
                    </span>
                  </div>
                  <p className="text-[17px] font-semibold leading-tight text-[#333]">
                    {candidate.partido}
                  </p>
                  <p className="mt-6 text-[15px] font-semibold text-[#333]">
                    {candidate.estado}
                  </p>
                  <p className="text-[15px] font-semibold text-[#333]">
                    Candidato a: {candidate.candidatura}
                  </p>
                </div>
              </article>
            ))}

            {results2.map((party) => (
              <article
                key={party.keyword}
                className="flex w-full items-center gap-4 rounded-2xl border-2 border-[#2A2A72]/30 bg-white p-3"
              >
                <img
                  src={party.foto}
                  alt={`Logo de ${party.nome}`}
                  className="h-32 w-32 shrink-0 rounded-xl object-cover"
                />

                <div className="flex flex-col gap-0 text-[#2A2A72]">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[22px] font-bold uppercase tracking-[0.06em]">
                      {party.nome} -
                    </h2>
                    <span className="shrink-0 text-[22px] font-black text-[#FFA400]">
                      {party.numero}
                    </span>
                  </div>
                  <p className="text-[17px] font-semibold leading-tight text-[#333]">
                    Presidente: {party.presidente}
                  </p>
                  <p className="mt-6 text-[15px] font-semibold text-[#333]">
                    {party.estado}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SearchPol;
