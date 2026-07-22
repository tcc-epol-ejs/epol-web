import { ChangeEvent, useState } from 'react';
import Header from '../../components/header';
import CardCarrossel from '../../components/cardCarrossel';
import VisualizadorGeografico from '../../assets/GIFs/visualizadorGeografico.gif';

export default function Main() {
  return (
    <>
      <section className="w-full h-[100dvh]">
        <div className="w-full fixed top-0 z-[1000]">
          <Header />
        </div>

        {/* PRIMEIRA PARTE SEÇÃO */}
        <div className="w-full h-full flex gap-[100px] justify-between overflow-hidden">
          <div className="flex-1 flex flex-col gap-[50px] pl-[65px] justify-center">
            <div className="w-full flex gap-[65px] mt-10">
              <div className="w-[378px] flex flex-col justify-center items-center gap-1">
                <CardCarrossel
                  width={350}
                  height={350}
                  asset={VisualizadorGeografico}
                />
                <h2 className="font-black uppercase forced-small-caps leading-10 tracking-wider text-[20px] text-[#333]">
                  visualizador geográfico
                </h2>
                <p className="tracking-wider text-center font-medium text-[14px] text-[#333]">
                  textinho flnd um pouco do visualizador geográfico textinho
                  flnd um pouco do visualizador geográfico
                </p>
              </div>
              <div className="w-[378px] flex flex-col justify-center items-center gap-1">
                <CardCarrossel
                  width={350}
                  height={350}
                  asset={VisualizadorGeografico}
                />
                <h2 className="font-black uppercase forced-small-caps leading-10 tracking-wider text-[20px] text-[#333]">
                  match político
                </h2>
                <p className="tracking-wider text-center font-medium text-[14px] text-[#333]">
                  textinho flnd um pouco do visualizador geográfico textinho
                  flnd um pouco do visualizador geográfico
                </p>
              </div>
              <div className="w-[378px] flex flex-col justify-center items-center gap-1">
                <CardCarrossel
                  width={350}
                  height={350}
                  asset={VisualizadorGeografico}
                />
                <h2 className="font-black uppercase forced-small-caps leading-10 tracking-wider text-[20px] text-[#333]">
                  simulador de urna
                </h2>
                <p className="tracking-wider text-center font-medium text-[14px] text-[#333]">
                  textinho flnd um pouco do visualizador geográfico textinho
                  flnd um pouco do visualizador geográfico
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEGUNDA PARTE SEÇÃO */}
        <div className="w-full h-full flex gap-[100px] bg-[#FDECC8] justify-between overflow-hidden">
          <div className="flex-1 flex flex-col gap-[50px] pl-[65px] justify-center relative">
            <div className="flex absolute top-10 items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.18em] text-ink-2 mb-7">
              <span className="w-[26px] h-[2px] bg-black inline-block" />
              SearchPol
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.15fr] gap-10 md:gap-14 items-center">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-9">
                <div className="relative w-[150px] h-[150px] md:w-[220px] md:h-[220px] flex-none">
                  <svg
                    viewBox="0 0 220 220"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full block drop-shadow-soft"
                  >
                    <circle cx="110" cy="110" r="108" fill="#23215C" />
                    <ellipse cx="110" cy="150" rx="46" ry="58" fill="#F2A93B" />
                    <circle cx="112" cy="86" r="34" fill="#E7C79A" />
                    <path
                      d="M78 78 Q80 34 118 34 Q152 36 148 78 Q150 60 130 56 Q120 44 100 54 Q84 58 82 78 Z"
                      fill="#171540"
                    />
                    <path
                      d="M96 108 Q104 122 118 116"
                      stroke="#171540"
                      stroke-width="4"
                      fill="none"
                      stroke-linecap="round"
                    />
                  </svg>
                  <div className="absolute -top-1.5 -right-0.5 w-11 h-11 rounded-full bg-[#2F8F6E] text-[#FFFBF2] flex items-center justify-center font-display font-black text-[22px] border-[3px] border-[#FDECC8] shadow-[0_8px_18px_-6px_rgba(47,143,110,0.6)]">
                    ?
                  </div>
                </div>

                <div>
                  <h1 className="font-display font-black leading-[0.98] tracking-[-0.01em] text-[38px] sm:text-[46px] lg:text-[58px] m-0">
                    <span className="uppercase block">Não</span>
                    <span className="italic font-semibold block text-ink-2">
                      sabe em
                    </span>
                    <span className="uppercase block">quem</span>
                    <span className="uppercase block">votar?</span>
                  </h1>
                  <p className="text-base leading-relaxed text-ink/70 max-w-[34ch] mt-4">
                    Pesquise partidos e políticos e decida com informação — não
                    com achismo.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* <div tabindex="0" role="button"
             className="notch card-a relative rounded-2xl p-5 pb-5 cursor-pointer overflow-hidden isolate
                    transition-transform duration-300 ease-out
                    shadow-[0_10px_0_-2px_rgba(0,0,0,0.06)] hover:shadow-soft
                    bg-gradient-to-br from-lilac to-lilac-deep text-ink-2">
          <span className="block font-mono text-[10px] tracking-[0.08em] opacity-55 mb-3.5">EPOL · 01 / PP</span>
          <svg className="w-9 h-9 mb-3.5 text-ink-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/><path d="M9 9h.01M15 9h.01"/>
          </svg>
          <div className="font-extrabold text-[15px] uppercase leading-tight">Partidos<br>políticos</div>
          <svg className="absolute bottom-4 right-4 w-5.5 h-5.5 opacity-50 transition-all duration-300 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </div>

   
        <div tabindex="0" role="button"
             className="notch card-b relative rounded-2xl p-5 pb-5 cursor-pointer overflow-hidden isolate
                    transition-transform duration-300 ease-out
                    shadow-[0_10px_0_-2px_rgba(0,0,0,0.06)] hover:shadow-soft
                    bg-gradient-to-br from-ink-2 to-ink-3 text-lilac">
          <span className="block font-mono text-[10px] tracking-[0.08em] opacity-55 mb-3.5">EPOL · 02 / PL</span>
          <svg className="w-9 h-9 mb-3.5 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
          </svg>
          <div className="font-extrabold text-[15px] uppercase leading-tight">Políticos</div>
          <svg className="absolute bottom-4 right-4 w-5.5 h-5.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </div> */}
                </div>

                <div className="bg-paper rounded-full border-2 border-ink/10 flex flex-wrap items-center gap-3 pl-5 pr-1.5 py-1.5 shadow-[0_8px_24px_-12px_rgba(27,27,58,0.25)]">
                  <span className="flex-1 text-sm text-ink/50 min-w-[60%]">
                    Aqui no <b className="text-ink font-semibold">EPOL</b>, você
                    descobre.
                  </span>
                  <button className="flex items-center gap-2 bg-teal hover:bg-teal-deep text-paper font-bold text-sm tracking-wide px-5 py-3.5 rounded-full transition-all hover:-translate-y-px focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-ink-2 focus-visible:outline-offset-2 whitespace-nowrap">
                    Pesquisar
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>

                <span className="text-[13px] text-ink/60 pl-5">
                  Mais de <b className="text-ink-2">+2.400 perfis</b>{' '}
                  verificados na base.
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* TERCEIRA PARTE SEÇÃO */}
        <div className="w-full h-full bg-[#FFA400] flex gap-[100px] justify-between overflow-hidden"></div>
      </section>
    </>
  );
}
