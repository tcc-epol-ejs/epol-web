// components/StepCarousel.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Step = {
  number: number;
  title: string;
  text: string;
  image: string;
  tagLabel?: string;
};

const steps: Step[] = [
  {
    number: 1,
    title: 'Separe seus documentos',
    text: 'Antes de tudo, tenha em mãos RG, CPF e comprovante de residência para dar entrada no processo.',
    image: '/src/assets/Imagens/passo1.png',
    tagLabel: 'Documentos',
  },
  {
    number: 2,
    title: 'Confira os requisitos',
    text: 'Verifique se você tem idade mínima e demais requisitos exigidos para o alistamento eleitoral.',
    image: '/src/assets/Imagens/passo2.png',
    tagLabel: 'Requisitos',
  },
  {
    number: 3,
    title: 'Acesse o site da Justiça Eleitoral',
    text: 'Com os documentos em mãos, o próximo passo é entrar no site oficial da Justiça Eleitoral. Lá, você deve procurar pela opção de alistamento eleitoral ou emissão do título de eleitor.',
    image: '/src/assets/Imagens/passo3.png',
    tagLabel: 'Tire seu título',
  },
  // ... continue os demais passos aqui
];

export default function StepCarousel() {
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => (i === 0 ? steps.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === steps.length - 1 ? 0 : i + 1));

  const step = steps[index];

  return (
    <div className="w-full flex flex-col items-center gap-[24px]">
      <div className="relative w-full max-w-[900px] flex items-center gap-[16px]">
        {/* SETA ESQUERDA */}
        <button
          onClick={goPrev}
          className="shrink-0 text-[#232528] hover:opacity-60 transition"
          aria-label="Anterior"
        >
          <ChevronLeft size={28} />
        </button>

        {/* CARD */}
        <div className="relative flex-1 bg-white rounded-[24px] border-[3px] border-[#232946] overflow-hidden shadow-md">
          <div className="flex items-stretch min-h-[240px]">
            {/* TEXTO */}
            <div className="flex-1 flex flex-col justify-center gap-[16px] px-[40px] py-[32px]">
              <h3 className="text-[20px] font-bold text-[#232528]">
                {step.number}. {step.title}
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#232528] indent-6 text-justify">
                {step.text}
              </p>
            </div>

            {/* IMAGEM */}
            <div className="relative w-[280px] shrink-0 bg-[#f2f2f7]">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover"
              />
              {step.tagLabel && (
                <span className="absolute bottom-4 left-4 bg-[#232946] text-white text-[12px] font-medium px-[14px] py-[6px] rounded-full">
                  {step.tagLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SETA DIREITA */}
        <button
          onClick={goNext}
          className="shrink-0 text-[#232528] hover:opacity-60 transition"
          aria-label="Próximo"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* BOLINHAS */}
      <div className="flex gap-[8px]">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="rounded-full transition-all"
            style={{
              width: i === index ? 10 : 8,
              height: i === index ? 10 : 8,
              backgroundColor: i === index ? '#FFA400' : '#c9c9e0',
            }}
            aria-label={`Ir para passo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
