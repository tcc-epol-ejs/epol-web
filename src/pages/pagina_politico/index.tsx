import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/header';
import { buscarCandidato, type Candidato } from '../../services/api';

function PaginaPolitico() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idCandidato = searchParams.get('id');
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

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
            <span className="sr-only">Carregando informações do candidato...</span>
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
          <article className="mx-auto flex w-full max-w-[960px] flex-col overflow-hidden rounded-[24px] border-2 border-[#2A2A72] bg-white text-[#2A2A72] shadow-[0_16px_40px_-28px_rgba(42,42,114,0.65)] sm:flex-row">
            <div className="flex h-64 w-full shrink-0 items-center justify-center overflow-hidden bg-[#2A2A72] sm:h-auto sm:min-h-[320px] sm:w-[360px]">
              {candidato.foto_url ? (
                <img
                  src={candidato.foto_url}
                  alt={`Foto de ${candidato.nome_politico || candidato.nome_completo}`}
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
                {candidato.nome_politico || candidato.nome_completo}
              </h1>
              <p className="text-base font-bold">
                Candidato a{' '}
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
        )}
      </main>
    </div>
  );
}

export default PaginaPolitico;