import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Select customizado em formato de modal/dropdown (mesmo estilo do DateField),
// pra padronizar todos os campos de escolha entre opções fixas — sem usar o
// <select> nativo do navegador. Serve pra listas simples de string (estados,
// cargos, etc). Suporta uma opção de "limpar seleção" quando o campo é opcional.
// ---------------------------------------------------------------------------

export interface ModalSelectFieldProps {
  opcoes: string[];
  value: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  /** Mostra uma opção no topo da lista pra limpar a seleção (campo opcional) */
  permiteVazio?: boolean;
  rotuloVazio?: string;
  corDestaque?: string;
  corTexto?: string;
  corFundoCampo?: string;
  corBordaCampo?: string;
  corPlaceholder?: string;
  corFundoPainel?: string;
  corBordaPainel?: string;
  corHover?: string;
}

export default function ModalSelectField({
  opcoes,
  value,
  onChange,
  placeholder = '',
  permiteVazio = false,
  rotuloVazio = 'Nenhum selecionado',
  corDestaque = '#FFA400',
  corTexto = '#2a2a72',
  corFundoCampo = '#a9a9f6',
  corBordaCampo = '#a9a9f6',
  corPlaceholder = '#5A5A70',
  corFundoPainel = '#A9A9F6',
  corBordaPainel = '#8888D3',
  corHover = '#6262AD',
}: ModalSelectFieldProps) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function aoClicarFora(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setAberto(false);
      }
    }
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, []);

  function selecionar(opcao: string) {
    onChange(opcao);
    setAberto(false);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="w-full flex items-center justify-between rounded-full border px-4 py-2.5 font-medium text-sm outline-none transition-all duration-300 focus:brightness-[1.05]"
        style={{ backgroundColor: corFundoCampo, borderColor: corBordaCampo }}
      >
        <span style={{ color: value ? corTexto : corPlaceholder }}>
          {value || placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={corTexto}
          strokeWidth={2}
          className="w-4 h-4 flex-shrink-0"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {aberto && (
        <div
          className="absolute z-50 top-full left-0 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border p-2 shadow-xl"
          style={{
            backgroundColor: corFundoPainel,
            borderColor: corBordaPainel,
          }}
        >
          <div className="flex flex-col gap-0.5">
            {permiteVazio && (
              <button
                type="button"
                onClick={() => selecionar('')}
                className="text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={
                  value === ''
                    ? { backgroundColor: corDestaque, color: '#ffffff' }
                    : { color: corTexto }
                }
                onMouseEnter={(e) => {
                  if (value !== '')
                    e.currentTarget.style.backgroundColor = `${corHover}60`;
                }}
                onMouseLeave={(e) => {
                  if (value !== '')
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {rotuloVazio}
              </button>
            )}

            {opcoes.map((opcao) => {
              const selecionado = opcao === value;
              return (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => selecionar(opcao)}
                  className="text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={
                    selecionado
                      ? {
                          backgroundColor: corDestaque,
                          color: '#ffffff',
                          fontWeight: 600,
                        }
                      : { color: corTexto }
                  }
                  onMouseEnter={(e) => {
                    if (!selecionado)
                      e.currentTarget.style.backgroundColor = `${corHover}60`;
                  }}
                  onMouseLeave={(e) => {
                    if (!selecionado)
                      e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {opcao}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
