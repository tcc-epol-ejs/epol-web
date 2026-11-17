import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Brasil from '../../assets/SVGs/brasil.svg';
import Header from '../../components/header';
import { listarCandidatos, type Candidato } from '../../services/api';

const PERIODOS_PRESIDENCIAIS = [
  {
    periodo: '1995 — 2002',
    nomeBusca: 'Fernando Henrique Cardoso',
    contexto:
      'O período veio após a implantação do Plano Real e foi marcado pela estabilização da moeda, por reformas e pela aprovação da reeleição presidencial.',
  },
  {
    periodo: '2003 — 2010',
    nomeBusca: 'Lula',
    contexto:
      'Os governos ampliaram programas sociais, como o Bolsa Família, em um período de crescimento econômico e maior projeção internacional do Brasil.',
  },
  {
    periodo: '2011 — 2016',
    nomeBusca: 'Dilma Rousseff',
    contexto:
      'Dilma Rousseff foi a primeira mulher a presidir o Brasil. Seu segundo mandato foi interrompido em 2016, após o processo de impeachment.',
  },
  {
    periodo: '2016 — 2018',
    nomeBusca: 'Michel Temer',
    contexto:
      'Michel Temer assumiu a Presidência após o impeachment. Seu governo aprovou o teto de gastos públicos e a reforma trabalhista.',
  },
  {
    periodo: '2019 — 2022',
    nomeBusca: 'Jair Bolsonaro',
    contexto:
      'O período foi marcado pela pandemia de COVID-19 e pela reforma da Previdência, aprovada em 2019.',
  },
  {
    periodo: '2023 — atual',
    nomeBusca: 'Lula',
    contexto:
      'Lula iniciou seu terceiro mandato em 2023, com foco anunciado no combate à pobreza, em políticas sociais e na agenda ambiental.',
  },
];

