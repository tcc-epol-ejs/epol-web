import Header from '../../components/header';
import pipo_fechado from '../../assets/Imagens/pipo_fechado.png';
import etitulo from '../../assets/Imagens/etitulo.png';
import retanguloazul from '../../assets/Imagens/retanguloazul.png';
import { useRef } from 'react';

function Etitulo() {
  const trackRef = useRef<HTMLDivElement>(null);
  const yRef = useRef(0);
  const rafRef = useRef<number>();
  const SPEED = 0.8;
  const GAP = 40;

  return (
    <>
      <section className="w-full h-[100dvh]">
        <div className="w-full fixed top-0 z-[1000]">
          <Header />
        </div>

        {/* PRIMEIRA PARTE SEÇÃO */}
        <div className="w-full h-full bg-[#eaf6ff] flex gap-[100px] justify-between overflow-hidden">
          {/* COLUNA ESQUERDA - TEXTO */}
          <div className="flex-1 flex flex-col gap-[50px] pl-[65px] items-center justify-center">
            <div className="w-full flex flex-col gap-[15px]">
              <div className="w-full flex flex-col gap-[15px]">
                <img
                  src={etitulo}
                  alt="etitulo"
                  className="w-[150%] max-w-none -ml-[80px]"
                />
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA - IMAGEM */}
          <div
            className="shrink-0 flex justify-end items-center overflow-hidden h-full relative"
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
                  top: '-20%',
                  left: '20%',
                  width: '80%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Etitulo;
