import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

// As imagens prontas do mascote ficam em src/assets/Imagens/Mascote/.
// Basta colocar (ou remover) arquivos PNG/JPG/WEBP nessa pasta: eles aparecem
// aqui automaticamente, em ordem alfabética (use 01-, 02-... pra ordenar).
const arquivosMascote = import.meta.glob(
  '../../assets/Imagens/MascotePfp/*.{png,jpg,jpeg,webp}',
  { eager: true, import: 'default' },
) as Record<string, string>;

interface Mascote {
  url: string;
  nome: string;
}

const MASCOTES: Mascote[] = Object.entries(arquivosMascote)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([caminho, url]) => ({
    url,
    nome: caminho.split('/').pop() ?? 'mascote.png',
  }));

interface SeletorPfpModalProps {
  aberto: boolean;
  onFechar: () => void;
  // Recebe sempre um File, venha do mascote ou do upload do usuário.
  // A validação (tipo/tamanho) e o envio ficam por conta de quem usa o modal.
  onEscolher: (arquivo: File) => void;
}

export default function SeletorPfpModal({
  aberto,
  onFechar,
  onEscolher,
}: SeletorPfpModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [carregando, setCarregando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (aberto) setErro(null);
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    function aoApertarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
    }
    window.addEventListener('keydown', aoApertarTecla);
    return () => window.removeEventListener('keydown', aoApertarTecla);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  async function escolherMascote(mascote: Mascote) {
    setErro(null);
    setCarregando(mascote.url);
    try {
      const resposta = await fetch(mascote.url);
      if (!resposta.ok) throw new Error('falha ao baixar a imagem');
      const blob = await resposta.blob();
      const arquivo = new File([blob], mascote.nome, {
        type: blob.type || 'image/png',
      });
      onEscolher(arquivo);
      onFechar();
    } catch {
      setErro('Não foi possível carregar essa imagem. Tente outra.');
    } finally {
      setCarregando(null);
    }
  }

  function aoEscolherArquivo(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = ''; // permite escolher o mesmo arquivo de novo
    if (!arquivo) return;
    onEscolher(arquivo);
    onFechar();
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Escolher foto de perfil"
        className="relative w-full max-w-md rounded-[32px] bg-white p-6 sm:p-7 text-[#2d2d6b] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.45)] max-h-[85vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute top-5 right-5 text-[#8b87a3] hover:text-[#2d2d6b] transition"
        >
          <FiX size={20} />
        </button>

        <h2 className="[font-family:'Montserrat',sans-serif] font-bold text-[19px] mb-1">
          Escolha sua foto
        </h2>
        <p className="text-sm text-[#5b5776] mb-5 leading-relaxed">
          Selecione uma imagem do Pipo ou envie uma foto sua.
        </p>

        {MASCOTES.length === 0 ? (
          <div className="border border-dashed border-[#E4E0F7] rounded-2xl px-4 py-6 text-sm text-[#8b87a3] text-center">
            Ainda não há imagens do mascote disponíveis.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {MASCOTES.map((mascote) => (
              <button
                key={mascote.url}
                type="button"
                onClick={() => escolherMascote(mascote)}
                disabled={carregando !== null}
                aria-label={`Usar ${mascote.nome}`}
                className={`w-20 h-20 rounded-full overflow-hidden bg-[#F7F5FF] border-2 border-[#E4E0F7] hover:border-[#FFA400] transition disabled:cursor-wait ${
                  carregando === mascote.url ? 'opacity-50' : ''
                }`}
              >
                <img
                  src={mascote.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {erro && <p className="mt-4 text-xs text-[#C0392B]">{erro}</p>}

        <div className="mt-6 pt-5 border-t border-[#E4E0F7] flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={carregando !== null}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFA400] text-[#2E2A6B] text-sm font-semibold hover:brightness-105 transition disabled:opacity-60"
          >
            <FiUpload size={14} strokeWidth={2.5} />
            Enviar uma foto minha
          </button>
          <span className="text-[11px] text-[#8b87a3]">
            JPG, PNG ou WEBP, até 2 MB
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={aoEscolherArquivo}
        />
      </div>
    </div>
  );
}
