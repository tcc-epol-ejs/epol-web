import { useEffect, useRef } from 'react';
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

function Home() {
  const trackRef = useRef<HTMLDivElement>(null);
  const yRef = useRef(0);
  const rafRef = useRef<number>();
  const SPEED = 0.8;
  const GAP = 40;
  const navigate = useNavigate();

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
        <div className="w-full fixed top-0 z-[1000]">
          <Header />
        </div>

        {/* PRIMEIRA PARTE SEÇÃO */}
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
              <BotaoCadastro onClick={() => navigate('/cadastro')}>
                Cadastre-se
              </BotaoCadastro>

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
        {/* SEGUNDA PARTE SEÇÃO */}
        <div className="w-full h-full flex gap-[100px] justify-between overflow-hidden">
          <div className="flex items-center gap-3 h-full py-[100px] pl-[65px]">
            <div className="flex-1 h-[360px] w-[245px] rounded-[20px] bg-[#FFA400] flex flex-col items-center justify-center gap-4 p-6">
              <p className="text-white font-black uppercase tracking-wider text-center text-sm">
                Visualizador Geográfico
              </p>
              <img
                src={MapaBrasil}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col justify-between items gap-3 flex-1 h-[360px]">
              <div className="h-[165px] w-[290px] flex-1 rounded-[20px] bg-[#2A2A72] flex flex-col items-center justify-between gap-3 p-6 pt-11">
                <img
                  src={MatchPolitico}
                  alt=""
                  className="object-contain h-16"
                />
                <p className="text-white font-black uppercase tracking-wider text-center text-sm">
                  Match Político
                </p>
              </div>

              <div className="h-[165px] w-[290px] flex-1 rounded-[20px] bg-[#009FFD] flex flex-col items-center justify-between gap-3 p-6">
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
          <div className="flex-1 flex flex-col gap-[50px] pr-[65px] items-center justify-center">
            <div className="w-full flex flex-col gap-[15px]">
              <h1 className="font-black uppercase forced-small-caps leading-10 tracking-wider text-[36px] text-[#333]">
                política de um jeito fácil e educativo!
              </h1>
              <h2 className=" tracking-wider text-[14px] text-[#333]">
                No EPOL, você encontra funcionalidades diversas que facilitam a
                compreensão da política no dia a dia.
              </h2>
            </div>

            <div className="flex gap-3 w-full items-center ">
              <BotaoCadastro onClick={() => navigate('/cadastro')}>
                Cadastre-se
              </BotaoCadastro>

              <p className="uppercase font-bold text-[#FFA400] text-[13px] tracking-wider">
                e obtenha acesso à funcionalidades exclusivas!
              </p>
            </div>
          </div>
        </div>
        {/* TERCEIRA PARTE SEÇÃO */}
        <div className="w-full h-full bg-[#FFA400] flex gap-[100px] justify-between overflow-hidden">
          <div className="flex-1 flex flex-col gap-[50px] pl-[65px] items-center justify-center">
            <div className="w-full flex flex-col gap-[15px]">
              <h1 className="font-black uppercase forced-small-caps leading-10 tracking-wider text-[36px] text-[#472E00]">
                entenda sobre como adquirir seu e-título!
              </h1>
              <h2 className=" tracking-wider text-[14px] text-[#472E00]">
                Um guia simples e prático para emitir seu documento digital e
                acessar os principais serviços eleitorais sem complicação.
              </h2>
            </div>

            <div className="flex gap-3 w-full items-center ">
              <BotaoCadastro
                onClick={() => navigate('/cadastro')}
                bgColor="#2A2A72"
                textColor="#eaf6ff"
              >
                Cadastre-se
              </BotaoCadastro>

              <p className="uppercase font-bold text-[#2A2A72] text-[13px] tracking-wider">
                e exerça seu dever de cidadão!
              </p>
            </div>
          </div>
          <div
            className="shrink-0 flex justify-end pr-[65px] items-center overflow-hidden h-full relative"
            style={{ width: 430 + 65 }}
          >
            <div
              className="shrink-0 overflow-hidden w-full h-full"
              // style={{ width: 450 }}
            >
              <WidgetsFlutuantes />
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}

export default Home;
