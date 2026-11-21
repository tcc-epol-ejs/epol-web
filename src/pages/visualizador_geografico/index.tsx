import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { FiSearch } from 'react-icons/fi';
import Brazil from '@react-map/brazil';
import Header from '../../components/header';

interface Estado {
  nome: string;
  sigla: string;
}

const ESTADOS: Estado[] = [
  { nome: 'Acre', sigla: 'AC' },
  { nome: 'Alagoas', sigla: 'AL' },
  { nome: 'Amapá', sigla: 'AP' },
  { nome: 'Amazonas', sigla: 'AM' },
  { nome: 'Bahia', sigla: 'BA' },
  { nome: 'Ceará', sigla: 'CE' },
  { nome: 'Distrito Federal', sigla: 'DF' },
  { nome: 'Espírito Santo', sigla: 'ES' },
  { nome: 'Goiás', sigla: 'GO' },
  { nome: 'Maranhão', sigla: 'MA' },
  { nome: 'Mato Grosso', sigla: 'MT' },
  { nome: 'Mato Grosso do Sul', sigla: 'MS' },
  { nome: 'Minas Gerais', sigla: 'MG' },
  { nome: 'Pará', sigla: 'PA' },
  { nome: 'Paraíba', sigla: 'PB' },
  { nome: 'Paraná', sigla: 'PR' },
  { nome: 'Pernambuco', sigla: 'PE' },
  { nome: 'Piauí', sigla: 'PI' },
  { nome: 'Rio de Janeiro', sigla: 'RJ' },
  { nome: 'Rio Grande do Norte', sigla: 'RN' },
  { nome: 'Rio Grande do Sul', sigla: 'RS' },
  { nome: 'Rondônia', sigla: 'RO' },
  { nome: 'Roraima', sigla: 'RR' },
  { nome: 'Santa Catarina', sigla: 'SC' },
  { nome: 'São Paulo', sigla: 'SP' },
  { nome: 'Sergipe', sigla: 'SE' },
  { nome: 'Tocantins', sigla: 'TO' },
];

const COR_ESTADO_ATIVO = '#2A82D7';

function normalizarBusca(texto: string) {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function VisualizadorGeografico() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(
    null,
  );
  const [pesquisa, setPesquisa] = useState('');
  const [versaoMapa, setVersaoMapa] = useState(0);

  const busca = normalizarBusca(pesquisa);
  const siglaExata = ESTADOS.find(
    (estado) => estado.sigla.toLowerCase() === busca,
  );
  const resultados = siglaExata
    ? [siglaExata]
    : ESTADOS.filter((estado) => normalizarBusca(estado.nome).includes(busca));
  const estadoAtual = ESTADOS.find(
    (estado) => estado.nome === estadoSelecionado,
  );
  const coresEstados = useMemo<Record<string, string>>(
    () => (estadoSelecionado ? { [estadoSelecionado]: COR_ESTADO_ATIVO } : {}),
    [estadoSelecionado],
  );

  function escolherResultado(estado: Estado) {
    setEstadoSelecionado(estado.nome);
    setPesquisa('');
    // Reinicia a seleção interna do mapa após uma escolha pela busca.
    setVersaoMapa((versao) => versao + 1);
  }

  function enviarBusca(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busca && resultados.length > 0) escolherResultado(resultados[0]);
  }

  return (
    <main className="min-h-[100dvh] w-full bg-[#FFA400]">
      <div className="fixed inset-x-0 top-0 z-[1000]">
        <Header isBgWhite />
      </div>

      <section className="mx-auto grid min-h-[100dvh] w-full max-w-[1600px] grid-cols-1 content-start gap-4 px-4 pb-8 pt-24 sm:gap-6 sm:px-8 md:pt-[135px] xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.2fr)] xl:grid-rows-[1fr_1fr] xl:gap-x-8 xl:gap-y-5 xl:px-[min(5vw,65px)] xl:pt-[155px]">
        <h1 className="min-w-0 text-[#2A2A72] xl:col-start-1 xl:row-start-1 xl:self-end">
          <span className="block font-[Fraunces] text-[clamp(2rem,7vw,3rem)] font-black italic uppercase leading-none tracking-[-0.03em] xl:text-[clamp(2rem,3.1vw,3rem)]">
            Visualizador
          </span>
          <span className="mt-1 block text-[clamp(1.25rem,5vw,1.75rem)] font-black uppercase leading-none tracking-wide">
            Geográfico
          </span>
        </h1>

        <form
          role="search"
          onSubmit={enviarBusca}
          className="min-w-0 xl:col-start-3 xl:row-span-2 xl:row-start-1 xl:self-center"
        >
          <div className="flex min-h-12 items-center gap-2 rounded-full bg-[#FFFBF2] px-4 shadow-[0_8px_20px_rgba(0,0,0,0.12)] focus-within:ring-2 focus-within:ring-[#2A2A72]">
            <FiSearch
              size={20}
              aria-hidden="true"
              className="shrink-0 text-[#666]"
            />
            <input
              type="search"
              aria-label="Pesquisar estado"
              autoComplete="off"
              enterKeyHint="search"
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar estado ou UF"
              className="min-w-0 flex-1 bg-transparent text-base text-[#2A2A72] outline-none placeholder:text-[#666] [&::-webkit-search-cancel-button]:appearance-none"
            />
            {pesquisa && (
              <button
                type="button"
                onClick={() => setPesquisa('')}
                className="min-h-11 shrink-0 rounded-full px-2 text-xs font-bold text-[#2A2A72]"
              >
                Limpar
              </button>
            )}
          </div>

          {busca && (
            <div className="mt-2 max-h-52 overflow-y-auto rounded-2xl bg-[#FFFBF2] p-2 shadow-lg">
              {resultados.length ? (
                <ul className="flex flex-col gap-1">
                  {resultados.map((estado) => (
                    <li key={estado.sigla}>
                      <button
                        type="button"
                        onClick={() => escolherResultado(estado)}
                        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-[#2A2A72] hover:bg-[#e8f0fe] focus-visible:bg-[#e8f0fe]"
                      >
                        {estado.nome}
                        <span className="shrink-0 text-xs">{estado.sigla}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p role="status" className="px-3 py-2 text-sm text-[#555]">
                  Nenhum estado encontrado.
                </p>
              )}
            </div>
          )}
        </form>

        <p
          role="status"
          className="min-h-11 rounded-xl bg-[#FFFBF2] px-4 py-3 text-sm text-[#2A2A72] xl:col-start-1 xl:row-start-2 xl:self-start"
        >
          {estadoAtual ? (
            <strong>
              {estadoAtual.nome} ({estadoAtual.sigla})
            </strong>
          ) : (
            'Selecione um estado no mapa ou pela busca.'
          )}
        </p>

        <div
          aria-hidden="true"
          className="mx-auto w-full min-w-0 max-w-[620px] px-1 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:self-center [&>.map]:!w-full [&_path]:transition-colors [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg]:overflow-visible"
        >
          <Brazil
            key={versaoMapa}
            type="select-single"
            mapColor="#D5D5D5"
            strokeColor="#999"
            strokeWidth={1.2}
            hoverColor={COR_ESTADO_ATIVO}
            selectColor={COR_ESTADO_ATIVO}
            cityColors={coresEstados}
            onSelect={setEstadoSelecionado}
          />
        </div>
      </section>
    </main>
  );
}
