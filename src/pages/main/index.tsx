import { useState } from 'react';
import Header from '../../components/header';
import CardCarrossel from '../../components/cardCarrossel';
import VisualizadorGeografico from '../../assets/GIFs/visualizadorGeografico.gif';
import MatchPolitico from '../../assets/GIFs/matchPolitico.gif';
import SimuladorUrna from '../../assets/GIFs/simuladorUrna.gif';
import PipoDuvida from '../../assets/Imagens/pipoDuvida.png';
import PipoFeliz from '../../assets/Imagens/pipoFeliz.png';
import { GiStarFlag } from 'react-icons/gi';
import { FaArrowRightLong, FaPeopleGroup } from 'react-icons/fa6';

const cards = [
  {
    asset: MatchPolitico,
    title: 'match político',
    text: 'Descubra quais partidos mais combinam com suas ideias em poucos minutos.',
  },
  {
    asset: VisualizadorGeografico,
    title: 'visualizador geográfico',
    text: 'Navegue pelo mapa do Brasil e conheça os representantes de cada estado.',
  },
  {
    asset: SimuladorUrna,
    title: 'simulador de urna',
    text: 'Treine seu voto em uma simulação da urna eletrônica.',
  },
];

const CARD_WIDTH = 378;
const GAP = 65;
const SET_SHIFT = cards.length * (CARD_WIDTH + GAP);

export default function Main() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      `}</style>

      <section className="w-full h-[100dvh]">
        <div className="w-full fixed top-0 z-[1000]">
          <Header />
        </div>

        {/* PRIMEIRA PARTE SEÇÃO */}
        <div className="w-full h-full flex flex-col justify-center overflow-hidden">
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
        </div>

        {/* SEGUNDA PARTE SEÇÃO */}
        <div className="w-full h-full flex gap-[100px] bg-[#BDC3EA] justify-between overflow-hidden">
          <div className="flex-1 flex flex-col gap-[50px] px-[65px] justify-center relative">
            <div className="flex absolute top-10 items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.18em] text-ink-2 mb-7">
              <span className="w-[26px] h-[2px] bg-[#333] inline-block" />
              SearchPol
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1fr] gap-14 items-center">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-9">
                <div className="relative w-[220px] h-[220px] flex justify-center items-center flex-none">
                  <div className="bg-[#FFA400] relative rounded-full flex justify-center items-center w-[220px] h-[220px] overflow-hidden shadow-xl">
                    <img
                      className="object-contain w-full h-full absolute top-5"
                      src={PipoDuvida}
                      alt=""
                    />
                  </div>
                  <div className="absolute -top-1.5 -right-0.5 w-[48px] h-[48px] rounded-full bg-[#2A2A72] text-[#FFFBF2] flex items-center justify-center font-display font-black text-[22px] border-[4px] border-[#BDC3EA] shadow-[0_8px_18px_-6px_rgba(47,143,110,0.6)]">
                    ?
                  </div>
                </div>

                <div>
                  <h1 className="font-black leading-[1] tracking-[-0.01em] text-[55px] m-0">
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
                  <p className="text-base font-medium text-[#333]/65 leading-relaxed max-w-[34ch] mt-4">
                    Pesquise partidos e políticos e decida com informação — não
                    com achismo.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-10">
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

                <div className="bg-[#FFFBF2] rounded-full border-2 border-[#1B1B3A]/10 flex flex-wrap items-center gap-3 pl-5 pr-1.5 py-1.5 shadow-[0_8px_24px_-12px_rgba(27,27,58,0.25)]">
                  <span className="font-sans flex-1 text-sm text-[#1B1B3A]/50 min-w-[60%]">
                    Aqui no <b className="text-[#333] font-semibold">EPOL</b>,
                    você descobre.
                  </span>
                  <button className="font-sans flex items-center gap-2 bg-[#2A2A72] hover:bg-[#202056] text-[#FFFBF2] font-bold text-sm tracking-wide px-5 py-3.5 rounded-full transition-all hover:-translate-y-px whitespace-nowrap">
                    Pesquisar
                    <FaArrowRightLong />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TERCEIRA PARTE SEÇÃO */}
        <div className="w-full h-full bg-[#EAF6FF] flex gap-[100px] justify-between overflow-hidden">
          <div className="flex-1 flex flex-col gap-[50px] px-[65px] justify-center relative">
            <div className="flex absolute top-10 items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.18em] text-ink-2 mb-7">
              <span className="w-[26px] h-[2px] bg-[#333] inline-block" />
              Título de Eleitor
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-12 md:gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-5 mb-7">
                  <span className="text-[100px] sm:text-[128px] leading-[0.8] font-black text-[#FFA400] -ml-1">
                    16
                  </span>
                  <p className="text-lg sm:text-xl font-semibold text-[#333] max-w-[24ch] leading-snug">
                    anos é a idade mínima pra tirar seu título de eleitor e
                    começar a exercer sua cidadania.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-9">
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
                <p className="text-[15px] font-medium sm:text-base leading-relaxed text-[#333]/65 max-w-[48ch] mb-6">
                  No EPOL, você aprende de forma simples e direta como dar esse
                  primeiro passo, entendendo seus direitos e a importância da
                  participação política. Aqui, a informação vira ação.
                </p>

                <button className="flex items-center font-sans gap-2 bg-[#2A2A72] hover:bg-[#202056] text-[#FFFBF2] font-bold text-sm tracking-wide px-7 py-4 rounded-full transition-all hover:-translate-y-px w-fit">
                  Descobrir mais
                  <FaArrowRightLong />
                </button>
              </div>

              <div className="order-1 md:order-2 relative">
                <div className="relative rounded-[28px] overflow-hidden shadow-xl aspect-[5/5] bg-gradient-to-br to-[#FFA400] from-[#2A2A72] flex ">
                  <img
                    src={PipoFeliz}
                    alt="Jovem eleitor mostrando o título de eleitor"
                    className="absolute right-0 bottom-0 w-[420px]"
                  />
                  <div className="flex flex-col items-center gap-3 text-white/70 px-8 text-center"></div>
                </div>

                <div className="absolute -bottom-6 -left-4 sm:left-6 bg-white rounded-2xl shadow-xl border border-[#2A2A72]/10 px-4 py-3 flex items-center gap-3 max-w-[230px]">
                  <div className="w-9 h-9 rounded-full bg-[#FFA400]/15 text-[#D18800] flex items-center justify-center flex-none">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M6 15h4M14 9h4M14 12h4M14 15h2" />
                      <circle cx="8" cy="10.5" r="1.6" />
                    </svg>
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
      </section>
    </>
  );
}
