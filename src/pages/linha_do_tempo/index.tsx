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
            className="relative isolate flex h-full w-screen shrink-0 flex-col items-center justify-center overflow-hidden bg-[#f5f5f5] px-16 pb-8 pt-[130px] text-center"
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
              <button
                type="button"
                onClick={avancar}
                className="mt-10 rounded-full border-2 border-white bg-[#16803C] px-9 py-4 text-sm font-extrabold tracking-[0.12em] text-white shadow-[4px_4px_0_#2A2A72] transition hover:translate-y-[-2px] hover:shadow-[4px_6px_0_#2A2A72] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2A2A72]"
              >
                DESCOBRIR
              </button>
            </div>
          </section>

          {PERIODOS_PRESIDENCIAIS.map((periodo, index) => {
            const politico = politicos.find(
              (pessoa) =>
                normalizarNome(pessoa.nome_politico || pessoa.nome_completo) ===
                normalizarNome(periodo.nomeBusca),
            );
            const fundo = index % 2 === 0 ? 'bg-[#2A2A72]' : 'bg-[#16803C]';
            const periodoAtivo = slideAtual === index + 1;

            return (
              <section
                key={`${periodo.periodo}-${periodo.nomeBusca}`}
                aria-hidden={!periodoAtivo}
                aria-label={`Presidência no período ${periodo.periodo}`}
                aria-roledescription="slide"
                className={`flex h-full w-screen shrink-0 items-center justify-center overflow-hidden px-20 pb-8 pt-[90px] text-white sm:px-24 ${fundo}`}
              >
                <div className="w-full max-w-5xl">
                  <div className="mb-5 flex items-center justify-center">
                    <p className="text-center text-3xl font-black text-[#FFA400] md:text-5xl">
                      {periodo.periodo}
                    </p>
                  </div>
                  <div className="relative mx-auto w-full max-w-[60rem]">
                    {periodoAtivo && (
                      <>
                        <button
                          type="button"
                          onClick={voltar}
                          aria-label="Voltar para o período anterior"
                          className="absolute left-[-5rem] top-1/2 z-20 flex h-[8rem] w-[8rem] -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#16803C] text-white shadow-[4px_4px_0_#2A2A72] transition hover:-translate-x-1 hover:shadow-[2px_4px_0_#2A2A72] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2A2A72] sm:left-[-10rem] sm:h-20 sm:w-25 "
                        >
                          <FiArrowLeft
                            aria-hidden="true"
                            className="text-4xl"
                          />
                        </button>
                        {index < PERIODOS_PRESIDENCIAIS.length - 1 && (
                          <button
                            type="button"
                            onClick={avancar}
                            aria-label={`Avançar para o período ${PERIODOS_PRESIDENCIAIS[index + 1].periodo}`}
                            className="absolute right-[-5rem] top-1/2 z-20 flex h-[8rem] w-[8rem] -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#16803C] text-white shadow-[4px_4px_0_#2A2A72] transition hover:translate-x-1 hover:shadow-[2px_4px_0_#2A2A72] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2A2A72] sm:right-[-10rem] sm:h-20 sm:w-25"
                          >
                            <FiArrowRight
                              aria-hidden="true"
                              className="text-4xl"
                            />
                          </button>
                        )}
                      </>
                    )}
                    <article className="mx-auto flex h-[min(38rem,calc(100dvh_-_230px))] w-full flex-col overflow-hidden rounded-[28px] border-4 border-white bg-white text-[#2A2A72] shadow-[10px_10px_0_#FFA400] md:h-[min(30rem,calc(100dvh_-_230px))] md:flex-row">
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
                      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto p-5 sm:p-7 md:p-9">
                        {carregando ? (
                          <p role="status" className="font-semibold">
                            Carregando dados do banco...
                          </p>
                        ) : erro ? (
                          <p
                            role="alert"
                            className="font-semibold text-red-700"
                          >
                            {erro}
                          </p>
                        ) : politico ? (
                          <>
                            <h2 className="text-2xl font-black leading-tight sm:text-3xl">
                              {politico.nome_completo}
                            </h2>
                            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[#16803C]">
                              Contexto histórico
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-[#333] sm:text-base">
                              {periodo.contexto}
                            </p>
                            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[#16803C]">
                              Destaques do governo
                            </p>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#333] sm:text-base">
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
