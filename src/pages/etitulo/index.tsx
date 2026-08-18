import Header from '../../components/header';
import pipo_fechado from '../../assets/Imagens/pipo_fechado.png';
import etitulo from '../../assets/Imagens/etitulo.png';
import retanguloazul from '../../assets/Imagens/retanguloazul.png';
import comoobter from '../../assets/Imagens/comoobter.png';
import { useRef } from 'react';

const bolasConfig = [
  { size: 280, top: '-40px', left: '-30px', opacity: 1 },
  { size: 160, top: '20px', left: '220px', opacity: 0.6 },
  { size: 100, top: '160px', left: '30px', opacity: 0.75 },
  { size: 240, top: '-50px', right: '-30px', opacity: 0.85 },
  { size: 150, top: '60px', right: '220px', opacity: 0.5 },
  { size: 80, top: '10px', right: '180px', opacity: 0.7 },
  { size: 260, bottom: '-50px', left: '-40px', opacity: 0.9 },
  { size: 120, bottom: '-20px', left: '190px', opacity: 0.7 },
  { size: 300, bottom: '-60px', right: '-40px', opacity: 1 },
  { size: 160, bottom: '120px', right: '200px', opacity: 0.6 },
];

function Etitulo() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section className="w-full">
        <div className="w-full fixed top-0 z-[1000]">
          <Header />
        </div>

        {/* PRIMEIRA PARTE SEÇÃO */}
        <div className="w-full bg-[#eaf6ff] flex justify-between items-start overflow-hidden pt-[140px] pb-[80px]">
          {/* COLUNA ESQUERDA - IMAGEM COM TEXTO */}
          <div className="flex flex-col items-start pl-[1px] max-w-[1200px]">
            <img src={etitulo} alt="etitulo" className="w-full max-w-none" />
          </div>

          {/* COLUNA DIREITA - MASCOTE */}
          <div
            className="shrink-0 flex justify-end pr-[65px]"
            style={{ width: 378 + 65 }}
          >
            <div
              ref={trackRef}
              className="relative"
              style={{ width: 378, height: 392 }}
            >
              <img
                src={retanguloazul}
                alt="retanguloazul"
                className="absolute top-0 left-20 w-full h-full"
              />
              <img
                src={pipo_fechado}
                alt="pipo_fechado"
                className="absolute"
                style={{
                  bottom: ' -25%',
                  left: '20%',
                  width: '200%',
                  height: '130%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative w-full h-[100dvh] bg-[#BDC3EA] overflow-hidden">
          <img
            src={comoobter}
            alt="comoobter"
            className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] max-w-none"
          />

          {bolasConfig.map((b, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: b.size,
                height: b.size,
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
      </section>
    </>
  );
}

export default Etitulo;
