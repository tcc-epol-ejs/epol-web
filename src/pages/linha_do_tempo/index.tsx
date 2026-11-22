import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiRotateCcw } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Brasil from '../../assets/SVGs/brasil.svg';
import Header from '../../components/header';
import { listarCandidatos, type Candidato } from '../../services/api';

const PERIODOS_PRESIDENCIAIS = [
  {
    periodo: '1995 — 2002',
    nomeBusca: 'Fernando Henrique Cardoso',
    contexto:
      'Após a implantação do Plano Real, o país buscava consolidar a estabilidade econômica e ampliar sua integração à economia global.',
    destaques: [
      'Consolidação do Plano Real e controle da inflação.',
      'Aprovação da emenda que permitiu a reeleição para cargos executivos.',
      'Expansão de programas sociais e privatizações de empresas estatais.',
    ],
  },
  {
    periodo: '2003 — 2010',
    nomeBusca: 'Lula',
    contexto:
      'O Brasil viveu um ciclo de crescimento econômico, fortalecimento do mercado interno e maior presença em fóruns internacionais.',
    destaques: [
      'Criação do Bolsa Família, reunindo programas de transferência de renda.',
      'Valorização real do salário mínimo e ampliação do acesso ao ensino superior.',
      'Redução da pobreza e expansão do crédito e do consumo.',
    ],
  },
  {
    periodo: '2011 — 2016',
    nomeBusca: 'Dilma Rousseff',
    contexto:
      'Primeira mulher eleita presidente do Brasil, Dilma governou em meio à desaceleração econômica, a grandes manifestações e a uma crise política.',
    destaques: [
      'Lançamento do programa Mais Médicos para ampliar o atendimento de saúde.',
      'Sanção do Marco Civil da Internet e da Lei de Cotas.',
      'O segundo mandato foi interrompido em 2016, após processo de impeachment.',
    ],
  },
  {
    periodo: '2016 — 2018',
    nomeBusca: 'Michel Temer',
    contexto:
      'Michel Temer assumiu a Presidência após o impeachment de Dilma Rousseff, em um cenário de recessão e debate sobre as contas públicas.',
    destaques: [
      'Aprovação do teto de gastos públicos por meio da Emenda Constitucional 95.',
      'Reforma trabalhista de 2017, que alterou regras das relações de trabalho.',
      'Intervenção federal na segurança pública do Rio de Janeiro em 2018.',
    ],
  },
  {
    periodo: '2019 — 2022',
    nomeBusca: 'Jair Bolsonaro',
    contexto:
      'O mandato atravessou a pandemia de COVID-19, com impactos sanitários, sociais e econômicos, além de debates sobre a resposta do governo.',
    destaques: [
      'Aprovação da reforma da Previdência em 2019.',
      'Implementação do Auxílio Emergencial durante a pandemia.',
      'Avanço de marcos legais para o saneamento básico e as ferrovias.',
    ],
  },
  {
    periodo: '2023 — atual',
    nomeBusca: 'Lula',
    contexto:
      'Em seu terceiro mandato, Lula retomou políticas sociais e colocou o combate à fome e a agenda ambiental entre as prioridades do governo.',
    destaques: [
      'Relançamento do Bolsa Família com novas regras e benefícios adicionais.',
      'Promulgação da reforma tributária sobre o consumo.',
      'Retomada do Plano de Prevenção e Controle do Desmatamento na Amazônia.',
    ],
  },
];

function normalizarNome(nome: string) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

const classeBotaoNav =
  'flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#16803C] text-white transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2A2A72]';

const classeCard =
  'mx-auto w-full rounded-[20px] border-4 border-white bg-white text-[#2A2A72] shadow-[5px_5px_0_#FFA400] sm:rounded-[28px] sm:shadow-[10px_10px_0_#FFA400] h-[clamp(20rem,calc(100dvh-20rem),38rem)] md:h-[clamp(20rem,calc(100dvh-14.5rem),30rem)] lg:h-auto lg:min-h-0 lg:max-h-[40rem] lg:flex-1';

