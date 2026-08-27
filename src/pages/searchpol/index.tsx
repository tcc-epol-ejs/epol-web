import { FiFilter, FiSearch } from 'react-icons/fi';
import { FormEvent, useState } from 'react';
import Pipo1 from '../../assets/GIFs/pipo1.gif';
import Drago from '../../assets/Imagens/dragonite.png';

const candidates = [
  {
    keyword: 'pipo',
    nome: 'Pipo',
    partido: 'PARTIDO EPOL',
    numero: '6767',
    estado: 'São Paulo',
    candidatura: 'Deputado Federal',
    foto: Pipo1,
  },
  {
    keyword: 'dragonite',
    nome: 'Dragonite da Silva',
    partido: 'PARTIDO DRAGÕES DA SILVA',
    numero: '25',
    estado: 'Rio de Janeiro',
    candidatura: 'Governador',
    foto: Drago,
  },
];

function SearchPol() {
  const [search, setSearch] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchedTerm(search.trim().toLowerCase());
  };

  const results = candidates.filter(
    (candidate) => candidate.keyword === searchedTerm,
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
          </div>
        </div>
      </section>
    </main>
  );
}

export default SearchPol;
