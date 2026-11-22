import { useEffect, useRef, useState } from 'react';
import Header from '../../components/header';
import CardCarrossel from '../../components/cardCarrossel';
import VisualizadorGeografico from '../../assets/GIFs/visualizadorGeografico.gif';
import MatchPolitico from '../../assets/GIFs/matchPolitico.gif';
import SimuladorUrna from '../../assets/GIFs/simuladorUrna.gif';
import PipoDuvida from '../../assets/Imagens/pipoDuvida.png';
import PipoTituloEleitor from '../../assets/Imagens/pipoTituloEleitor.png';
import SetaLinhaTempo from '../../assets/Imagens/seta_linhatempo.png';
import { GiStarFlag } from 'react-icons/gi';
import {
  FaArrowRightLong,
  FaArrowLeftLong,
  FaPeopleGroup,
} from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/footer';

/*
 * Breakpoints (Tailwind):
 *  - base (< 640px)  -> celular
 *  - sm   (≥ 640px)  -> celular grande
 *  - md   (≥ 768px)  -> tablet
 *  - lg   (≥ 1024px) -> desktop (layout original)
 */

const cards = [
  {
    asset: MatchPolitico,
    path: '/match-politico',
    title: 'match político',
    text: 'Descubra quais partidos mais combinam com suas ideias em poucos minutos.',
  },
  {
    asset: VisualizadorGeografico,
    path: '/visualizador',
    title: 'visualizador geográfico',
    text: 'Navegue pelo mapa do Brasil e conheça os representantes de cada estado.',
  },
  {
    asset: SimuladorUrna,
    path: '/simulador-urna',
    title: 'simulador de urna',
    text: 'Treine seu voto em uma simulação da urna eletrônica.',
  },
];

const CARD_WIDTH = 378;
const GAP = 65;
const SET_SHIFT = cards.length * (CARD_WIDTH + GAP);

// Carrossel de arrastar (celular/tablet)
const SLIDE_GAP = 20; // = gap-5 do Tailwind

