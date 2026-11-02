import { useEffect, useRef, useState } from 'react';
import BotaoCadastro from '../../components/botoes/botaoCadastro';
import CardCarrossel from '../../components/cardCarrossel';
import Pipo1 from '../../assets/GIFs/pipo1.gif';
import Pipo2 from '../../assets/GIFs/pipo2.gif';
import Pipo3 from '../../assets/GIFs/pipo3.gif';
import MapaBrasil from '../../assets/Imagens/mapaBrasil.png';
import MatchPolitico from '../../assets/Imagens/matchPolitico.png';
import UrnaEletronica from '../../assets/Imagens/urnaEletronica.png';
import WidgetsFlutuantes from '../../components/widgetsFlutuantes';
import Header from '../../components/header';
import Footer from '../../components/footer/footer';
import { useNavigate } from 'react-router-dom';

/*
 * Breakpoints usados (padrão do Tailwind):
 *  - base  (< 640px)   -> celular: tudo em coluna, textos menores
 *  - sm    (≥ 640px)   -> celular grande / ajustes de grid
 *  - md    (≥ 768px)   -> tablet: coluna, mas com mais respiro e tipografia maior
 *  - lg    (≥ 1024px)  -> desktop: layout original em duas colunas, 100dvh por seção
 */

// Classes compartilhadas entre as 3 seções, para manter tudo consistente
const BLOCO =
  'w-full flex flex-col lg:flex-row lg:h-[100dvh] md:min-h-[100dvh] lg:min-h-0 ' +
  'justify-center lg:justify-between gap-10 md:gap-14 lg:gap-[100px] overflow-hidden';

const COLUNA_TEXTO =
  'flex-1 flex flex-col gap-8 lg:gap-[50px] items-start lg:items-center justify-center';

const TITULO =
  'font-black uppercase forced-small-caps tracking-wider text-center ' +
  'text-2xl leading-8 sm:text-3xl sm:leading-9 lg:text-start lg:text-[36px] lg:leading-10';

const SUBTITULO =
  'tracking-wider text-center text-sm md:text-base lg:text-start lg:text-[14px]';

const LINHA_CTA =
  'flex flex-col justify-center items-center sm:flex-row sm:items-center lg:justify-start gap-3 w-full';

const TEXTO_CTA =
  'uppercase font-bold text-center text-xs sm:text-[13px] lg:text-start tracking-wider max-[639px]:hidden';

// Tamanho dos cards do carrossel (proporção original 378 x 392).
// Abaixo de 1024px o card encolhe junto com a tela (mín. 220px, máx. 378px).
// No desktop fica fixo em 378px, como era antes.
const CARD_W = 'var(--card-w)';
const CARD_H = 'calc(var(--card-w) * 392 / 378)';

