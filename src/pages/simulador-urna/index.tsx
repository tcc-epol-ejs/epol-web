import { useState } from 'react';
import type { ReactNode } from 'react';
import Footer from '../../components/footer/footer';
import Header from '../../components/header';
import pipo_fechado from '../../assets/Imagens/pipo_fechado.png';
import pipoFeliz from '../../assets/Imagens/pipoFeliz.png';

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

// ---------- Cargos ----------

type CargoId =
  | 'deputado-federal'
  | 'deputado-estadual'
  | 'senador'
  | 'governador'
  | 'presidente';

interface Cargo {
  id: CargoId;
  nome: string;
  digitos: number;
}

const CARGOS: Record<CargoId, Cargo> = {
  'deputado-federal': {
    id: 'deputado-federal',
    nome: 'Deputado Federal',
    digitos: 4,
  },
  'deputado-estadual': {
    id: 'deputado-estadual',
    nome: 'Deputado Estadual',
    digitos: 5,
  },
  senador: { id: 'senador', nome: 'Senador', digitos: 3 },
  governador: { id: 'governador', nome: 'Governador', digitos: 2 },
  presidente: { id: 'presidente', nome: 'Presidente', digitos: 2 },
};

// ---------- Cenários ----------
// A ordem de "cargos" é a ordem em que a urna vai pedindo os votos.

interface Cenario {
  id: string;
  titulo: string;
  descricao: string;
  cargos: CargoId[];
}

const CENARIOS: Cenario[] = [
  {
    id: 'gerais-1',
    titulo: 'Eleições Gerais - 1º turno',
    descricao: 'Deputados, Senador, Governador e Presidente.',
    cargos: [
      'deputado-federal',
      'deputado-estadual',
      'senador',
      'governador',
      'presidente',
    ],
  },
  {
    id: 'gerais-2',
    titulo: 'Eleições Gerais - 2º turno',
    descricao: 'Governador e Presidente.',
    cargos: ['governador', 'presidente'],
  },
];

const ETAPAS = [
  'Escolha a eleição e o turno',
  'Faça sua colinha!',
  'Simule a votação',
];

// ---------- Candidatos ----------
// Fictícios (pipos). O número precisa ter a quantidade de dígitos do cargo.

interface CandidatoUrna {
  cargo: CargoId;
  numero: string;
  nome: string;
  partido: string;
  foto: string;
}

const CANDIDATOS_EXEMPLO: CandidatoUrna[] = [
  // Deputado Federal (4 dígitos)
  {
    cargo: 'deputado-federal',
    numero: '1111',
    nome: 'Dep. Federal Exemplo A',
    partido: 'AAA',
    foto: pipoFeliz,
  },
  {
    cargo: 'deputado-federal',
    numero: '2222',
    nome: 'Dep. Federal Exemplo B',
    partido: 'BBB',
    foto: pipo_fechado,
  },
  // Deputado Estadual (5 dígitos)
  {
    cargo: 'deputado-estadual',
    numero: '11111',
    nome: 'Dep. Estadual Exemplo A',
    partido: 'AAA',
    foto: pipoFeliz,
  },
  {
    cargo: 'deputado-estadual',
    numero: '22222',
    nome: 'Dep. Estadual Exemplo B',
    partido: 'BBB',
    foto: pipo_fechado,
  },
  // Senador (3 dígitos)
  {
    cargo: 'senador',
    numero: '111',
    nome: 'Senador Exemplo A',
    partido: 'AAA',
    foto: pipoFeliz,
  },
  {
    cargo: 'senador',
    numero: '222',
    nome: 'Senadora Exemplo B',
    partido: 'BBB',
    foto: pipo_fechado,
  },
  // Governador (2 dígitos)
  {
    cargo: 'governador',
    numero: '33',
    nome: 'Governador Exemplo A',
    partido: 'AAA',
    foto: pipoFeliz,
  },
  {
    cargo: 'governador',
    numero: '44',
    nome: 'Governadora Exemplo B',
    partido: 'BBB',
    foto: pipo_fechado,
  },
  // Presidente (2 dígitos)
  {
    cargo: 'presidente',
    numero: '11',
    nome: 'Candidato Exemplo A',
    partido: 'AAA',
    foto: pipoFeliz,
  },
  {
    cargo: 'presidente',
    numero: '22',
    nome: 'Candidata Exemplo B',
    partido: 'BBB',
    foto: pipo_fechado,
  },
];

// ---------- Stepper ----------