function normalizarNome(nome: string) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function LinhaDoTempo() {
  const [politicos, setPoliticos] = useState<Candidato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [slideAtual, setSlideAtual] = useState(0);
  const totalSlides = PERIODOS_PRESIDENCIAIS.length + 1;

  useEffect(() => {
    let ativo = true;

    listarCandidatos()
      .then((resultado) => {
        if (ativo) setPoliticos(resultado);
      })
      .catch((error: unknown) => {
        if (!ativo) return;
        console.error(
          'Não foi possível carregar os dados da linha do tempo.',
          error,
        );
        setErro('Não foi possível carregar os dados da linha do tempo.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const avancar = () =>
    setSlideAtual((atual) => Math.min(atual + 1, totalSlides - 1));
  const voltar = () => setSlideAtual((atual) => Math.max(atual - 1, 0));

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-[#FFA400]">
      <div className="absolute top-0 z-30 w-full">
        <Header />
      </div>

      <main
        className="absolute inset-0 overflow-hidden"
        aria-label="Linha do tempo presidencial"
      >
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${slideAtual * 100}vw)` }}
          aria-live="polite"
        >
          <section
            aria-hidden={slideAtual !== 0}
            className="relative isolate flex h-full w-screen shrink-0 flex-col items-center justify-center bg-[#f5f5f5] px-16 pb-8 pt-[130px] text-center"
          >
            <img
              src={Brasil}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-105 object-cover opacity-30 blur-[2px]"
            />
            <div className="relative z-10 flex flex-col items-center">
              <h1 className="text-5xl font-bold text-white [text-shadow:4px_4px_0_#16803C] sm:text-6xl md:text-7xl">
                LINHA DO TEMPO PRESIDENCIAL
              </h1>
              <p className="mt-4 text-lg text-[#2A2A72] md:text-xl">
                Conheça alguns dos principais líderes políticos do Brasil!
              </p>
              <p className="mt-10 text-sm font-bold uppercase tracking-[0.16em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
                Avance pelas setas para conhecer cada período
              </p>
            </div>
          </section>

          {PERIODOS_PRESIDENCIAIS.map((periodo, index) => {
            const politico = politicos.find(
              (pessoa) =>
                normalizarNome(pessoa.nome_politico || pessoa.nome_completo) ===
                normalizarNome(periodo.nomeBusca),
            );
            const fundo = index % 2 === 0 ? 'bg-[#2A2A72]' : 'bg-[#16803C]';

            return (
              <section
                key={`${periodo.periodo}-${periodo.nomeBusca}`}
                aria-hidden={slideAtual !== index + 1}
                aria-label={`Presidência no período ${periodo.periodo}`}
                aria-roledescription="slide"
                className={`flex h-full w-screen shrink-0 items-center justify-center overflow-hidden px-16 pb-8 pt-[150px] text-white ${fundo}`}
              >
                <div className="w-full max-w-5xl">
                  <div className="mb-5 flex items-center justify-center">
                    <p className="text-center text-3xl font-black text-[#FFA400] md:text-5xl">
                      {periodo.periodo}
                    </p>
                  </div>
                  <article className="mx-auto flex max-h-[calc(100dvh-230px)] max-w-4xl flex-col overflow-hidden rounded-[28px] border-4 border-white bg-white text-[#2A2A72] shadow-[10px_10px_0_#FFA400] md:min-h-[380px] md:flex-row">
                    <div className="flex h-40 shrink-0 items-center justify-center overflow-hidden bg-[#e8e8f5] sm:h-48 md:h-auto md:w-[38%]">
                      {politico?.foto_url ? (
                        <img
                          src={politico.foto_url}
                          alt={`Foto de ${politico.nome_completo}`}
                          className="h-full w-full object-cover object-[center_20%]"
                        />
                      ) : (
                        <span className="px-6 text-center text-sm font-bold">
                          {carregando
                            ? 'Carregando imagem...'
                            : erro
                              ? 'Não foi possível carregar a imagem.'
                              : 'Imagem não cadastrada no banco.'}
                        </span>
                      )}
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col justify-center p-5 sm:p-7 md:p-9">
                      {carregando ? (
                        <p role="status" className="font-semibold">
                          Carregando dados do banco...
                        </p>
                      ) : erro ? (
                        <p role="alert" className="font-semibold text-red-700">
                          {erro}
                        </p>
                      ) : politico ? (
                        <>
                          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#16803C]">
                            Presidente da República
                          </p>
                          <h2 className="text-2xl font-black leading-tight sm:text-3xl">
                            {politico.nome_politico || politico.nome_completo}
                          </h2>
                          {politico.nome_politico !==
                            politico.nome_completo && (
                            <p className="mt-1 text-xs font-medium text-[#555]">
                              {politico.nome_completo}
                            </p>
                          )}
                          <p className="mt-4 text-sm leading-relaxed text-[#333] sm:text-base">
                            {periodo.contexto}
                          </p>
                        </>
                      ) : (
                        <p role="alert" className="font-semibold">
                          Não encontramos o registro de {periodo.periodo} no
                          banco de dados.
                        </p>
                      )}
                    </div>
                  </article>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {slideAtual > 0 && (
        <button
          type="button"
          onClick={voltar}
          aria-label="Voltar para o período anterior"
          className="absolute left-3 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#16803C] text-white shadow-[4px_4px_0_#2A2A72] transition hover:-translate-x-1 hover:shadow-[2px_4px_0_#2A2A72] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2A2A72] motion-safe:animate-pulse sm:left-6 sm:h-14 sm:w-14"
        >
          <FiArrowLeft aria-hidden="true" className="text-2xl" />
        </button>
      )}

      {slideAtual < totalSlides - 1 && (
        <button
          type="button"
          onClick={avancar}
          aria-label={
            slideAtual === 0
              ? 'Avançar para o período de 1995'
              : `Avançar para o período ${PERIODOS_PRESIDENCIAIS[slideAtual].periodo}`
          }
          className="absolute right-3 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#16803C] text-white shadow-[4px_4px_0_#2A2A72] transition hover:translate-x-1 hover:shadow-[2px_4px_0_#2A2A72] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2A2A72] motion-safe:animate-pulse sm:right-6 sm:h-14 sm:w-14"
        >
          <FiArrowRight aria-hidden="true" className="text-2xl" />
        </button>
      )}
    </div>
  );
}

export default LinhaDoTempo;
