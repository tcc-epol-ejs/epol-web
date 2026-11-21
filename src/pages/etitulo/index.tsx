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
        <div className="relative w-full min-h-[100dvh] bg-[#eaf6ff] flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start overflow-hidden pt-24 sm:pt-32 md:pt-40 lg:pt-[8vw] pb-24 md:pb-20 px-5 sm:px-8 md:pl-[0vw] gap-8 md:gap-6">
          {/* COLUNA ESQUERDA */}
          <div className="flex flex-col items-center md:items-start w-full md:max-w-[55%] md:mt-[4vw]">
            {/* Desktop: imagem original */}
            <img
              src={etitulo}
              alt="etitulo"
              className="hidden md:block md:max-w-none md:w-[115%] lg:w-[130%] h-auto"
            />
            {/* Celular: selo + texto */}
            <div className="md:hidden flex w-full max-w-[480px] flex-col items-start gap-5">
              <h1 className="rounded-full bg-[#FFA400] px-6 py-2 text-lg font-black text-[#1f2a52] shadow-sm">
                O QUE É?
              </h1>

              <div className="space-y-4 text-[15px] leading-relaxed text-[#1f2a52]">
                <p>
                  O{' '}
                  <strong className="text-[#D98200]">título de eleitor</strong>{' '}
                  é um documento oficial que comprova que uma pessoa está
                  registrada na Justiça Eleitoral e, portanto, tem o direito de
                  votar nas eleições. No Brasil, ele é essencial para o
                  exercício da cidadania, pois permite que o cidadão escolha
                  seus representantes, como presidente, governadores, prefeitos
                  e vereadores.
                </p>
                <p>
                  Esse documento contém informações importantes, como o{' '}
                  <strong className="text-[#D98200]">nome do eleitor</strong>,{' '}
                  <strong className="text-[#D98200]">
                    número de inscrição
                  </strong>
                  , <strong className="text-[#D98200]">zona eleitoral</strong> e{' '}
                  <strong className="text-[#D98200]">seção</strong> onde a
                  pessoa deve votar. O voto é obrigatório para cidadãos entre 18
                  e 70 anos, e facultativo para jovens de 16 e 17 anos, pessoas
                  com mais de 70 anos e analfabetos.
                </p>
                <p>
                  Além de ser necessário para votar, o título de eleitor também
                  pode ser exigido em diversas situações, como para tirar
                  passaporte, se inscrever em concursos públicos ou assumir
                  cargos públicos. Atualmente, ele também pode ser acessado em
                  formato digital, por meio de aplicativos oficiais, facilitando
                  ainda mais o acesso dos eleitores.
                </p>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA - MASCOTE (só desktop) */}
          <div className="hidden md:flex shrink-0 justify-end w-[38%] max-w-[560px]">
            <div
              ref={trackRef}
              className="relative w-full aspect-[480/500] mt-8"
            >
              <img
                src={retanguloazul}
                alt="retanguloazul"
                className="absolute top-0 left-[30%] w-full h-full object-contain"
              />
              <img
                src={pipo_fechado}
                alt="pipo_fechado"
                className="absolute bottom-[-30%] left-[25%] w-[200%] h-[140%] object-cover"
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
