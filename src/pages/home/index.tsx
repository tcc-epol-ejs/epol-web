import { useEffect, useRef, useState } from 'react';
import BotaoCadastro from '../../components/botoes/botaoCadastro';
import CardCarrossel from '../../components/cardCarrossel';
import Pipo1 from '../../assets/GIFs/pipo1.gif';
import Pipo2 from '../../assets/GIFs/pipo2.gif';
import Pipo3 from '../../assets/GIFs/pipo3.gif';

function Home() {
  const trackRef = useRef<HTMLDivElement>(null);
  const yRef = useRef(0);
  const rafRef = useRef<number>();
  const SPEED = 0.6;
  const GAP = 40;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const originals = Array.from(track.children) as HTMLElement[];

    originals.forEach((card) => track.appendChild(card.cloneNode(true)));

    const getBlockHeight = () => {
      const cardH = originals[0].offsetHeight;
      return originals.length * cardH + originals.length * GAP;
    };

    const tick = () => {
      yRef.current += SPEED;
      const blockH = getBlockHeight();
      if (yRef.current >= blockH) yRef.current -= blockH;
      track.style.transform = `translateY(-${yRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  return (
    <>
      <section className="w-full h-[100dvh]">
        <div className="w-full h-full bg-[#2A2A72] flex gap-[100px] justify-between overflow-hidden">
          <div className="flex-1 flex flex-col gap-[50px] pl-[65px] items-center justify-center">
            <div className="w-full flex flex-col gap-[15px]">
              <h1 className="font-black uppercase forced-small-caps leading-10 tracking-wider text-[36px] text-[#CBCBEC]">
                O portal de política feito pra você!
              </h1>
              <h2 className=" tracking-wider text-[14px] text-[#CBCBEC]">
                Seu site informativo sobre política! Um lugar com informação de
                qualidade, atualizada e, o mais importante: totalmente
                imparcial.
              </h2>
            </div>

            <div className="flex gap-3 w-full items-center ">
              <BotaoCadastro>Cadastre-se</BotaoCadastro>

              <p className="uppercase font-bold text-[#FFA400] text-[13px] tracking-wider">
                e desenvolva um pensamento político crítico!
              </p>
            </div>
          </div>
          <div
            className="shrink-0 flex justify-end pr-[65px] items-center overflow-hidden h-full relative"
            style={{ width: 378 + 65 }}
          >
            <div
              ref={trackRef}
              className="flex flex-col absolute top-0"
              style={{ gap: GAP, willChange: 'transform' }}
            >
              <CardCarrossel asset={Pipo1} />
              <CardCarrossel asset={Pipo2} />
              <CardCarrossel asset={Pipo3} />
            </div>
          </div>
        </div>
        <div className="w-full h-full bg-[#EAF6FF]">
          <p>OIIII</p>
        </div>
      </section>
    </>
  );
}

export default Home;
