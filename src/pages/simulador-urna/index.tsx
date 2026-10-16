import { useState } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer/footer';

// ---------- Fundo decorativo ----------

const bolasConfig = [
  { size: 280, top: '-40px', left: '-30px', opacity: 1 },
  { size: 160, top: '20px', left: '220px', opacity: 0.6 },
  { size: 100, top: '160px', left: '30px', opacity: 0.75 },
  { size: 240, top: '-50px', right: '-30px', opacity: 1, bgColor: '#FFA400' },
  { size: 150, top: '60px', right: '220px', opacity: 0.5, bgColor: '#FFA400' },
  { size: 80, top: '10px', right: '180px', opacity: 0.7, bgColor: '#FFA400' },
  { size: 260, bottom: '-50px', left: '-40px', opacity: 1, bgColor: '#FFA400' },
  {
    size: 120,
    bottom: '-20px',
    left: '190px',
    opacity: 0.7,
    bgColor: '#FFA400',
  },
  { size: 300, bottom: '-60px', right: '-40px', opacity: 1 },
  { size: 160, bottom: '120px', right: '200px', opacity: 0.6 },
];

function Bolas() {
  return (
    <>
      {bolasConfig.map((b, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute rounded-full hidden sm:block"
          style={{
            width: `min(${b.size}px, 22vw)`,
            height: `min(${b.size}px, 22vw)`,
            top: 'top' in b ? b.top : undefined,
            bottom: 'bottom' in b ? b.bottom : undefined,
            left: 'left' in b ? b.left : undefined,
            right: 'right' in b ? b.right : undefined,
            backgroundColor: 'bgColor' in b ? b.bgColor : '#8888D3',
            opacity: b.opacity,
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

// ---------- Dados ----------

interface Cenario {
  id: string;
  titulo: string;
  descricao: string;
}

const CENARIOS: Cenario[] = [
  {
    id: 'gerais-1',
    titulo: 'Eleições Gerais - 1º turno',
    descricao: 'Cenário de treinamento para Eleições Gerais.',
  },
  {
    id: 'gerais-2',
    titulo: 'Eleições Gerais - 2º turno',
    descricao: 'Cenário de treinamento para Eleições Gerais.',
  },
];

const ETAPAS = ['Escolha a eleição e o turno', 'Simule a votação'];

// ---------- Stepper ----------

function Stepper({ atual }: { atual: number }) {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-4 overflow-hidden rounded-t-xl">
      {ETAPAS.map((nome, i) => {
        const numero = i + 1;
        const ativa = numero === atual;
        const concluida = numero < atual;

        return (
          <li
            key={nome}
            aria-current={ativa ? 'step' : undefined}
            className={`flex items-center gap-3 px-5 py-4 border-b-4 transition-colors ${
              ativa
                ? 'bg-[#FFA400] border-[#c47f00] text-white'
                : concluida
                  ? 'bg-[#8888D3] border-[#6262AD] text-white'
                  : 'bg-[#e4e4f7] border-[#c9c9ee] text-[#6a6a99]'
            }`}
          >
            <span
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-base font-bold ${
                ativa
                  ? 'bg-white text-[#FFA400] border-white'
                  : concluida
                    ? 'bg-white text-[#6262AD] border-white'
                    : 'border-[#6a6a99] text-[#6a6a99]'
              }`}
            >
              {numero}
            </span>
            <span className="text-sm font-bold leading-tight">{nome}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------- Card de cenário ----------

function CardCenario({
  cenario,
  selecionado,
  onSelecionar,
}: {
  cenario: Cenario;
  selecionado: boolean;
  onSelecionar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelecionar}
      aria-pressed={selecionado}
      className={`flex min-h-[280px] flex-col items-start gap-4 rounded-xl p-8 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFA400] ${
        selecionado
          ? 'bg-[#eef0fb] ring-4 ring-[#2a2a72]'
          : 'bg-white hover:bg-[#f4f4fd]'
      }`}
    >
      <h3 className="text-3xl font-bold text-[#1f2a52]">{cenario.titulo}</h3>
      <p className="text-xl text-[#5A5A70]">{cenario.descricao}</p>

      {selecionado && (
        <span className="mt-auto rounded-full bg-[#2a2a72] px-4 py-1 text-base font-semibold text-white">
          Seleção atual
        </span>
      )}
    </button>
  );
}

// ---------- Etapa 1 ----------

function SimuladorEtapa1({
  cenarioInicial,
  onAvancar,
}: {
  cenarioInicial: Cenario;
  onAvancar: (cenario: Cenario) => void;
}) {
  const [selecionadoId, setSelecionadoId] = useState<string>(cenarioInicial.id);
  const selecionado = CENARIOS.find((c) => c.id === selecionadoId)!;

  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-5xl font-bold text-[#2a2a72]">
          Simulador de votação
        </h1>

        <div className="sm:text-right">
          <p className="text-xs font-semibold text-[#5A5A70]">
            Cenário selecionado
          </p>
          <p className="text-lg font-bold text-[#2a2a72]">
            {selecionado.titulo}
          </p>
        </div>
      </header>

      <div className="mt-6 overflow-hidden rounded-xl bg-[#f4f5f9] shadow-sm">
        <Stepper atual={1} />

        <div className="px-6 py-8 sm:px-12">
          <p className="mb-6 text-base text-[#1f2a52]">
            Defina o tipo de eleição e o turno que deseja simular.
          </p>

          <div className="rounded-lg bg-[#8888D3] p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {CENARIOS.map((cenario) => (
                <CardCenario
                  key={cenario.id}
                  cenario={cenario}
                  selecionado={cenario.id === selecionadoId}
                  onSelecionar={() => setSelecionadoId(cenario.id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => onAvancar?.(selecionado)}
              className="rounded-full bg-[#FFA400] px-8 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a2a72]"
            >
              avançar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
function SimuladorEtapa2({
  cenario,
  onVoltar,
}: {
  cenario: Cenario;
  onVoltar: () => void;
}) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-4xl font-bold text-[#2a2a72]">
          Simulador de votação
        </h1>

        <div className="sm:text-right">
          <p className="text-xs font-semibold text-[#5A5A70]">
            Cenário selecionado
          </p>
          <p className="text-lg font-bold text-[#2a2a72]">{cenario.titulo}</p>
        </div>
      </header>

      <div className="mt-6 overflow-hidden rounded-xl bg-[#f4f5f9] shadow-sm">
        <Stepper atual={2} />

        <div className="px-6 py-8 sm:px-12">
          {/* conteúdo da urna vai aqui */}
          <p className="text-base text-[#1f2a52]">
            Simulando: {cenario.titulo}
          </p>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={onVoltar}
              className="rounded-full bg-[#8888D3] px-8 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              voltar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function SimuladorUrna() {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [cenario, setCenario] = useState<Cenario>(CENARIOS[0]);

  return (
    <div>
      <div className="relative min-h-[100dvh] w-full overflow-hidden bg-white">
        <Bolas />

        {etapa === 1 && (
          <SimuladorEtapa1
            cenarioInicial={cenario}
            onAvancar={(c) => {
              setCenario(c);
              setEtapa(2);
            }}
          />
        )}

        {etapa === 2 && (
          <SimuladorEtapa2 cenario={cenario} onVoltar={() => setEtapa(1)} />
        )}
      </div>

      <Footer />
    </div>
  );
}
