import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';
import LogoEPOL from '../../assets/Imagens/logo-atual-preta.png';
import LogoEpolBranco from '../../assets/Imagens/logo-atual-branca.png';
import Pipo from '../../assets/Imagens/cabeca-pipo.png';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  isBgWhite?: boolean;
  disableScrollHide?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  reservarEspaco?: boolean;
}

const LINKS_USUARIO = [
  { label: 'Página Inicial', path: '/main' },
  { label: 'SearchPol', path: '/searchpol' },
  { label: 'Match Político', path: '/match-politico' },
  { label: 'Urna', path: '/simulador-urna' },
  { label: 'Visualizador Geográfico', path: '/visualizador' },
  { label: 'Quem Somos?', path: '/quem-somos' },
];

const LINKS_VISITANTE = [
  { label: 'Entrar', path: '/login' },
  { label: 'Cadastre-se', path: '/cadastro' },
];

export default function Header({
  isBgWhite,
  disableScrollHide = true,
  backgroundColor,
  borderColor,
  reservarEspaco = false,
}: HeaderProps) {
  const [aberto, setAberto] = useState(false);
  const [pertoDoTopo, setPertoDoTopo] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const { key: rotaAtual } = useLocation();
  const { usuario, carregando } = useAuth();

  useEffect(() => {
    setAberto(false);
  }, [rotaAtual]);

  useEffect(() => {
    if (disableScrollHide) return;

    function aoRolar() {
      const mostrar = window.scrollY < 20;
      setPertoDoTopo(mostrar);
      if (!mostrar) setAberto(false);
    }

    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, [disableScrollHide]);

  useEffect(() => {
    if (!aberto) return;

    function aoClicarFora(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setAberto(false);
      }
    }

    function aoPressionarTecla(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAberto(false);
        botaoRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', aoClicarFora);
    document.addEventListener('keydown', aoPressionarTecla);

    return () => {
      document.removeEventListener('pointerdown', aoClicarFora);
      document.removeEventListener('keydown', aoPressionarTecla);
    };
  }, [aberto]);

  const tema = isBgWhite
    ? 'bg-[#2A2A72] text-[#FFFBF2]'
    : 'bg-white text-[#333]';

  const foco =
    'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FFA400]';

  const link = `flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full px-2 text-xs font-semibold transition-colors hover:text-[#FFA400] aria-[current=page]:text-[#FFA400] sm:text-sm ${foco}`;

  const logado = !carregando && Boolean(usuario);
  const nomeExibido = usuario?.apelido || usuario?.nome || 'Meu perfil';

  return (
    <>
      {reservarEspaco && (
        <div
          aria-hidden="true"
          className={logado ? 'h-24 shrink-0 lg:h-20' : 'h-20 shrink-0'}
        />
      )}

      {createPortal(
        <header
          ref={headerRef}
          hidden={!disableScrollHide && !pertoDoTopo}
          className={`fixed left-4 top-4 z-40 h-[var(--altura-header)] overflow-hidden border-2 border-[#FFA400] shadow-xl transition-[width,border-radius] duration-300 ease-out motion-reduce:transition-none xl:left-[62px] xl:top-[42px] xl:[--altura-header:5rem] ${tema} ${
            logado ? '[--altura-header:6.5rem]' : '[--altura-header:4rem]'
          } ${
            aberto
              ? 'w-[calc(100%-2rem)] rounded-[26px] xl:w-[calc(100%-124px)] xl:rounded-full'
              : 'w-[var(--altura-header)] rounded-full'
          }`}
          style={{ backgroundColor, borderColor }}
        >
          <button
            ref={botaoRef}
            type="button"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            aria-controls={menuId}
            aria-expanded={aberto}
            onClick={() => setAberto((atual) => !atual)}
            className={`absolute z-10 flex items-center justify-center rounded-full ${foco} ${
              aberto
                ? `left-2 h-11 w-11 hover:bg-[#FFA400]/15 sm:left-3 xl:top-1/2 xl:-translate-y-1/2 ${
                    logado ? 'top-0' : 'top-1/2 -translate-y-1/2'
                  }`
                : 'left-0 top-0 h-full w-[calc(var(--altura-header)-4px)] overflow-hidden'
            }`}
          >
            {aberto ? (
              <FiX size={22} aria-hidden="true" />
            ) : (
              <img
                src={Pipo}
                alt=""
                draggable={false}
                className="pointer-events-none block h-[90%] w-[90%] object-contain"
              />
            )}
          </button>
          <nav
            id={menuId}
            aria-label="Navegação principal"
            className={
              aberto
                ? `grid h-full grid-cols-[2.75rem_auto_minmax(0,1fr)] items-center gap-x-1 px-2 sm:gap-x-2 sm:px-3 xl:grid-cols-[2.75rem_auto_minmax(0,1fr)_auto] xl:grid-rows-1 xl:gap-x-4 xl:pr-6 ${
                    logado ? 'grid-rows-[2.75rem_1fr]' : 'grid-rows-1'
                  }`
                : 'hidden'
            }
          >
            <img
              src={isBgWhite ? LogoEpolBranco : LogoEPOL}
              alt="EPOL"
              className="col-start-2 row-start-1 w-[60px] shrink-0 sm:w-[78px] xl:w-[90px]"
            />

            {carregando ? (
              <p
                role="status"
                className="col-start-3 row-start-1 justify-self-end text-xs font-semibold xl:col-start-4"
              >
                Carregando sessão...
              </p>
            ) : usuario ? (
              <>
                <div className="col-span-full row-start-2 flex min-w-0 items-center gap-1 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin] xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:gap-2 xl:pb-0 2xl:gap-4">
                  {LINKS_USUARIO.map(({ label, path }) => (
                    <NavLink
                      key={path}
                      to={path}
                      end
                      className={link}
                      onClick={() => setAberto(false)}
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>

                <NavLink
                  to="/perfil"
                  end
                  aria-label="Meu perfil"
                  className={`col-start-3 row-start-1 min-w-0 justify-self-end gap-2 xl:col-start-4 ${link}`}
                  onClick={() => setAberto(false)}
                >
                  <span className="max-w-[6rem] truncate sm:max-w-[8rem]">
                    {nomeExibido}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#FFA400] bg-[#FFA400] font-bold text-[#2A2A72]">
                    {usuario.foto_perfil_url ? (
                      <img
                        src={usuario.foto_perfil_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span aria-hidden="true">
                        {nomeExibido.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                </NavLink>
              </>
            ) : (
              <div className="col-start-3 row-start-1 flex min-w-0 items-center justify-end gap-1 sm:gap-3 xl:col-start-4">
                {LINKS_VISITANTE.map(({ label, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end
                    className={`${link} ${
                      path === '/cadastro'
                        ? 'bg-[#FFA400] text-[#333] hover:text-[#333] hover:brightness-95'
                        : 'text-[#FFA400]'
                    }`}
                    onClick={() => setAberto(false)}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </nav>
        </header>,
        document.body,
      )}
    </>
  );
}
