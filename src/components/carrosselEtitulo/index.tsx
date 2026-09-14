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
  imageFit?: 'cover' | 'contain'; // NOVO
};

const steps: Step[] = [
  {
    number: 1,
    title: 'Obrigatoriedade',
    textBefore:
      'Voto é obrigatório ou facultativo? O voto é obrigatório para todos os cidadãos brasileiros alfabetizados com idade entre 18 e 70 anos. Para os jovens de 16 e 17 anos, o voto é facultativo, ou seja, você pode escolher se quer ou não votar.',
    textAfter:
      'Sem título, depois dos 18 anos a pessoa não consegue tirar passaporte, se inscrever em concurso público, matricular em faculdade pública, entre outras coisas. Então, se você tem 16 ou 17 anos, aproveite para tirar seu título de eleitor e garantir que sua voz seja ouvida nas próximas eleições!',
    image: '/src/assets/Imagens/pipotitulo.png',
    tagLabel: 'VAMOS LÁ!',
    imageFit: 'contain',
  },
  {
    number: 2,
    title: 'Requisitos',
    textBefore: `1. Você pode tirar seu título de duas formas: indo pessoalmente ao Cartório Eleitoral ou preenchendo o formulário online pelo Título Net: `,
    link: {
      url: 'https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/atendimento-eleitor',
      label: 'Acessar Título Net',
    },
    textAfter: `2. Idade mínima: 15 anos. Só que se você tirar o título com 15, só vai poder votar de verdade quando completar 16 até a próxima eleição.`,
    image: '/src/assets/Imagens/passos.png',
    tagLabel: 'ATENCAO!',
  },
  {
    number: 3,
    title: 'Documentos necessários',
    textBefore:
      '1. Separe um documento oficial com foto: RG, Certidão de Nascimento (se for solteiro/a), Certidão de Casamento, Passaporte ou Carteira de Trabalho.',
    textAfter: `2. Leve também um comprovante de endereço (pode ser digital ou cópia), de preferência no seu nome ou dos seus pais e emitido nos últimos 3 meses.`,
    image: '/src/assets/Imagens/passo3.png',
    tagLabel: 'NAO ESQUEÇA!',
  },
  {
    number: 4,
    title: 'Acesse o site da Justiça Eleitoral',
    textBefore:
      'Com os documentos separados, entre no site oficial da Justiça Eleitoral e procure a opção de alistamento eleitoral (é assim que se chama o processo de tirar o título). ',
    textAfter: '',
    link: {
      url: 'https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/atendimento-eleitor',
      label: 'Acessar Título Net',
    },
    image: '/src/assets/Imagens/site.png',
    tagLabel: 'AGENDE SEU HORÁRIO!',
  },
  {
    number: 5,
    title: 'Preencha seus dados',
    textBefore:
      'Agora é só preencher o formulário com seus dados: nome completo, data de nascimento, endereço e contato. Confira tudo direitinho antes de enviar pois dado errado pode atrasar seu processo!',
    textAfter: '',
    image: '/src/assets/Imagens/passo2.png',
    tagLabel: 'MUITO IMPORTANTE!',
  },
  {
    number: 6,
    title: 'Confirmação e envio',
    textBefore:
      'Revisou tudo? Então é só enviar. Você vai receber uma confirmação por e-mail avisando que seu pedido foi recebido. Depois disso é só aguardar a liberação do seu título.',
    textAfter: '',
    image: '/src/assets/Imagens/passo4.png',
    tagLabel: 'Tire seu título!',
  },
  {
    number: 7,
    title: 'E agora?',
    textBefore:
      'Depois que seu título for aprovado, você vai receber um e-mail de confirmação. A partir daí, você já pode baixar o app e-Título para acompanhar sua situação eleitoral e descobrir seu local de votação antes do dia da eleição.',
    textAfter:
      'Utilize o app e-Título para acessar seu título digital, verificar se está apto a votar, conferir seu local de votação e muito mais. É uma forma prática e segura de manter tudo em dia com a Justiça Eleitoral!',
    image: '/src/assets/Imagens/app.png',
    tagLabel: 'FICA A DICA!',
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
      {/* Animações customizadas das setas */}
      <style>{`
        @keyframes pulseLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }
        @keyframes pulseRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .arrow-left {
          animation: pulseLeft 1.4s ease-in-out infinite;
        }
        .arrow-right {
          animation: pulseRight 1.4s ease-in-out infinite;
        }
        .arrow-left:hover, .arrow-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* mt-[60px] empurra o carrossel inteiro pra baixo */}
      <div className="relative w-full max-w-[1100px] flex items-center gap-[16px]">
        {/* era max-w-[900px] -> agora maior */}

        {/* SETA ESQUERDA */}
        <button
          onClick={goPrev}
          className="arrow-left shrink-0 text-[#2a2a72] rounded-full p-[6px] hover:scale-125 hover:shadow-[0_0_16px_4px_rgba(42,42,114,0.4)] active:scale-95 transition-transform duration-200 ease-out"
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
              <h3 className="text-[26px] font-bold text-[#232528]">
                {step.number}. {step.title}
              </h3>

              <p className="text-[18px] leading-[1.7] text-[#232528] indent-6 text-justify">
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
                <p className="text-[18px] leading-[1.7] text-[#232528] indent-6 text-justify">
                  {step.textAfter}
                </p>
              )}
            </div>

            {/* IMAGEM */}
            <div className="relative w-[340px] shrink-0 bg-[#f2f2f7] flex items-center justify-center p-4">
              <img
                src={step.image}
                alt={step.title}
                className={
                  step.imageFit === 'contain'
                    ? 'max-w-full max-h-full object-contain'
                    : 'w-full h-full object-cover'
                }
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
          className="arrow-right shrink-0 text-[#2a2a72] rounded-full p-[6px] hover:scale-125 hover:shadow-[0_0_16px_4px_rgba(42,42,114,0.4)] active:scale-95 transition-transform duration-200 ease-out"
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
