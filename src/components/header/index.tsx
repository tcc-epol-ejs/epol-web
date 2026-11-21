import { useEffect, useId, useRef, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import LogoEPOL from '../../assets/SVGs/LogoEPOL.svg';
import LogoEpolBranco from '../../assets/Imagens/Logos/logoepol.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  isBgWhite?: boolean;
  disableScrollHide?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Página Inicial', path: '/main' },
  { label: 'SearchPol', path: '/searchpol' },
  { label: 'Match Político', path: '/match-politico' },
  { label: 'Urna', path: '/simulador-urna' },
  { label: 'Visualizador Geográfico', path: '/visualizador' },
  { label: 'Quem Somos?', path: '/quem-somos' },
];

export default function Header({
  isBgWhite,
  disableScrollHide,
  backgroundColor,
  borderColor,
}: HeaderProps) {
  const [visible, setVisible] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuId = useId();
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, carregando } = useAuth();

  const HEADER_REVEAL_THRESHOLD = 20;

  useEffect(() => {
    if (disableScrollHide) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < HEADER_REVEAL_THRESHOLD);
      if (currentY >= HEADER_REVEAL_THRESHOLD) setMenuAberto(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [disableScrollHide]);

  const nomeExibido = usuario?.apelido || usuario?.nome || '';

  return (
    <header
      className={`
        relative mx-3 mt-4 flex h-14 items-center justify-between gap-2 rounded-full border-2 border-[#FFA400] px-3 shadow-xl
        sm:mx-6 sm:px-4 md:mx-8 md:mt-[26px] md:h-16 xl:mx-[62px] xl:mt-[42px] xl:h-20 xl:pl-[38px] xl:pr-[11.5px]
        ${disableScrollHide ? '' : 'transition-transform duration-[800ms] ease-in-out'}
        ${disableScrollHide || visible ? 'translate-y-0' : '-translate-y-[200px]'} ${isBgWhite ? 'bg-[#2A2A72]' : 'bg-white'}
      `}
      style={{ backgroundColor, borderColor }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuAberto) {
          setMenuAberto(false);
          botaoMenu.current?.focus();
        }
      }}
    >
      <div className="flex min-w-0 items-center gap-2 xl:gap-8 2xl:gap-10">
        {usuario && !carregando && (
          <button
            ref={botaoMenu}
            type="button"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls={menuId}
            onClick={() => setMenuAberto((atual) => !atual)}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full xl:hidden ${isBgWhite ? 'text-[#FFFBF2]' : 'text-[#2A2A72]'}`}
          >
            {menuAberto ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        )}

        {isBgWhite ? (
          <img
            src={LogoEpolBranco}
            alt=""
            className="mt-1 w-[70px] shrink-0 sm:w-[90px]"
          />
        ) : (
          <img
            src={LogoEPOL}
            alt=""
            className="mt-1 w-[70px] shrink-0 sm:w-[90px]"
          />
        )}

        {usuario && !carregando && (
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-4 xl:flex 2xl:gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => navigate(item.path)}
                  className={`
                    border-none outline-none bg-transparent text-[14px] font-semibold whitespace-nowrap
                    transition-colors
                    ${isActive ? 'text-[#FFA400]' : isBgWhite ? 'text-[#FFFBF2]' : 'text-[#333]'} hover:text-[#FFA400]
                  `}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {usuario && !carregando && (
        <nav
          id={menuId}
          aria-label="Navegação principal"
          className={`absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6.5rem)] overflow-y-auto rounded-2xl border-2 border-[#FFA400] p-2 shadow-xl xl:hidden ${menuAberto ? '' : 'hidden'} ${isBgWhite ? 'bg-[#2A2A72] text-[#FFFBF2]' : 'bg-white text-[#333]'}`}
          style={{ backgroundColor, borderColor }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              type="button"
              aria-current={
                location.pathname === item.path ? 'page' : undefined
              }
              onClick={() => {
                setMenuAberto(false);
                navigate(item.path);
              }}
              className="block min-h-11 w-full rounded-xl px-4 py-2 text-left text-sm font-semibold aria-[current=page]:text-[#FFA400] hover:underline"
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}

      {carregando ? (
        <div className="h-11 w-20 xl:w-40" />
      ) : usuario ? (
        <button
          onClick={() => navigate('/perfil')}
          aria-label="Meu perfil"
          className={`flex min-w-0 items-center gap-2 rounded-full p-1 transition-colors xl:px-2 ${isBgWhite ? 'hover:bg-[#383899]' : 'hover:bg-[#FFF6E8]'}`}
        >
          <span
            className={`hidden max-w-48 truncate text-sm font-semibold min-[380px]:block ${isBgWhite ? 'text-[#FFFBF2]' : 'text-[#333]'}`}
          >
            {nomeExibido}
          </span>
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[2px] border-[#FFA400] bg-[#FFA400]">
            {usuario.foto_perfil_url ? (
              <img
                src={usuario.foto_perfil_url}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-[16px]">
                {nomeExibido.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </button>
      ) : (
        <div className="flex shrink-0 gap-2 sm:gap-5">
          <button
            onClick={() => navigate('/login')}
            className="rounded-full px-2 text-xs font-semibold text-[#A05B00] hover:underline sm:text-sm"
            style={isBgWhite ? { color: '#FFA400' } : undefined}
          >
            Entrar
          </button>
          <button
            onClick={() => navigate('/cadastro')}
            className="h-11 whitespace-nowrap rounded-full bg-[#FFA400] px-3 py-1.5 text-center text-xs font-semibold text-[#333] hover:brightness-[.85] sm:px-[22px] sm:text-sm xl:h-[53px]"
          >
            Cadastre-se
          </button>
        </div>
      )}
    </header>
  );
}
