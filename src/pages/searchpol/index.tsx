import { FiFilter, FiSearch } from 'react-icons/fi';

function SearchPol() {
  return (
    <main className="min-h-screen bg-[#eaf6ff]">
      <header className="flex items-center justify-center bg-[#2A2A72] px-6 py-1 sm:px-10 lg:px-[62px]">
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
          <div className="flex w-full max-w-[760px] items-center gap-3">
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
        </div>
      </section>
    </main>
  );
}

export default SearchPol;
