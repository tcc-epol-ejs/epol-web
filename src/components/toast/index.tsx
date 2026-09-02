import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Toast (canto superior direito, com barra regressiva, pausa no hover e
// animação de entrada/saída deslizando da direita). Compartilhado entre
// páginas — qualquer página chama useToasts() e renderiza <ToastContainer />.
// ---------------------------------------------------------------------------

export type TipoToast = 'erro' | 'sucesso';

export interface ToastItem {
  id: number;
  mensagem: string;
  tipo: TipoToast;
}

const TOAST_DURACAO_MS = 5000;

const CORES_POR_TIPO: Record<
  TipoToast,
  { barra: string; barraFundo: string; borda: string }
> = {
  erro: { barra: '#ef4444', barraFundo: '#fee2e2', borda: '#ffcccc' },
  sucesso: { barra: '#22c55e', barraFundo: '#dcfce7', borda: '#bbf7d0' },
};

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function mostrarToast(mensagem: string, tipo: TipoToast = 'erro') {
    setToasts((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), mensagem, tipo },
    ]);
  }

  function mostrarErro(mensagem: string) {
    mostrarToast(mensagem, 'erro');
  }

  function mostrarSucesso(mensagem: string) {
    mostrarToast(mensagem, 'sucesso');
  }

  function fecharToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, mostrarToast, mostrarErro, mostrarSucesso, fecharToast };
}

function Toast({
  mensagem,
  tipo,
  duracao = TOAST_DURACAO_MS,
  onFechar,
}: {
  mensagem: string;
  tipo: TipoToast;
  duracao?: number;
  onFechar: () => void;
}) {
  const DURACAO_ANIMACAO_MS = 300;
  const cores = CORES_POR_TIPO[tipo];

  const [pausado, setPausado] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const restanteRef = useRef(duracao);
  const inicioRef = useRef(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const saidaTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  function iniciarSaida() {
    setSaindo(true);
    saidaTimeoutRef.current = setTimeout(onFechar, DURACAO_ANIMACAO_MS);
  }

  function iniciarTimer(tempoRestante: number) {
    inicioRef.current = Date.now();
    timeoutRef.current = setTimeout(iniciarSaida, tempoRestante);
  }

  useEffect(() => {
    iniciarTimer(restanteRef.current);
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(saidaTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pausar() {
    if (saindo) return;
    clearTimeout(timeoutRef.current);
    const decorrido = Date.now() - inicioRef.current;
    restanteRef.current = Math.max(restanteRef.current - decorrido, 0);
    setPausado(true);
  }

  function retomar() {
    if (saindo) return;
    setPausado(false);
    iniciarTimer(restanteRef.current);
  }

  return (
    <div
      onMouseEnter={pausar}
      onMouseLeave={retomar}
      style={{
        animationName: saindo ? 'epol-toast-saida' : 'epol-toast-entrada',
        animationDuration: `${DURACAO_ANIMACAO_MS}ms`,
        animationTimingFunction: saindo ? 'ease-in' : 'ease-out',
        animationFillMode: 'forwards',
        borderColor: cores.borda,
      }}
      className="pointer-events-auto w-72 overflow-hidden rounded-xl bg-white shadow-xl border"
    >
      <div className="h-1 w-full" style={{ backgroundColor: cores.barraFundo }}>
        <div
          className="h-full"
          style={{
            backgroundColor: cores.barra,
            animationName: 'epol-toast-shrink',
            animationDuration: `${duracao}ms`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationPlayState: pausado ? 'paused' : 'running',
          }}
        />
      </div>
      <div className="flex items-start gap-2 px-4 py-3">
        <p className="flex-1 text-sm text-[#2a2a72] font-medium leading-snug">
          {mensagem}
        </p>
        <button
          type="button"
          onClick={iniciarSaida}
          aria-label="Fechar aviso"
          className="mt-0.5 text-[#8888D3] hover:text-red-500 transition-colors text-sm leading-none flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onFechar,
}: {
  toasts: ToastItem[];
  onFechar: (id: number) => void;
}) {
  return (
    <>
      <style>{`
        @keyframes epol-toast-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes epol-toast-entrada {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes epol-toast-saida {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            mensagem={toast.mensagem}
            tipo={toast.tipo}
            onFechar={() => onFechar(toast.id)}
          />
        ))}
      </div>
    </>
  );
}