function LinhaDoTempo() {
  const navigate = useNavigate();
  const location = useLocation();
  const estadoNavegacao = location.state;
  const slideInicial =
    estadoNavegacao &&
    typeof estadoNavegacao === 'object' &&
    'slideAtual' in estadoNavegacao &&
    typeof estadoNavegacao.slideAtual === 'number' &&
    Number.isInteger(estadoNavegacao.slideAtual) &&
    estadoNavegacao.slideAtual >= 0 &&
    estadoNavegacao.slideAtual <= PERIODOS_PRESIDENCIAIS.length
      ? estadoNavegacao.slideAtual
      : 0;
  const [politicos, setPoliticos] = useState<Candidato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [slideAtual, setSlideAtual] = useState<number>(slideInicial);
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
  const reiniciar = () => setSlideAtual(0);

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
          style={{ transform: `translateX(-${slideAtual * 100}%)` }}
          aria-live="polite"
        >
          {/* SLIDE 0: capa */}
          <section
            aria-hidden={slideAtual !== 0}
            className="relative isolate flex h-full w-full shrink-0 basis-full overflow-y-auto overflow-x-hidden bg-[#f5f5f5] px-6 pb-10 pt-28 text-center sm:px-10 md:pt-[130px] lg:overflow-hidden lg:px-16"
          >
            <img
              src={Brasil}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-105 object-cover opacity-30 blur-[2px]"
            />
            <div className="relative z-10 m-auto flex flex-col items-center">
              <h1 className="text-balance break-words text-[clamp(2rem,9vw,4.5rem)] font-bold leading-[1.05] text-white [text-shadow:2px_2px_0_#16803C] sm:[text-shadow:4px_4px_0_#16803C]">
                LINHA DO TEMPO PRESIDENCIAL
              </h1>
              <p className="mt-4 max-w-xl text-base text-[#2A2A72] sm:text-lg md:text-xl">
                Conheça alguns dos principais líderes políticos do Brasil!
              </p>
              <button
                type="button"
                onClick={avancar}
                className="mt-8 rounded-full border-2 border-white bg-[#16803C] px-8 py-3.5 text-sm font-extrabold tracking-[0.12em] text-white transition hover:translate-y-[-2px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2A2A72] sm:mt-10 sm:px-9 sm:py-4"
              >
                DESCOBRIR
              </button>
            </div>
          </section>

          {/* SLIDES DOS PERÍODOS */}
          {PERIODOS_PRESIDENCIAIS.map((periodo, index) => {
            const politico = politicos.find(
              (pessoa) =>
                normalizarNome(pessoa.nome_politico || pessoa.nome_completo) ===
                normalizarNome(periodo.nomeBusca),
            );
            const fundo = index % 2 === 0 ? 'bg-[#2A2A72]' : 'bg-[#16803C]';
            const periodoAtivo = slideAtual === index + 1;
            const ultimo = index === PERIODOS_PRESIDENCIAIS.length - 1;

            return (
              <section
                key={`${periodo.periodo}-${periodo.nomeBusca}`}
                aria-hidden={!periodoAtivo}
                aria-label={`Presidência no período ${periodo.periodo}`}
                aria-roledescription="slide"
                className={`flex h-full w-full shrink-0 basis-full overflow-y-auto overflow-x-hidden px-4 pb-8 pt-24 text-white sm:px-8 md:pt-[90px] lg:overflow-hidden lg:px-24 ${fundo}`}
              >
                <div className="m-auto w-full max-w-5xl lg:m-0 lg:mx-auto lg:flex lg:h-full lg:flex-col lg:justify-center">
                  <div className="mb-4 flex shrink-0 items-center justify-center gap-3 md:mb-5">
                    <img
                      src={Brasil}
                      alt="Bandeira do Brasil"
                      className="h-5 w-8 rounded-sm object-cover shadow-sm sm:h-6 sm:w-9"
                    />
                    <p className="text-center text-2xl font-black text-[#FFA400] sm:text-3xl md:text-5xl">
                      {periodo.periodo}
                    </p>
                  </div>

                  <div className="relative mx-auto w-full max-w-[60rem] lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
                    {/* Setas laterais: só no desktop */}
                    {periodoAtivo && (
                      <>
                        <button
                          type="button"
                          onClick={voltar}
                          aria-label="Voltar para o período anterior"
                          className={`${classeBotaoNav} absolute left-[-6rem] top-[calc(50%-1.5rem)] z-20 hidden h-16 w-16 -translate-y-1/2 hover:-translate-x-1 lg:flex`}
                        >
                          <FiArrowLeft
                            aria-hidden="true"
                            className="text-3xl"
                          />
                        </button>

                        {!ultimo ? (
                          <button
                            type="button"
                            onClick={avancar}
                            aria-label={`Avançar para o período ${PERIODOS_PRESIDENCIAIS[index + 1].periodo}`}
                            className={`${classeBotaoNav} absolute right-[-6rem] top-[calc(50%-1.5rem)] z-20 hidden h-16 w-16 -translate-y-1/2 hover:translate-x-1 lg:flex`}
                          >
                            <FiArrowRight
                              aria-hidden="true"
                              className="text-3xl"
                            />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={reiniciar}
                            aria-label="Reiniciar linha do tempo"
                            className="group absolute right-[-6rem] top-[calc(50%-1.5rem)] z-20 hidden h-16 w-16 -translate-y-1/2 items-center justify-center text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2A2A72] lg:flex"
                          >
                            <FiRotateCcw
                              aria-hidden="true"
                              className="text-4xl transition-transform duration-500 group-hover:rotate-[-360deg]"
                            />
                          </button>
                        )}
                      </>
                    )}

                    {carregando ? (
                      <div
                        role="status"
                        aria-label="Carregando dados da linha do tempo"
                        className={`${classeCard} flex items-center justify-center`}
                      >
                        <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#2A2A72]/20 border-t-[#2A2A72]" />
                        <span className="sr-only">
                          Carregando dados da linha do tempo...
                        </span>
                      </div>
                    ) : (
                      <article
                        className={`${classeCard} flex flex-col overflow-hidden md:flex-row`}
                      >
                        <div className="flex h-32 shrink-0 items-center justify-center overflow-hidden bg-[#e8e8f5] sm:h-44 md:h-auto md:w-[38%]">
                          {politico?.foto_url ? (
                            <img
                              src={politico.foto_url}
                              alt={`Foto de ${politico.nome_completo}`}
                              className="h-full w-full object-cover object-[center_20%]"
                            />
                          ) : (
                            <span className="px-6 text-center text-sm font-bold">
                              {erro
                                ? 'Não foi possível carregar a imagem.'
                                : 'Imagem não cadastrada no banco.'}
                            </span>
                          )}
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6 md:justify-center md:p-9">
                          {erro ? (
                            <p
                              role="alert"
                              className="font-semibold text-red-700"
                            >
                              {erro}
                            </p>
                          ) : politico ? (
                            <>
                              <h2 className="text-xl font-black leading-tight sm:text-2xl md:text-3xl">
                                {politico.nome_completo}
                              </h2>
                              <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#16803C] md:mt-4">
                                Contexto histórico
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-[#333] md:text-base">
                                {periodo.contexto}
                              </p>
                              <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#16803C] md:mt-4">
                                Destaques do governo
                              </p>
                              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#333] md:text-base">
                                {periodo.destaques.map((destaque) => (
                                  <li key={destaque}>{destaque}</li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <p role="alert" className="font-semibold">
                              Não encontramos o registro de {periodo.periodo} no
                              banco de dados.
                            </p>
                          )}
                        </div>
                      </article>
                    )}

                    {/* Barra de ações: setas + "Saiba mais" no celular/tablet; só "Saiba mais" no desktop */}
                    <div
                      aria-hidden={!periodoAtivo}
                      className={`mt-4 flex h-12 shrink-0 items-center justify-between gap-3 lg:mt-5 lg:justify-center ${
                        periodoAtivo ? '' : 'invisible'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={voltar}
                        aria-label="Voltar para o período anterior"
                        className={`${classeBotaoNav} h-12 w-12 lg:hidden`}
                      >
                        <FiArrowLeft aria-hidden="true" className="text-2xl" />
                      </button>

                      {politico && !carregando && !erro && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/pagina_politico?id=${encodeURIComponent(politico.id)}`,
                              {
                                state: {
                                  voltarPara: '/linha_do_tempo',
                                  slideAtual,
                                },
                              },
                            )
                          }
                          className="rounded-full border-2 border-white bg-[#FFA400] px-5 py-2.5 text-sm font-bold text-[#2A2A72] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          Saiba mais
                        </button>
                      )}

                      {!ultimo ? (
                        <button
                          type="button"
                          onClick={avancar}
                          aria-label={`Avançar para o período ${PERIODOS_PRESIDENCIAIS[index + 1].periodo}`}
                          className={`${classeBotaoNav} h-12 w-12 lg:hidden`}
                        >
                          <FiArrowRight
                            aria-hidden="true"
                            className="text-2xl"
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={reiniciar}
                          aria-label="Reiniciar linha do tempo"
                          className={`${classeBotaoNav} h-12 w-12 lg:hidden`}
                        >
                          <FiRotateCcw
                            aria-hidden="true"
                            className="text-2xl"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <div
        role="progressbar"
        aria-label="Progresso da linha do tempo"
        aria-valuemin={0}
        aria-valuemax={totalSlides - 1}
        aria-valuenow={slideAtual}
        aria-valuetext={`${slideAtual} de ${totalSlides - 1} períodos`}
        className="absolute inset-x-0 bottom-0 z-50 h-2 bg-white/35"
      >
        <div
          className="h-full bg-[#FFA400] transition-[width] duration-700 ease-in-out"
          style={{
            width: `${(slideAtual / (totalSlides - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

export default LinhaDoTempo;
