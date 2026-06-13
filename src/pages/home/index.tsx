import { useState } from 'react';
import BotaoCadastro from '../../components/botoes/botaoCadastro';
import CardCarrossel from '../../components/cardCarrossel';
import Pipo1 from '../../assets/GIFs/pipo1.gif';

function Home() {
  return (
    <>
      <section className="w-full h-[100dvh]">
        <div className="w-full h-full bg-[#2A2A72] flex ">
          <div className="w-full flex flex-col gap-[50px] px-[55px] items-center justify-center">
            <div className="w-full flex flex-col gap-[15px]">
              <h1 className="font-black uppercase forced-small-caps leading-10 tracking-wider text-[35px] text-[#CBCBEC]">
                O portal de política feito pra você!
              </h1>
              <h2 className=" tracking-wider text-[13px] text-[#CBCBEC]">
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
          <div className="w-full flex justify-center items-center">
            <CardCarrossel asset={Pipo1} />
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
