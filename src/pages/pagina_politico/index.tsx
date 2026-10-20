import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/header';
import { buscarCandidato, type Candidato } from '../../services/api';

function Campo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string | number | null | undefined;
}) {
  return (
    <div className="rounded-xl bg-white/75 p-4">
      <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
        {titulo}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#333]">
        {valor || 'Não informado'}
      </dd>
    </div>
  );
}

function formatarData(data: string | null | undefined) {
  if (!data) return null;

  const [ano, mes, dia] = data.slice(0, 10).split('-').map(Number);
  if (!ano || !mes || !dia) return data;

  return new Intl.DateTimeFormat('pt-BR').format(new Date(ano, mes - 1, dia));
}

function PaginaPolitico() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idCandidato = searchParams.get('id');
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [secaoAtiva, setSecaoAtiva] = useState<'sobre' | 'trajetoria'>('sobre');

  useEffect(() => {
    if (!idCandidato) {
      setCandidato(null);
      setErro('');
      setCarregando(false);
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro('');

    buscarCandidato(idCandidato)
      .then((resultado) => {
        if (ativo) setCandidato(resultado);
      })
      .catch((error: unknown) => {
        if (!ativo) return;
        console.error('Erro ao carregar os dados do candidato:', error);
        setCandidato(null);
        setErro('Não foi possível carregar os dados deste candidato.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [idCandidato]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#eaf6ff]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
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
      </div>

      <div className="relative z-10 w-full">
        <Header isBgWhite disableScrollHide />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:py-10">
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
            aria-label="Carregando informações do candidato"
            className="flex min-h-[240px] items-center justify-center"
          >
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#2A2A72]/20 border-t-[#2A2A72]" />
            <span className="sr-only">
              Carregando informações do candidato...
            </span>
          </div>
        ) : erro ? (
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-white p-6 text-center font-semibold text-red-700"
          >
            {erro}
          </p>
        ) : !candidato ? (
          <p className="rounded-2xl border border-[#2A2A72]/15 bg-white p-6 text-center font-semibold text-[#2A2A72]">
            {idCandidato
              ? 'Não encontramos um candidato com esse identificador.'
              : 'Selecione um candidato no SearchPol para ver os detalhes.'}
          </p>
        ) : (
          <>
            <article className="mx-auto flex w-full max-w-[960px] flex-col overflow-hidden rounded-[24px] border-2 border-[#2A2A72] bg-white text-[#2A2A72] shadow-[0_16px_40px_-28px_rgba(42,42,114,0.65)] sm:flex-row">
              <div className="flex h-64 w-full shrink-0 items-center justify-center overflow-hidden bg-[#2A2A72] sm:h-auto sm:min-h-[320px] sm:w-[360px]">
                {candidato.foto_url ? (
                  <img
                    src={candidato.foto_url}
                    alt={`Foto de ${candidato.nome_completo}`}
                    className="h-full w-full object-cover object-[center_20%]"
                  />
                ) : (
                  <span className="text-sm font-bold uppercase tracking-[0.1em] text-white/70">
                    Sem foto
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 border-t-[6px] border-[#FFA400] p-6 sm:border-l-[6px] sm:border-t-0 sm:p-8">
                <h1 className="break-words text-3xl font-black uppercase leading-tight sm:text-4xl">
                  {candidato.nome_completo}
                </h1>
                <p className="text-base font-bold">
                  Candidato(a) a{' '}
                  {candidato.candidatura?.toLocaleLowerCase('pt-BR') ||
                    'cargo não informado'}
                </p>
                <div className="flex items-center gap-3 border-t border-[#2A2A72]/15 pt-4">
                  {candidato.partidos?.bandeira_url ? (
                    <img
                      src={candidato.partidos.bandeira_url}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-full border border-[#2A2A72]/15 bg-white object-contain p-1"
                    />
                  ) : null}
                  <p className="break-words text-sm font-bold">
                    {candidato.partidos?.nome_completo ||
                      'Partido não informado'}
                    {candidato.partidos?.sigla
                      ? ` (${candidato.partidos.sigla})`
                      : ''}
                  </p>
                </div>
              </div>
            </article>

            <section className="mx-auto mt-8 w-full max-w-[960px]">
              <div className="mb-4 flex items-center justify-between gap-3 border-b-2 border-[#FFA400] pb-3">
                <h2
                  id={
                    secaoAtiva === 'sobre'
                      ? 'sobre-candidato-titulo'
                      : 'trajetoria-candidato-titulo'
                  }
                  className="text-lg font-black uppercase tracking-[0.1em] text-[#2A2A72]"
                >
                  {secaoAtiva === 'sobre' ? 'Sobre mim' : 'Trajetória'}
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setSecaoAtiva((atual) =>
                      atual === 'sobre' ? 'trajetoria' : 'sobre',
                    )
                  }
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#2A2A72] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#202056] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A2A72] sm:text-sm"
                  aria-label={
                    secaoAtiva === 'sobre'
                      ? 'Ver trajetória'
                      : 'Voltar para sobre mim'
                  }
                >
                  {secaoAtiva === 'sobre' ? (
                    <>
                      Ver trajetória
                      <FiArrowRight aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <FiArrowLeft aria-hidden="true" />
                      Sobre mim
                    </>
                  )}
                </button>
              </div>
              <div className="overflow-hidden">
                <div
                  className="flex w-[200%] items-stretch transition-transform duration-700 ease-in-out motion-reduce:transition-none"
                  style={{
                    transform:
                      secaoAtiva === 'sobre'
                        ? 'translateX(0)'
                        : 'translateX(-50%)',
                  }}
                >
                  <div
                    aria-hidden={secaoAtiva !== 'sobre'}
                    className="w-1/2 shrink-0 px-0.5"
                  >
                    <dl className="grid gap-3 lg:grid-cols-3">
                      <div className="rounded-xl bg-white/75 p-4">
                        <div>
                          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                            Nome completo
                          </dt>
                          <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#333]">
                            {candidato.nome_completo || 'Não informado'}
                          </dd>
                        </div>
                        <div className="mt-4 border-t border-[#2A2A72]/10 pt-3">
                          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                            Nome político
                          </dt>
                          <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#333]">
                            {candidato.nome_politico || 'Não informado'}
                          </dd>
                        </div>
                        <div className="mt-4 border-t border-[#2A2A72]/10 pt-3">
                          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                            Número da urna
                          </dt>
                          <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#333]">
                            {candidato.numero_urna ?? 'Não informado'}
                          </dd>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/75 p-4">
                        <div>
                          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                            Data de nascimento
                          </dt>
                          <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#333]">
                            {formatarData(candidato.data_nascimento) ||
                              'Não informado'}
                          </dd>
                        </div>
                        <div className="mt-4 border-t border-[#2A2A72]/10 pt-3">
                          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                            Naturalidade
                          </dt>
                          <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#333]">
                            {candidato.naturalidade || 'Não informado'}
                          </dd>
                        </div>
                        <div className="mt-4 border-t border-[#2A2A72]/10 pt-3">
                          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                            UF de naturalidade
                          </dt>
                          <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#333]">
                            {candidato.uf_naturalidade || 'Não informado'}
                          </dd>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/75 p-4">
                        <div>
                          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                            Partido
                          </dt>
                          <dd className="mt-2 flex items-center gap-3 text-sm font-semibold text-[#333]">
                            {candidato.partidos?.bandeira_url ? (
                              <img
                                src={candidato.partidos.bandeira_url}
                                alt=""
                                className="h-10 w-10 shrink-0 rounded-full border border-[#2A2A72]/20 bg-white object-contain p-1"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2A2A72] text-[10px] font-black text-white"
                              >
                                {candidato.partidos?.sigla?.slice(0, 4) || '?'}
                              </span>
                            )}
                            <span>
                              {candidato.partidos
                                ? `${candidato.partidos.nome_completo} (${candidato.partidos.sigla})`
                                : 'Não informado'}
                            </span>
                          </dd>
                        </div>
                        <div className="mt-4 border-t border-[#2A2A72]/10 pt-3">
                          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                            Cargo atual
                          </dt>
                          <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#333]">
                            {candidato.cargo_atual || 'Não informado'}
                          </dd>
                        </div>
                        <div className="mt-4 border-t border-[#2A2A72]/10 pt-3">
                          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                            Vice
                          </dt>
                          <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-[#333]">
                            {candidato.vice || 'Não informado'}
                          </dd>
                        </div>
                      </div>
                    </dl>
                  </div>
                  <div
                    aria-hidden={secaoAtiva !== 'trajetoria'}
                    className="w-1/2 shrink-0 px-0.5"
                  >
                    <div className="grid gap-3 lg:grid-cols-2">
                      <div className="rounded-xl bg-white/75 p-4">
                        <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                          Formação acadêmica
                        </dt>
                        <dd className="mt-2 text-sm font-semibold leading-relaxed text-[#333]">
                          {candidato.formacao_academica?.length ? (
                            <ul className="space-y-3">
                              {candidato.formacao_academica.map(
                                (formacao, index) => (
                                  <li
                                    key={`${formacao.curso}-${formacao.instituicao}-${index}`}
                                  >
                                    <p>
                                      {formacao.curso || 'Curso não informado'}
                                    </p>
                                    <p className="font-medium text-[#666]">
                                      {formacao.instituicao}
                                      {formacao.ano_conclusao
                                        ? ` · ${formacao.ano_conclusao}`
                                        : ''}
                                    </p>
                                  </li>
                                ),
                              )}
                            </ul>
                          ) : (
                            'Não informado'
                          )}
                        </dd>
                      </div>
                      <Campo
                        titulo="Profissão anterior"
                        valor={candidato.profissao_anterior}
                      />
                      <Campo
                        titulo="Tempo de atuação"
                        valor={
                          candidato.tempo_atuacao_anos != null
                            ? `${candidato.tempo_atuacao_anos} anos`
                            : null
                        }
                      />
                      <div className="rounded-xl bg-white/75 p-4">
                        <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#666]">
                          Feitos e contribuições
                        </dt>
                        <dd className="mt-2 text-sm font-semibold leading-relaxed text-[#333]">
                          {candidato.feitos_resumo?.length ? (
                            <ul className="space-y-2">
                              {candidato.feitos_resumo.map((feito, index) => (
                                <li
                                  key={`${feito}-${index}`}
                                  className="flex gap-2"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="font-black text-[#FFA400]"
                                  >
                                    •
                                  </span>
                                  <span>{feito}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'Não informado'
                          )}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default PaginaPolitico;