function Home() {
  const trackRef = useRef<HTMLDivElement>(null);
  const yRef = useRef(0);
  const rafRef = useRef<number>();
  const SPEED = 0.8;
  const GAP = 40;
  const navigate = useNavigate();

  // Abaixo de 1024px (celular/tablet) o carrossel roda na horizontal;
  // a partir de 1024px (desktop) roda na vertical.
  const [isHorizontal, setIsHorizontal] = useState(
    () => window.matchMedia('(max-width: 1023px)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = (e: MediaQueryListEvent) => setIsHorizontal(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Respeita quem desativou animações no sistema
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const originals = Array.from(track.children) as HTMLElement[];
    const clones = originals.map(
      (card) => track.appendChild(card.cloneNode(true)) as HTMLElement,
    );

    const getBlockSize = () => {
      const card = originals[0];
      const size = isHorizontal ? card.offsetWidth : card.offsetHeight;
      return originals.length * size + originals.length * GAP;
    };

    const tick = () => {
      yRef.current += SPEED;
      const blockSize = getBlockSize();
      if (yRef.current >= blockSize) yRef.current -= blockSize;
      track.style.transform = isHorizontal
        ? `translateX(-${yRef.current}px)`
        : `translateY(-${yRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current!);
      // remove os clones (evita duplicar no StrictMode / ao remontar)
      clones.forEach((c) => c.remove());
      track.style.transform = '';
      yRef.current = 0;
    };
  }, [isHorizontal]);

  return (
    <>
      <section className="w-full">
        <div className="w-full fixed top-0 z-[1000]">
          <Header />
        </div>

        {/* PRIMEIRA PARTE SEÇÃO */}
        {/* O espaço do header fica no bloco (pt) e não no texto, para não acumular padding */}
        <div
          className={`${BLOCO} bg-[#2A2A72] pt-24 pb-12 md:pt-28 md:pb-16 lg:py-0`}
        >
          {/* Texto: depois do carrossel no mobile/tablet, à esquerda no desktop */}
          <div className={`${COLUNA_TEXTO} px-6 md:px-12 lg:pl-[65px] lg:pr-0`}>
            <div className="w-full flex items-center lg:items-start flex-col gap-[15px]">
              <h1 className={`${TITULO} text-[#CBCBEC]`}>
                O portal de política feito pra você!
              </h1>
              <h2 className={`${SUBTITULO} text-[#CBCBEC] max-w-xl`}>
                Seu site informativo sobre política! Um lugar com informação de
                qualidade, atualizada e, o mais importante: totalmente
                imparcial.
              </h2>
            </div>

            <div className={LINHA_CTA}>
              <BotaoCadastro onClick={() => navigate('/cadastro')}>
                Cadastre-se
              </BotaoCadastro>

              <p className={`${TEXTO_CTA} text-[#FFA400]`}>
                e desenvolva um pensamento político crítico!
              </p>
            </div>
          </div>

          {/* Carrossel: horizontal e em cima do texto no mobile/tablet, vertical à direita no desktop */}
          <div
            className={
              'order-first lg:order-last relative shrink-0 w-full lg:w-[443px] overflow-hidden ' +
              'lg:h-full [--card-w:clamp(220px,46vw,378px)] lg:[--card-w:378px] ' +
              'h-[calc(var(--card-w)_*_392_/_378_+_2rem)]'
            }
          >
            <div
              ref={trackRef}
              className="absolute top-0 inset-x-0 h-full lg:h-auto flex flex-row lg:flex-col items-center lg:items-start"
              style={{ gap: GAP, willChange: 'transform' }}
            >
              <CardCarrossel asset={Pipo1} width={CARD_W} height={CARD_H} />
              <CardCarrossel asset={Pipo2} width={CARD_W} height={CARD_H} />
              <CardCarrossel asset={Pipo3} width={CARD_W} height={CARD_H} />
            </div>
          </div>
        </div>

        {/* SEGUNDA PARTE SEÇÃO */}
        <div className={BLOCO}>
          {/* Cards de funcionalidades (no mobile ficam abaixo do texto) */}
          <div className="order-2 lg:order-1 flex lg:items-center h-auto lg:h-full px-6 pb-16 md:px-12 lg:py-[100px] lg:pl-[65px] lg:pr-0">
            <div className="w-full max-w-[560px] mx-auto lg:mx-0 grid grid-cols-1 sm:grid-cols-[245fr_290fr] gap-3 lg:h-[360px]">
              <div className="sm:row-span-2 min-h-[280px] sm:min-h-0 rounded-[20px] bg-[#FFA400] flex flex-col items-center justify-center gap-4 p-6">
                <p className="text-white font-black uppercase tracking-wider text-center text-sm">
                  Visualizador Geográfico
                </p>
                <img
                  src={MapaBrasil}
                  alt=""
                  className="w-full flex-1 min-h-0 max-h-[240px] sm:max-h-none object-contain"
                />
              </div>

              <div className="min-h-[165px] rounded-[20px] bg-[#2A2A72] flex flex-col items-center justify-between gap-3 p-6 pt-8 sm:pt-11">
                <img
                  src={MatchPolitico}
                  alt=""
                  className="object-contain h-16"
                />
                <p className="text-white font-black uppercase tracking-wider text-center text-sm">
                  Match Político
                </p>
              </div>

              <div className="min-h-[165px] rounded-[20px] bg-[#009FFD] flex flex-col items-center justify-between gap-3 p-6">
                <img
                  src={UrnaEletronica}
                  alt=""
                  className="object-contain h-24"
                />
                <p className="text-white font-black uppercase tracking-wider text-center text-sm">
                  Simulador de Urna
                </p>
              </div>
            </div>
          </div>

          {/* Texto (no mobile vem primeiro) */}
          <div
            className={`order-1 lg:order-2 ${COLUNA_TEXTO} px-6 pt-16 md:px-12 md:pt-20 lg:pt-0 lg:pl-0 lg:pr-[65px]`}
          >
            <div className="w-full flex flex-col items-center lg:items-start gap-[15px]">
              <h1 className={`${TITULO} text-[#333]`}>
                política de um jeito fácil e educativo!
              </h1>
              <h2 className={`${SUBTITULO} text-[#333] max-w-xl`}>
                No EPOL, você encontra funcionalidades diversas que facilitam a
                compreensão da política no dia a dia.
              </h2>
            </div>

            <div className={LINHA_CTA}>
              <BotaoCadastro onClick={() => navigate('/cadastro')}>
                Cadastre-se
              </BotaoCadastro>

              <p className={`${TEXTO_CTA} text-[#FFA400]`}>
                e obtenha acesso à funcionalidades exclusivas!
              </p>
            </div>
          </div>
        </div>

        {/* TERCEIRA PARTE SEÇÃO */}
        <div className={`${BLOCO} bg-[#BDC3EA]`}>
          <div
            className={`${COLUNA_TEXTO} px-6 pt-16 md:px-12 md:pt-20 lg:pt-0 lg:pl-[65px] lg:pr-0`}
          >
            <div className="w-full flex flex-col items-center lg:items-start gap-[15px]">
              <h1 className={`${TITULO} text-[#472E00]`}>
                entenda sobre como adquirir seu e-título!
              </h1>
              <h2 className={`${SUBTITULO} text-[#472E00] max-w-xl`}>
                Um guia simples e prático para emitir seu documento digital e
                acessar os principais serviços eleitorais sem complicação.
              </h2>
            </div>

            <div className={LINHA_CTA}>
              <BotaoCadastro
                onClick={() => navigate('/cadastro')}
                bgColor="#2A2A72"
                textColor="#eaf6ff"
              >
                Cadastre-se
              </BotaoCadastro>

              <p className={`${TEXTO_CTA} text-[#2A2A72]`}>
                e exerça seu dever de cidadão!
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full lg:w-[495px] lg:h-full px-6 pb-16 md:px-12 lg:p-0 lg:pr-[65px] flex justify-center lg:justify-end lg:items-center overflow-hidden">
            <WidgetsFlutuantes />
          </div>
        </div>

        <Footer />
      </section>
    </>
  );
}

export default Home;
