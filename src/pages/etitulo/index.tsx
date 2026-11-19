import Header from '../../components/header';
import CarrosselEtitulo from '../../components/carrosselEtitulo';
import pipo_fechado from '../../assets/Imagens/pipo_fechado.png';
import etitulo from '../../assets/Imagens/etitulo.png';
import retanguloazul from '../../assets/Imagens/retanguloazul.png';
import comoobter from '../../assets/Imagens/comoobter.png';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/footer';

const bolasConfig = [
  { size: 280, top: '-8%', left: '-8%', opacity: 1 },
  { size: 160, top: '5%', left: '45%', opacity: 0.6 },
  { size: 100, top: '30%', left: '8%', opacity: 0.75 },
  { size: 240, top: '-10%', right: '-8%', opacity: 0.85 },
  { size: 150, top: '12%', right: '35%', opacity: 0.5 },
  { size: 80, top: '2%', right: '25%', opacity: 0.7 },
  { size: 260, bottom: '-10%', left: '-10%', opacity: 0.9 },
  { size: 120, bottom: '-4%', left: '30%', opacity: 0.7 },
  { size: 300, bottom: '-12%', right: '-10%', opacity: 1 },
  { size: 160, bottom: '20%', right: '30%', opacity: 0.6 },
];

function Etitulo() {
  const trackRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToNextSection = () => {
    secondSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="w-full min-h-[100dvh]">
        <div className="w-full fixed top-0 z-[1000]">
          <Header />
        </div>

        {/* PRIMEIRA PARTE SEÇÃO */}

        {/* PRIMEIRA PARTE SEÇÃO */}
        <div className="relative w-full min-h-[100dvh] bg-[#eaf6ff] flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start overflow-hidden pt-24 sm:pt-32 md:pt-40 lg:pt-[8vw] pb-24 md:pb-20 px-4 sm:px-8 md:pl-[0vw] gap-8 md:gap-6">
          {/* COLUNA ESQUERDA */}
          <div className="flex flex-col items-center md:items-start w-full md:max-w-[55%] md:mt-[4vw] -mx-4 sm:mx-0">
            <img
              src={etitulo}
              alt="etitulo"
              className="w-[calc(100%+2rem)] max-w-none sm:w-full sm:max-w-[520px] md:max-w-none md:w-[115%] lg:w-[130%] h-auto"
            />
          </div>

          {/* COLUNA DIREITA - MASCOTE */}
          <div className="shrink-0 flex justify-center md:justify-end w-full md:w-[38%] md:max-w-[560px]">
            <div
              ref={trackRef}
              className="relative w-[70%] max-w-[260px] aspect-square md:w-full md:max-w-none md:aspect-[480/500] md:mt-8"
            >
              <img
                src={retanguloazul}
                alt="retanguloazul"
                className="absolute inset-0 w-full h-full object-contain md:inset-auto md:top-0 md:left-[30%]"
              />
              <img
                src={pipo_fechado}
                alt="pipo_fechado"
                className="absolute inset-0 w-full h-full object-contain md:inset-auto md:bottom-[-30%] md:left-[25%] md:w-[200%] md:h-[140%] md:object-cover"
              />
            </div>
          </div>

          {/* SETA ANIMADA */}
          <button
            onClick={scrollToNextSection}
            aria-label="Rolar para a próxima seção"
            className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-[1] cursor-pointer"
          >
            <svg
              width="28"
              height="28"
              className="sm:w-8 sm:h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A4A8A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div
          ref={secondSectionRef}
          className="relative w-full min-h-[100dvh] bg-[#BDC3EA] overflow-hidden flex flex-col items-center pt-10 sm:pt-16 gap-10 sm:gap-14 px-4 pb-12"
        >
          <img
            src={comoobter}
            alt="comoobter"
            className="w-[70%] sm:w-[50%] md:w-[35%] max-w-[420px] h-auto relative z-10"
          />

          <div className="relative z-10 w-full max-w-[1200px] flex items-center justify-center gap-6 md:gap-10 px-2">
            <CarrosselEtitulo />
          </div>

          {bolasConfig.map((b, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `min(${b.size}px, 28vw)`,
                height: `min(${b.size}px, 28vw)`,
                top: 'top' in b ? b.top : undefined,
                bottom: 'bottom' in b ? b.bottom : undefined,
                left: 'left' in b ? b.left : undefined,
                right: 'right' in b ? b.right : undefined,
                backgroundColor: '#8888D3',
                opacity: b.opacity,
                zIndex: 0,
              }}
            />
          ))}
        </div>

        <Footer />
      </section>
    </>
  );
}

export default Etitulo;