function useIsDesktop() {
  const query = '(min-width: 1024px)';
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

function CarrosselDeslizante() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const getStep = () => {
    const first = scrollRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + SLIDE_GAP : 0;
  };

  const onScroll = () => {
    const el = scrollRef.current;
    const step = getStep();
    if (!el || !step) return;
    const index = Math.round(el.scrollLeft / step);
    setActive(Math.max(0, Math.min(cards.length - 1, index)));
  };

  const goTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    el.scrollTo({
      left: index * getStep(),
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 [--slide-w:min(78vw,378px)]">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="w-full flex gap-5 overflow-x-auto snap-x snap-mandatory py-4
          px-[calc((100%-var(--slide-w))/2)]
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <div
            key={card.title}
            className="snap-center snap-always shrink-0 w-[var(--slide-w)] flex flex-col items-center gap-1"
          >
            <CardCarrossel
              width="100%"
              height="var(--slide-w)"
              asset={card.asset}
              path={card.path}
            />
            <h2 className="mt-2 font-black uppercase forced-small-caps leading-8 tracking-wider text-[18px] sm:text-[20px] text-[#333] text-center">
              {card.title}
            </h2>
            <p className="tracking-wider text-center font-medium text-[14px] text-[#333]/65 px-2">
              {card.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Card anterior"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className="w-11 h-11 rounded-full bg-[#2A2A72] text-[#FFFBF2] flex items-center justify-center transition-opacity disabled:opacity-30"
        >
          <FaArrowLeftLong />
        </button>

        <div className="flex items-center">
          {cards.map((card, i) => (
            <button
              key={card.title}
              type="button"
              aria-label={`Ir para ${card.title}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className="p-2"
            >
              <span
                className={`block h-2.5 rounded-full transition-all ${
                  i === active ? 'w-6 bg-[#FFA400]' : 'w-2.5 bg-[#333]/25'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Próximo card"
          onClick={() => goTo(active + 1)}
          disabled={active === cards.length - 1}
          className="w-11 h-11 rounded-full bg-[#2A2A72] text-[#FFFBF2] flex items-center justify-center transition-opacity disabled:opacity-30"
        >
          <FaArrowRightLong />
        </button>
      </div>
    </div>
  );
}

export default function Main() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  return (
    <>
      <style>{`
        @keyframes carrossel-loop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${SET_SHIFT}px); }
        }
        .carrossel-track {
          animation: carrossel-loop 25s linear infinite;
          width: max-content;
        }
        .carrossel-track:hover {
          animation-play-state: paused;
        }
        .carrossel-card {
          transition: transform 0.35s ease, opacity 0.35s ease, filter 0.35s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .carrossel-track { animation: none; }
        }
      `}</style>

      <section className="w-full">
        <div className="w-full fixed top-0 z-[1000]">
          <Header isBgWhite />
        </div>

        {/* PRIMEIRA PARTE SEÇÃO */}
        <div className="w-full min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-24 pb-10 lg:py-0">
          {isDesktop ? (
            <div className="w-full overflow-x-hidden py-8">
              <div className="carrossel-track flex gap-[65px]">
                {[...cards, ...cards].map((card, index) => {
                  const isHovered = hoveredIndex === index;
                  const isDimmed = hoveredIndex !== null && !isHovered;

                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="carrossel-card w-[378px] flex flex-col justify-center items-center gap-1 shrink-0 cursor-pointer"
                      style={{
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                        opacity: isDimmed ? 0.4 : 1,
                        filter: isDimmed ? 'grayscale(30%)' : 'none',
                        zIndex: isHovered ? 10 : 1,
                      }}
                    >
                      <CardCarrossel
                        width={350}
                        height={350}
                        asset={card.asset}
                        path={card.path}
                      />
                      <h2 className="font-black uppercase forced-small-caps leading-10 tracking-wider text-[20px] text-[#333]">
                        {card.title}
                      </h2>
                      <p className="tracking-wider text-center font-medium text-[14px] text-[#333]/65">
                        {card.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <CarrosselDeslizante />
          )}
        </div>

        {/* SEGUNDA PARTE SEÇÃO */}
        <div className="w-full min-h-[100dvh] flex bg-[#BDC3EA] overflow-hidden">
          <div className="flex-1 flex flex-col gap-8 lg:gap-[50px] px-6 py-16 md:px-12 lg:px-[65px] lg:py-0 justify-center relative">
            <div className="flex lg:absolute lg:top-10 items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.18em] text-ink-2 lg:mb-7">
              <span className="w-[26px] h-[2px] bg-[#333] inline-block" />
              SearchPol
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1fr] gap-10 lg:gap-14 items-center">
              <div className="flex flex-col justify-center sm:flex-row items-center gap-6 sm:gap-9 text-center sm:text-left">
                <div className="relative w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] flex justify-center items-center flex-none max-[639px]:hidden">
                  <div className="bg-[#FFA400] relative rounded-full flex justify-center items-center w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] overflow-hidden shadow-xl">
                    <img
                      className="object-contain w-full h-full absolute top-3 sm:top-5"
                      src={PipoDuvida}
                      alt=""
                    />
                  </div>
                  <div className="absolute -top-1.5 -right-0.5 w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full bg-[#2A2A72] text-[#FFFBF2] flex items-center justify-center font-display font-black text-[18px] sm:text-[22px] border-[4px] border-[#BDC3EA] shadow-[0_8px_18px_-6px_rgba(47,143,110,0.6)]">
                    ?
                  </div>
                </div>

                <div>
                  <h1 className="font-black leading-[1] tracking-[-0.01em] text-[40px] sm:text-[48px] lg:text-[55px] m-0 ">
                    <span className="font-[Fraunces] uppercase block text-[#333]">
                      Não
                    </span>
                    <span className="font-[Fraunces] uppercase block text-[#333]">
                      sabe em
                    </span>
                    <span className="font-[Fraunces] italic font-semibold block text-[#2A2A72] mb-3">
                      quem
                    </span>
                    <span className="font-[Fraunces] uppercase block text-[#333]">
                      votar?
                    </span>
                  </h1>
                  <p className="text-base font-medium text-[#333]/65 leading-relaxed max-w-[34ch] mx-auto sm:mx-0 mt-4">
                    Pesquise partidos e políticos e decida com informação — não
                    com achismo.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-8 lg:gap-10 w-full max-w-xl mx-auto lg:max-w-none lg:mx-0">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    role="button"
                    className="relative rounded-2xl p-5 pb-5 cursor-default overflow-hidden isolate
                    transition-transform duration-300 ease-out
                    shadow-[0_10px_0_-2px_rgba(0,0,0,0.06)] hover:shadow-soft bg-gradient-to-br to-[#FFC65C] from-[#FFD68A]
                   text-[#A36A00] hover:-translate-y-[6px] hover:-rotate-[1.2deg]"
                  >
                    <span className="block font-mono text-[10px] tracking-[0.08em] opacity-55 mb-3.5">
                      · EPOL
                    </span>
                    <GiStarFlag size={37} className="mb-3.5" />
                    <div className="font-extrabold text-[15px] uppercase leading-tight">
                      Partidos políticos
                    </div>
                  </div>

                  <div
                    role="button"
                    className="relative rounded-2xl p-5 pb-5 cursor-default overflow-hidden isolate
                    transition-transform duration-300 ease-out
                    shadow-[0_10px_0_-2px_rgba(0,0,0,0.06)] hover:shadow-soft
                    bg-gradient-to-br from-[#FFA400] to-[#D18800] text-[#FFF6E6] hover:-translate-y-[6px] hover:-rotate-[-1.2deg]"
                  >
                    <span className="block font-mono text-[10px] tracking-[0.08em] opacity-55 mb-3.5">
                      · EPOL
                    </span>
                    <FaPeopleGroup size={37} className="mb-3.5" />
                    <div className="font-extrabold text-[15px] uppercase leading-tight">
                      Políticos
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFBF2] rounded-3xl sm:rounded-full border-2 border-[#1B1B3A]/10 flex flex-wrap items-center gap-3 p-3 sm:pl-5 sm:pr-1.5 sm:py-1.5 shadow-[0_8px_24px_-12px_rgba(27,27,58,0.25)]">
                  <span className="font-sans flex-1 text-sm text-[#1B1B3A]/50 min-w-[60%] px-2 sm:px-0">
                    Aqui no <b className="text-[#333] font-semibold">EPOL</b>,
                    você descobre.
                  </span>
                  <button
                    onClick={() => navigate('/searchpol')}
                    className="font-sans flex items-center justify-center gap-2 w-full sm:w-auto bg-[#2A2A72] hover:bg-[#202056] text-[#FFFBF2] font-bold text-sm tracking-wide px-5 py-3.5 rounded-full transition-all hover:-translate-y-px whitespace-nowrap"
                  >
                    Pesquisar
                    <FaArrowRightLong />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TERCEIRA PARTE SEÇÃO */}
        <div className="w-full min-h-[100dvh] bg-[#EAF6FF] flex overflow-hidden">
          <div className="flex-1 flex flex-col gap-8 lg:gap-[50px] px-6 py-16 md:px-12 lg:px-[65px] lg:py-0 justify-center relative">
            <div className="flex lg:absolute lg:top-10 items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.18em] text-ink-2 lg:mb-7">
              <span className="w-[26px] h-[2px] bg-[#333] inline-block" />
              Título de Eleitor
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-5 mb-7">
                  <span className="text-[72px] sm:text-[100px] lg:text-[128px] leading-[0.8] font-black text-[#FFA400] -ml-1">
                    16
                  </span>
                  <p className="text-base sm:text-xl font-semibold text-[#333] max-w-[24ch] leading-snug">
                    anos é a idade mínima pra tirar seu título de eleitor e
                    começar a exercer sua cidadania.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-9">
                  {[
                    { label: 'Gratuito' },
                    { label: '100% online' },
                    { label: 'Leva 5 minutos' },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className="flex items-center gap-2 bg-[#BDC3EA] border border-[#2A2A72]/10 rounded-full px-4 py-2 text-[13px] font-bold text-[#333] shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2A2A72]" />
                      {item.label}
                    </span>
                  ))}
                </div>
                <p className="text-[15px] text-center lg:text-left mx-auto lg:mx-0 font-medium sm:text-base leading-relaxed text-[#333]/65 max-w-[48ch] mb-6">
                  No EPOL, você aprende de forma simples e direta como dar esse
                  primeiro passo, entendendo seus direitos e a importância da
                  participação política. Aqui, a informação vira ação.
                </p>

                <button
                  onClick={() => navigate('/etitulo')}
                  className="flex items-center font-sans gap-2 bg-[#2A2A72] hover:bg-[#202056] text-[#FFFBF2] font-bold text-sm tracking-wide px-7 py-4 rounded-full transition-all hover:-translate-y-px w-fit mx-auto lg:mx-0"
                >
                  Descobrir mais
                  <FaArrowRightLong />
                </button>
              </div>

              <div className="order-1 lg:order-2 relative w-full max-w-[420px] mx-auto lg:max-w-none lg:mx-0 mb-6 lg:mb-0">
                <div className="relative rounded-[28px] overflow-hidden shadow-xl aspect-[5/5] bg-gradient-to-br to-[#FFA400] from-[#2A2A72] flex ">
                  <img
                    src={PipoTituloEleitor}
                    alt="Jovem eleitor mostrando o título de eleitor"
                    className="absolute right-0 -bottom-[3%] w-[95%] max-w-none"
                  />
                  <div className="flex flex-col items-center gap-3 text-white/70 px-8 text-center"></div>
                </div>

                <div className="absolute -bottom-6 -left-2 sm:left-6 bg-white rounded-2xl shadow-xl border border-[#2A2A72]/10 px-4 py-3 flex items-center gap-3 max-w-[230px]">
                  <div className="w-9 h-9 rounded-full bg-[#FFA400]/15 text-[#D18800] flex items-center justify-center flex-none">
                    <img
                      src={SetaLinhaTempo}
                      alt=""
                      aria-hidden="true"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono tracking-[0.06em] text-[#333]/45 leading-none mb-1">
                      · EPOL
                    </p>
                    <p className="text-[13px] font-bold text-[#333] leading-tight">
                      Título de Eleitor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QUARTA PARTE SEÇÃO */}
        <div className="relative w-full min-h-[100dvh] bg-[#16803C] flex overflow-hidden ">
          {/* Fundo decorativo (só desktop) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
            viewBox="0 0 1400 900"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 950 -80
         C 860 35, 1010 145, 900 260
         C 790 375, 690 405, 790 530
         C 890 655, 760 760, 690 980
         L 1400 980
         L 1400 -80 Z"
              fill="#2A2A72"
            />
            <path
              d="M 950 -80
         C 860 35, 1010 145, 900 260
         C 790 375, 690 405, 790 530
         C 890 655, 760 760, 690 980"
              stroke="#FFCA28"
              strokeWidth="7"
              strokeOpacity="0.95"
            />
            <path
              d="M 0 900 L 717 900"
              stroke="#FFCA28"
              strokeWidth="8"
              strokeLinecap="square"
            />
            <path
              d="M 920 0 L 1400 0"
              stroke="#FFCA28"
              strokeWidth="8"
              strokeLinecap="round"
              strokeOpacity="0.95"
            />
          </svg>

          <img
            src={SetaLinhaTempo}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full object-contain object-left-top lg:block"
          />

          <div className="relative z-20 flex w-full flex-col lg:grid lg:grid-cols-[62%_38%]">
            {/* Texto */}
            <div className="flex flex-1 flex-col justify-center px-6 pb-10 pt-28 md:px-12 lg:flex-none lg:-translate-y-10 lg:px-[clamp(64px,7vw,120px)] lg:pb-5 lg:pt-0">
              <h2 className="max-w-[760px] font-[Fraunces] text-[clamp(44px,13vw,88px)] leading-[0.85] tracking-[-0.05em] text-[#FFFBF2] lg:text-[clamp(76px,7.2vw,118px)] lg:leading-[0.82] lg:tracking-[-0.055em]">
                Linha do
                <span className="mt-2 flex flex-wrap items-baseline gap-x-3 lg:mt-3 lg:flex-nowrap lg:gap-x-0 lg:whitespace-nowrap">
                  <span>Tempo</span>
                  <span className="italic font-semibold text-[#FFCA28] lg:ml-5">
                    Presidencial
                  </span>
                </span>
              </h2>

              <div className="mt-6 flex items-center gap-4 lg:gap-5">
                <span className="block h-[56px] w-[4px] flex-none bg-[#2A2A72] lg:h-[74px]" />
                <p className="max-w-[590px] text-[16px] font-semibold leading-[1.5] text-[#FFFBF2]/90 sm:text-[18px] lg:text-[22px]">
                  Entenda a história do Brasil pelos presidentes que fizeram
                  parte de cada momento do país.
                </p>
              </div>
            </div>

            {/* Botão */}
            <div className="relative flex items-center justify-center rounded-t-[40px] border-t-[6px] border-[#FFCA28] bg-[#2A2A72] px-6 py-10 lg:items-end lg:justify-start lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pb-[40%] lg:pl-36">
              <button
                onClick={() => navigate('/linha_do_tempo')}
                className="group relative z-10 flex h-[68px] w-full max-w-[300px] items-center justify-between rounded-full border-[3px] border-[#FFFFFF] bg-[#16803C] px-6 text-[22px] font-black text-[#FFFBF2] transition-all duration-500 ease-out hover:bg-[#106d32] sm:h-[84px] sm:text-[26px] lg:h-[104px] lg:w-[310px] lg:max-w-none lg:-translate-y-10 lg:px-9 lg:text-[30px] lg:hover:-translate-y-[52px]"
              >
                <span>Acessar já!</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFCA28] text-[#FFFFFF] transition-transform duration-300 group-hover:translate-x-1 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                  <FaArrowRightLong size={21} />
                </span>
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </section>
    </>
  );
}
