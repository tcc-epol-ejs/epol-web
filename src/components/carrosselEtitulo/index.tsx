// components/StepCarousel.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Step = {
  number: number;
  title: string;
  textBefore: string;
  link?: { url: string; label: string };
  textAfter: string;
  image: string;
  tagLabel?: string;
};

const steps: Step[] = [
  {
    number: 1,
    title: 'Requisitos',
    textBefore: `1. Comparecer ao Cartório Eleitoral, posto de atendimento ou preencher formulário de pré-atendimento Título Net, disponível na página do TRE-SP: `,
    link: {
      url: 'https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/atendimento-eleitor',
      label: 'Acessar Título Net',
    },
    textAfter: `2. Idade mínima de 15 anos. O exercício do voto para as pessoas que se alistarem aos 15 anos somente será garantido à pessoa que completar 16 anos até a data do 1º turno da eleição subsequente.`,
    image: '/src/assets/Imagens/passo1.png',
    tagLabel: 'ATENCAO!',
  },
  {
    number: 2,
    title: 'Documentos necessários',
    textBefore:
      '1. Documento oficial de identificação. Podem ser aceitos: RG, Certidão de Nascimento (se pessoa solteira) ou de Casamento, Passaporte, Carteira de Trabalho.',
    textAfter: `2. Comprovante de domicílio eleitoral - original, digital ou cópia, preferencialmente em nome da pessoa interessada, emitido ou expedido nos 3 meses anteriores à data do atendimento, se possível.`,
    image: '/src/assets/Imagens/passo2.png',
    tagLabel: 'NAO ESQUEÇA!',
  },
  {
    number: 3,
    title: 'Acesse o site da Justiça Eleitoral',
    textBefore:
      'Com os documentos em mãos, o próximo passo é entrar no site oficial da Justiça Eleitoral. Lá, você deve procurar pela opção de alistamento eleitoral ou emissão do título de eleitor. ',
    textAfter: '',
    link: {
      url: 'https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/atendimento-eleitor',
      label: 'Acessar Título Net',
    },
    image: '/src/assets/Imagens/passo3.png',
    tagLabel: 'AGENDE SEU HORÁRIO!',
  },
  {
    number: 4,
    title: 'Preencha seus dados',
    textBefore:
      'Na página de alistamento, você precisará preencher um formulário com seus dados pessoais, como nome completo, data de nascimento, endereço e informações de contato. Certifique-se de fornecer informações precisas e atualizadas.',
    textAfter: '',
    image: '/src/assets/Imagens/passo3.png',
    tagLabel: 'MUITO IMPORTANTE!',
  },
  {
    number: 5,
    title: 'Confirmação e envio',
    textBefore:
      'Após preencher o formulário, revise todas as informações fornecidas para garantir que estão corretas. Em seguida, envie o formulário para processamento. Você receberá uma confirmação de que sua solicitação foi recebida.',
    textAfter: '',
    image: '/src/assets/Imagens/',
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
    <div className="w-full flex flex-col items-center gap-[24px] mt-[60px]">
      {/* mt-[60px] empurra o carrossel inteiro pra baixo */}
      <div className="relative w-full max-w-[1100px] flex items-center gap-[16px]">
        {/* era max-w-[900px] -> agora maior */}

        {/* SETA ESQUERDA */}
        <button
          onClick={goPrev}
          className="shrink-0 text-[#2a2a72] hover:opacity-60 transition"
          aria-label="Anterior"
        >
          <ChevronLeft size={28} />
        </button>

        {/* CARD */}
        <div className="relative flex-1 bg-white rounded-[24px] border-[10px] border-[#2a2a72] overflow-hidden shadow-md">
          <div className="flex items-stretch min-h-[500px]">
            {/* era min-h-[400px] -> agora maior */}

            {/* TEXTO */}
            <div className="flex-1 flex flex-col justify-center gap-[16px] px-[40px] py-[32px]">
              <h3 className="text-[20px] font-bold text-[#232528]">
                {step.number}. {step.title}
              </h3>

              <p className="text-[15px] leading-[1.6] text-[#232528] indent-6 text-justify">
                {step.textBefore}
                {step.link && (
                  <a
                    href={step.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2a2a72] font-semibold underline hover:opacity-70 transition"
                  >
                    {step.link.label}
                  </a>
                )}
              </p>

              {step.textAfter && (
                <p className="text-[15px] leading-[1.6] text-[#232528] indent-6 text-justify">
                  {step.textAfter}
                </p>
              )}
            </div>

            {/* IMAGEM */}
            <div className="relative w-[340px] shrink-0 bg-[#f2f2f7]">
              {/* era w-[280px] -> agora maior */}
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover"
              />
              {step.tagLabel && (
                <span className="absolute bottom-4 left-4 bg-[#2a2a72] text-white text-[12px] font-medium px-[14px] py-[6px] rounded-full">
                  {step.tagLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SETA DIREITA */}
        <button
          onClick={goNext}
          className="shrink-0 text-[#2a2a72] hover:opacity-60 transition"
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