function Stepper({ atual }: { atual: number }) {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-t-xl">
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

// ---------- Cabeçalho ----------

function Cabecalho({ cenario }: { cenario: Cenario }) {
  return (
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
      <Cabecalho cenario={selecionado} />

      <div className="mt-6 overflow-hidden rounded-xl bg-[#f4f5f9] shadow-sm">
        <Stepper atual={1} />

        <div className="px-6 py-8 sm:px-12">
          <p className="mb-5 text-base text-[#1f2a52]">
            Defina o tipo de eleição e o turno que deseja simular.
          </p>

          <div className="rounded-xl bg-[#8888D3] p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              onClick={() => onAvancar(selecionado)}
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

// ---------- Etapa 2 (candidatos / colinha) ----------

function SimuladorEtapa2({
  cenario,
  onVoltar,
  onAvancar,
}: {
  cenario: Cenario;
  onVoltar: () => void;
  onAvancar: () => void;
}) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8">
      <Cabecalho cenario={cenario} />

      <div className="mt-6 overflow-hidden rounded-xl bg-[#f4f5f9] shadow-sm">
        <Stepper atual={2} />

        <div className="px-6 py-8 sm:px-12">
          <p className="mb-5 text-base text-[#1f2a52]">
            Conheça os candidatos e anote os números para a hora de votar.
          </p>

          <div className="flex flex-col gap-6">
            {cenario.cargos.map((cargoId) => {
              const cargo = CARGOS[cargoId];
              const candidatos = CANDIDATOS_EXEMPLO.filter(
                (c) => c.cargo === cargoId,
              );

              return (
                <div key={cargoId} className="rounded-xl bg-[#8888D3] p-6">
                  <h2 className="mb-4 text-xl font-bold text-white">
                    {cargo.nome}{' '}
                    <span className="text-sm font-semibold opacity-80">
                      ({cargo.digitos} dígitos)
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {candidatos.map((c) => (
                      <article
                        key={c.numero}
                        className="flex items-center gap-4 rounded-xl bg-white p-5"
                      >
                        <img
                          src={c.foto}
                          alt={`Foto de ${c.nome}`}
                          className="h-28 w-24 flex-shrink-0 rounded-md border border-[#c9c9ee] object-cover"
                        />

                        <div className="min-w-0">
                          <p className="text-4xl font-bold text-[#2a2a72]">
                            {c.numero}
                          </p>
                          <h3 className="text-lg font-bold text-[#1f2a52]">
                            {c.nome}
                          </h3>
                          <p className="text-sm text-[#5A5A70]">
                            Partido: {c.partido}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={onVoltar}
              className="rounded-full bg-[#8888D3] px-8 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a2a72]"
            >
              voltar
            </button>

            <button
              type="button"
              onClick={onAvancar}
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

// ---------- Tecla da urna ----------

function Tecla({
  children,
  onClick,
  className = '',
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex items-center justify-center rounded-md font-bold shadow-md transition active:translate-y-0.5 active:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFA400] ${className}`}
    >
      {children}
    </button>
  );
}

// ---------- Etapa 3 (urna: visor + teclado) ----------

type Fase = 'digitando' | 'branco' | 'fim';

function SimuladorEtapa3({
  cenario,
  onVoltar,
}: {
  cenario: Cenario;
  onVoltar: () => void;
}) {
  const [cargoIndex, setCargoIndex] = useState(0);
  const [numero, setNumero] = useState('');
  const [fase, setFase] = useState<Fase>('digitando');

  const totalCargos = cenario.cargos.length;
  const cargo = CARGOS[cenario.cargos[cargoIndex]];
  const digitos = cargo.digitos;

  const completo = numero.length === digitos;
  const candidato = completo
    ? CANDIDATOS_EXEMPLO.find(
        (c) => c.cargo === cargo.id && c.numero === numero,
      )
    : undefined;

  function limparVoto() {
    setNumero('');
    setFase('digitando');
  }

  function recomecarTudo() {
    setCargoIndex(0);
    limparVoto();
  }

  function digitar(d: string) {
    if (fase === 'fim') return recomecarTudo();
    if (fase !== 'digitando' || completo) return;
    setNumero((n) => n + d);
  }

  function branco() {
    if (fase === 'fim') return recomecarTudo();
    if (fase === 'digitando' && numero === '') setFase('branco');
  }

  function corrige() {
    if (fase === 'fim') return recomecarTudo();
    limparVoto();
  }

  function confirma() {
    if (fase === 'fim') return recomecarTudo();
    if (fase !== 'branco' && !completo) return;

    // TODO: registrar o voto deste cargo (branco, nulo ou candidato)

    if (cargoIndex < totalCargos - 1) {
      setCargoIndex((i) => i + 1);
      limparVoto();
    } else {
      setFase('fim');
    }
  }

  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8">
      <Cabecalho cenario={cenario} />

      <div className="mt-6 overflow-hidden rounded-xl bg-[#f4f5f9] shadow-sm">
        <Stepper atual={3} />

        <div className="px-6 py-8 sm:px-12">
          <div className="mx-auto w-full max-w-[520px] rounded-2xl bg-[#ecece4] p-4 shadow-lg ring-1 ring-black/10">
            {/* Visor */}
            <div className="rounded-sm bg-black p-3">
              <div
                className="flex min-h-[260px] flex-col bg-white p-4 text-black"
                aria-live="polite"
              >
                {fase === 'fim' && (
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <p className="text-8xl font-bold tracking-widest">FIM</p>
                    <p className="mt-2 text-2xl">VOTOU</p>
                    <p className="mt-6 text-xs text-gray-500">
                      Aperte qualquer tecla para votar de novo
                    </p>
                  </div>
                )}

                {fase === 'branco' && (
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm">SEU VOTO PARA</p>
                    <p className="text-xl font-bold uppercase">{cargo.nome}</p>
                    <p className="flex flex-1 items-center justify-center text-3xl font-bold">
                      VOTO EM BRANCO
                    </p>
                  </div>
                )}

                {fase === 'digitando' && (
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm">SEU VOTO PARA</p>
                        <p className="text-xl font-bold uppercase">
                          {cargo.nome}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {cargoIndex + 1}/{totalCargos}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="mr-2 text-sm">Número:</span>
                      {Array.from({ length: digitos }).map((_, i) => (
                        <span
                          key={i}
                          className="flex h-12 w-10 items-center justify-center border-2 border-black text-3xl font-bold"
                        >
                          {numero[i] ?? ''}
                        </span>
                      ))}
                    </div>

                    {completo && candidato && (
                      <div className="mt-4 flex items-start gap-4 text-sm leading-6">
                        <div className="flex-1">
                          <p>
                            Nome: <strong>{candidato.nome}</strong>
                          </p>
                          <p>
                            Partido: <strong>{candidato.partido}</strong>
                          </p>
                        </div>

                        <img
                          src={candidato.foto}
                          alt={`Foto de ${candidato.nome}`}
                          className="h-24 w-20 flex-shrink-0 border border-black object-cover"
                        />
                      </div>
                    )}

                    {completo && !candidato && (
                      <div className="mt-4 text-sm leading-6">
                        <p className="font-bold">NÚMERO ERRADO</p>
                        <p className="font-bold">VOTO NULO</p>
                      </div>
                    )}
                  </div>
                )}

                {fase !== 'fim' && (
                  <div className="mt-3 border-t border-black pt-2 text-[11px] leading-4">
                    <p>Aperte a tecla:</p>
                    <p>VERDE para CONFIRMAR este voto</p>
                    <p>LARANJA para REINICIAR este voto</p>
                  </div>
                )}
              </div>
            </div>

            {/* Teclado */}
            <div className="mx-auto mt-5 grid w-full max-w-[340px] grid-cols-4 gap-2">
              {['1', '2', '3'].map((d) => (
                <Tecla
                  key={d}
                  label={`Tecla ${d}`}
                  onClick={() => digitar(d)}
                  className="h-12 bg-[#3d4a55] text-xl text-white"
                >
                  {d}
                </Tecla>
              ))}
              <Tecla
                label="Branco"
                onClick={branco}
                className="h-12 border border-gray-300 bg-white text-xs text-black"
              >
                BRANCO
              </Tecla>

              {['4', '5', '6'].map((d) => (
                <Tecla
                  key={d}
                  label={`Tecla ${d}`}
                  onClick={() => digitar(d)}
                  className="h-12 bg-[#3d4a55] text-xl text-white"
                >
                  {d}
                </Tecla>
              ))}
              <Tecla
                label="Corrige"
                onClick={corrige}
                className="h-12 bg-[#ff5a00] text-xs text-black"
              >
                CORRIGE
              </Tecla>

              {['7', '8', '9'].map((d) => (
                <Tecla
                  key={d}
                  label={`Tecla ${d}`}
                  onClick={() => digitar(d)}
                  className="h-12 bg-[#3d4a55] text-xl text-white"
                >
                  {d}
                </Tecla>
              ))}
              <Tecla
                label="Confirma"
                onClick={confirma}
                className="row-span-2 bg-[#4caf50] text-sm text-black"
              >
                CONFIRMA
              </Tecla>

              <span />
              <Tecla
                label="Tecla 0"
                onClick={() => digitar('0')}
                className="h-12 bg-[#3d4a55] text-xl text-white"
              >
                0
              </Tecla>
              <span />
            </div>
          </div>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={onVoltar}
              className="rounded-full bg-[#8888D3] px-8 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a2a72]"
            >
              voltar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Página ----------

export default function SimuladorUrna() {
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [cenario, setCenario] = useState<Cenario>(CENARIOS[0]);

  return (
    <div>
      <div className="relative min-h-[100dvh] w-full overflow-hidden bg-white">
        <Bolas />
        <Header />

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
          <SimuladorEtapa2
            cenario={cenario}
            onVoltar={() => setEtapa(1)}
            onAvancar={() => setEtapa(3)}
          />
        )}

        {etapa === 3 && (
          <SimuladorEtapa3 cenario={cenario} onVoltar={() => setEtapa(2)} />
        )}
      </div>

      <Footer />
    </div>
  );
}
