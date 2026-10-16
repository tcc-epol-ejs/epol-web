import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/header';
import {
  listarCandidatos,
  listarPartidos,
  type Candidato,
  type Partido,
} from '../../services/api';

function formatarData(data: string | null) {
  if (!data) return null;

  const [ano, mes, dia] = data.slice(0, 10).split('-').map(Number);
  if (!ano || !mes || !dia) return data;

  return new Intl.DateTimeFormat('pt-BR').format(new Date(ano, mes - 1, dia));
}

function Campo({
  titulo,
  children,
  className = '',
}: {
  titulo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-white/70 p-4 ${className}`}>
      <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#68688e]">
        {titulo}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#2A2A72]">
        {children || 'Não informado'}
      </dd>
    </div>
  );
}

function ListaInformacoes({
  itens,
  vazio,
  primeiroItemMaiusculo = false,
}: {
  itens: string[] | null;
  vazio: string;
  primeiroItemMaiusculo?: boolean;
}) {
  if (!itens?.length) {
    return <p className="text-sm leading-relaxed text-[#68688e]">{vazio}</p>;
  }

  return (
    <ul className="space-y-2 text-sm leading-relaxed text-[#2A2A72]">
      {itens.map((item, index) => {
        const texto =
          primeiroItemMaiusculo && index === 0
            ? item.toLocaleUpperCase('pt-BR')
            : primeiroItemMaiusculo
              ? item.charAt(0).toLocaleUpperCase('pt-BR') + item.slice(1)
              : item;

        return (
          <li key={`${item}-${index}`} className="flex gap-2">
            {!(primeiroItemMaiusculo && index === 0) && (
              <span aria-hidden="true" className="font-black text-[#A36BBE]">
                •
              </span>
            )}
            <span
              className={
                primeiroItemMaiusculo && index === 0
                  ? 'font-black uppercase'
                  : undefined
              }
            >
              {texto}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function PaginaPartido() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idSelecionado = searchParams.get('id');
  const numeroSelecionado = searchParams.get('numero');
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [carregandoCandidatos, setCarregandoCandidatos] = useState(true);
  const [erroCandidatos, setErroCandidatos] = useState('');

  useEffect(() => {
    listarPartidos()
      .then(setPartidos)
      .catch((error: unknown) => {
        console.error('Erro ao carregar os dados do partido:', error);
        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os dados do partido.',
        );
      })
      .finally(() => setCarregando(false));
  }, []);

  const partido = idSelecionado
    ? partidos.find((item) => item.id === idSelecionado)
    : numeroSelecionado
      ? partidos.find(
          (item) => String(item.numero_legenda) === numeroSelecionado,
        )
      : partidos[0];

  useEffect(() => {
    if (!partido) return;

    let ativo = true;
    setCarregandoCandidatos(true);
    setErroCandidatos('');

    listarCandidatos()
      .then((todosCandidatos) => {
        if (!ativo) return;
        const associados = todosCandidatos.filter(
          (candidato) => candidato.partido_id === partido.id,
        );
        setCandidatos(associados);
      })
      .catch((error: unknown) => {
        if (!ativo) return;
        console.error('Erro ao carregar candidatos do partido:', error);
        setErroCandidatos(
          'Não foi possível carregar os candidatos deste partido.',
        );
      })
      .finally(() => {
        if (ativo) setCarregandoCandidatos(false);
      });

    return () => {
      ativo = false;
    };
  }, [partido]);

  return (
    <>
      <div className="w-full">
        <Header isBgWhite disableScrollHide />
      </div>

      <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:py-10">
        <button
          type="button"
          onClick={() => navigate('/searchpol')}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 font-bold text-[#2A2A72] transition-colors hover:bg-[#2A2A72]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A2A72]"
        >
          <FiArrowLeft aria-hidden="true" className="text-lg" />
          Voltar
        </button>

        {carregando ? (
          <div
            role="status"
            aria-label="Carregando informações do partido"
            className="flex min-h-[240px] items-center justify-center"
          >
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#2A2A72]/20 border-t-[#2A2A72]" />
            <span className="sr-only">Carregando informações do partido...</span>
          </div>
        ) : erro ? (
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-white p-6 text-center font-semibold text-red-700"
          >
            Não foi possível carregar o partido: {erro}
          </p>
        ) : !partido ? (
          <p className="rounded-2xl border border-[#2A2A72]/15 bg-white p-6 text-center font-semibold text-[#2A2A72]">
            {idSelecionado || numeroSelecionado
              ? 'Não encontramos um partido com esse identificador.'
              : 'Nenhum partido cadastrado.'}
          </p>
        ) : (
          <>
          <article className="grid overflow-hidden rounded-[24px] border-2 border-[#2A2A72] bg-[#f3eff8] shadow-[0_16px_40px_-28px_rgba(42,42,114,0.65)] lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)]">
            <aside className="flex min-h-[300px] items-center justify-center bg-[#F4C62E] p-6 sm:min-h-[380px] sm:p-10 lg:min-h-full">
              <div className="flex aspect-square w-full max-w-[440px] items-center justify-center overflow-hidden rounded-[28px] border-[6px] border-[#2A2A72] bg-white p-6 shadow-[0_18px_45px_-20px_rgba(42,42,114,0.55)] sm:p-10">
                {partido.bandeira_url ? (
                  <img
                    src={partido.bandeira_url}
                    alt={`Bandeira do ${partido.nome_completo}`}
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </div>
            </aside>

            <div className="min-w-0">
              <header className="flex flex-col gap-4 bg-[#2A2A72] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
                <div>
                  <h1 className="text-2xl font-black uppercase leading-tight sm:text-3xl">
                    {partido.nome_completo}
                  </h1>
                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-white/70">
                    {partido.sigla}
                  </p>
                </div>
                <div className="w-fit shrink-0 rounded-xl border border-white/30 bg-white/10 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                    Número da legenda
                  </p>
                  <p className="mt-1 text-2xl font-black leading-none">
                    {partido.numero_legenda}
                  </p>
                </div>
              </header>

              <div className="space-y-5 p-4 sm:p-6">
                <section aria-label="Dados do partido">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <Campo titulo="Data de fundação">
                      {formatarData(partido.data_fundacao)}
                    </Campo>
                    <Campo titulo="Data de deferimento">
                      {formatarData(partido.data_deferimento)}
                    </Campo>
                    <Campo titulo="Fundadores">
                      {partido.fundadores?.join(', ')}
                    </Campo>
                    <Campo titulo="Presidente nacional">
                      {partido.presidente_nacional}
                    </Campo>
                  </dl>
                </section>

                <div className="grid gap-4">
                  <section className="rounded-2xl border border-[#2A2A72]/10 bg-white p-5 sm:p-6">
                    <h2 className="mb-4 border-b border-[#2A2A72]/10 pb-3 text-sm font-black uppercase tracking-[0.12em] text-[#2A2A72]">
                      Propostas
                    </h2>
                    <ListaInformacoes
                      itens={partido.propostas_url}
                      vazio="As propostas ainda não foram cadastradas."
                    />
                    {!!partido.propostas_url?.length && (
                      <div className="mt-5 border-t border-[#2A2A72]/10 pt-4">
                        <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#68688e]">
                          Saiba mais
                        </h3>
                        <ul className="space-y-2">
                          {partido.propostas_url.map((url, index) => (
                            <li key={`${url}-${index}`}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="break-all text-sm font-semibold text-[#5B3A8A] underline decoration-[#A36BBE] underline-offset-2 hover:text-[#2A2A72]"
                              >
                                Proposta {index + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>

                  <section className="rounded-2xl border border-[#2A2A72]/10 bg-white p-5 sm:p-6">
                    <h2 className="mb-4 border-b border-[#2A2A72]/10 pb-3 text-sm font-black uppercase tracking-[0.12em] text-[#2A2A72]">
                      Ideologia
                    </h2>
                    <ListaInformacoes
                      itens={partido.ideologia}
                      vazio="A ideologia ainda não foi cadastrada."
                      primeiroItemMaiusculo
                    />
                  </section>
                </div>
              </div>
            </div>
          </article>
          <section aria-labelledby="candidatos-partido-titulo" className="mt-8">
            <div aria-hidden="true" className="mb-7 h-px w-full bg-[#2A2A72]/25" />
            <h2
              id="candidatos-partido-titulo"
              className="mb-5 text-left text-xl font-black uppercase tracking-[0.08em] text-[#2A2A72] sm:text-2xl"
            >
              Candidatos do partido
            </h2>

            {carregandoCandidatos ? (
              <p className="text-sm font-medium text-[#68688e]">
                Carregando candidatos...
              </p>
            ) : erroCandidatos ? (
              <p role="alert" className="text-sm font-medium text-red-700">
                {erroCandidatos}
              </p>
            ) : candidatos.length === 0 ? (
              <p className="text-sm font-medium text-[#68688e]">
                Não há candidatos associados a este partido.
              </p>
            ) : (
              <div className="grid w-full max-w-[1400px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {candidatos.map((candidato) => (
                  <article
                    key={candidato.id}
                    className="flex min-h-[240px] flex-col overflow-hidden rounded-2xl border-2 border-[#2A2A72] bg-white text-[#2A2A72]"
                  >
                    <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden bg-[#2A2A72] sm:h-48">
                      {candidato.foto_url ? (
                        <img
                          src={candidato.foto_url}
                          alt={`Foto de ${candidato.nome_politico || candidato.nome_completo}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-[center_20%]"
                        />
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/70">
                          Sem foto
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="break-words text-base font-bold uppercase leading-tight">
                        {candidato.nome_politico || candidato.nome_completo}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          </>
        )}
      </main>
    </>
  );
}

export default PaginaPartido;
