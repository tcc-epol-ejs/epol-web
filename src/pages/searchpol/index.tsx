import { FiSearch } from 'react-icons/fi';

function SearchPol() {
  return (
    <main className="min-h-screen bg-[#eaf6ff] px-6 py-8 sm:px-10 lg:px-[62px]">
      <header className="flex items-center justify-between">
        <h1 className="text-[22px] font-black uppercase tracking-[0.12em] text-[#2A2A72] sm:text-[26px]">
          SearchPol
        </h1>
      </header>

      <section className="mx-auto flex w-full max-w-[920px] flex-col items-stretch gap-4 pt-20 sm:pt-28">
        <label
          htmlFor="searchpol-search"
          className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#2A2A72]"
        >
          Pesquisar partidos ou candidatos
        </label>

        <div className="flex w-full items-center gap-3">
          <div className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-full border-2 border-[#2A2A72] bg-white px-5">
            <input
              id="searchpol-search"
              type="search"
              placeholder="Digite o nome de um partido ou candidato"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#333] outline-none placeholder:text-[#7b7b91] sm:text-[14px]"
            />
          </div>

          <button
            type="button"
            aria-label="Pesquisar"
            title="Pesquisar"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2A2A72] text-white transition-transform hover:opacity-85"
          >
            <FiSearch aria-hidden="true" className="text-[22px]" />
          </button>
        </div>
      </section>
    </main>
  );
}

export default SearchPol;
