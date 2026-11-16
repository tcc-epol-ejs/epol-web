import { FiStar } from 'react-icons/fi';

interface Props {
  favorito: boolean;
  salvando?: boolean;
  nome: string;
  onClick: () => void;
}

function BotaoFavorito({ favorito, salvando, nome, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={salvando}
      aria-pressed={favorito}
      aria-label={
        favorito
          ? `Remover ${nome} dos favoritos`
          : `Adicionar ${nome} aos favoritos`
      }
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:opacity-60"
    >
      <FiStar
        size={22}
        strokeWidth={2}
        color={favorito ? '#FFA400' : 'currentColor'}
        fill={favorito ? '#FFA400' : 'none'}
      />
    </button>
  );
}

export default BotaoFavorito;
