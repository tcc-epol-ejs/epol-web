import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
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

// -----------------------------------------------------------------------------
// ESTADO DO MENU (fora do componente)
// Cada página renderiza o próprio <Header />, então o componente é recriado a
// cada troca de página. Guardando o "aberto" aqui fora, o menu continua aberto
// ao navegar e só fecha quando o usuário pedir (botão X ou Esc).
// -----------------------------------------------------------------------------
let menuAberto = false;
const ouvintes = new Set<() => void>();

function definirMenuAberto(valor: boolean) {
  if (menuAberto === valor) return;
  menuAberto = valor;
  ouvintes.forEach((fn) => fn());
}

function assinar(fn: () => void) {
  ouvintes.add(fn);
  return () => {
    ouvintes.delete(fn);
  };
}

const lerMenuAberto = () => menuAberto;

export default function Header({
  isBgWhite,
  disableScrollHide = true,
  backgroundColor,
  borderColor,
  reservarEspaco = false,
}: HeaderProps) {
  const aberto = useSyncExternalStore(assinar, lerMenuAberto, () => false);
  const [pertoDoTopo, setPertoDoTopo] = useState(true);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const { usuario, carregando } = useAuth();

  useEffect(() => {
    if (disableScrollHide) return;

    function aoRolar() {
      setPertoDoTopo(window.scrollY < 20);
    }

    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, [disableScrollHide]);

  // Só o Esc fecha pelo teclado (clicar fora ou em um link NÃO fecha)
  useEffect(() => {
    if (!aberto) return;

    function aoPressionarTecla(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        definirMenuAberto(false);
        botaoRef.current?.focus();
      }
    }

    document.addEventListener('keydown', aoPressionarTecla);
    return () => document.removeEventListener('keydown', aoPressionarTecla);
  }, [aberto]);

  const tema = isBgWhite
    ? 'bg-[#2A2A72] text-[#FFFBF2]'
    : 'bg-white text-[#333]';

  const foco =
    'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FFA400]';

  // Responsivo (< xl): item de lista vertical, largura total.
  // Desktop (xl+): link horizontal em pílula, igual ao original.
  const itemMenu = `flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors hover:bg-[#FFA400]/15 hover:text-[#FFA400] aria-[current=page]:bg-[#FFA400]/15 aria-[current=page]:text-[#FFA400] xl:min-h-10 xl:w-auto xl:shrink-0 xl:gap-0 xl:whitespace-nowrap xl:rounded-full xl:px-2 xl:text-sm xl:hover:bg-transparent xl:aria-[current=page]:bg-transparent ${foco}`;

  const logado = !carregando && Boolean(usuario);
  const nomeExibido = usuario?.apelido || usuario?.nome || 'Meu perfil';

  // Botão do Pipo acompanha a variável --d (tamanho do header fechado)
  const tamanhoBotao = 'h-[calc(var(--d)-4px)] w-[calc(var(--d)-4px)]';

  return (
    <>
      {reservarEspaco && (
        <div
          aria-hidden="true"
          className="h-[4.5rem] shrink-0 sm:h-20 xl:h-28"
        />
      )}

      {createPortal(
        <header
          hidden={!disableScrollHide && !pertoDoTopo}
          className={`fixed left-3 top-3 z-[1000] flex flex-col overflow-hidden border-2 border-[#FFA400] shadow-xl transition-[width,border-radius] duration-300 ease-out motion-reduce:transition-none [--d:3rem] sm:left-4 sm:top-4 sm:[--d:3.5rem] xl:left-[62px] xl:top-[42px] xl:h-[var(--d)] xl:flex-row xl:items-center xl:[--d:5rem] ${tema} ${
            aberto
              ? 'w-[min(18rem,calc(100vw-1.5rem))] rounded-[26px] xl:w-[calc(100%-124px)] xl:rounded-full'
              : 'w-[var(--d)] rounded-full'
          }`}
          style={{ backgroundColor, borderColor }}
        >
          {/* Botão (Pipo / X) + logo */}
          <div className="flex h-[calc(var(--d)-4px)] shrink-0 items-center">
            <button
              ref={botaoRef}
              type="button"
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              aria-controls={menuId}
              aria-expanded={aberto}
              onClick={() => definirMenuAberto(!aberto)}
              className={`flex shrink-0 items-center justify-center rounded-full hover:bg-[#FFA400]/15 ${tamanhoBotao} ${foco}`}
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

            {aberto && (
              <img
                src={isBgWhite ? LogoEpolBranco : LogoEPOL}
                alt="EPOL"
                className="ml-2 w-[70px] shrink-0 sm:w-[80px] xl:ml-3 xl:w-[90px]"
              />
            )}
          </div>

          {/* Menu: vertical no responsivo, horizontal no desktop */}
          <nav
            id={menuId}
            aria-label="Navegação principal"
            className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none xl:min-w-0 xl:flex-1 ${
              aberto
                ? 'grid-rows-[1fr] xl:flex xl:items-center'
                : 'invisible grid-rows-[0fr] xl:hidden'
            }`}
          >
            <div className="min-h-0 overflow-hidden xl:min-w-0 xl:flex-1 xl:overflow-visible">
              <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto px-2 pb-3 pt-1 xl:flex xl:max-h-none xl:items-center xl:justify-between xl:gap-4 xl:overflow-visible xl:p-0 xl:pl-4 xl:pr-6">
                {carregando ? (
                  <p
                    role="status"
                    className="px-3 py-2 text-xs font-semibold xl:ml-auto xl:p-0"
                  >
                    Carregando sessão...
                  </p>
                ) : usuario ? (
                  <>
                    <div className="flex flex-col gap-1 xl:min-w-0 xl:flex-1 xl:flex-row xl:items-center xl:gap-2 xl:overflow-x-auto xl:overscroll-x-contain xl:[scrollbar-width:thin] 2xl:gap-4">
                      {LINKS_USUARIO.map(({ label, path }) => (
                        <NavLink key={path} to={path} end className={itemMenu}>
                          {label}
                        </NavLink>
                      ))}
                    </div>

                    <div className="my-2 border-t border-current/15 xl:hidden" />

                    <NavLink
                      to="/perfil"
                      end
                      aria-label="Meu perfil"
                      className={`${itemMenu} xl:gap-2`}
                    >
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
                      <span className="ml-2 min-w-0 flex-1 truncate xl:max-w-[8rem] xl:flex-none">
                        {nomeExibido}
                      </span>
                    </NavLink>
                  </>
                ) : (
                  <div className="flex flex-col gap-1 xl:ml-auto xl:flex-row xl:items-center xl:gap-3">
                    {LINKS_VISITANTE.map(({ label, path }) => (
                      <NavLink
                        key={path}
                        to={path}
                        end
                        className={`${itemMenu} ${
                          path === '/cadastro'
                            ? 'justify-center bg-[#FFA400] text-[#333] hover:bg-[#FFA400] hover:text-[#333] hover:brightness-95 aria-[current=page]:bg-[#FFA400] aria-[current=page]:text-[#333] xl:bg-[#FFA400] xl:hover:bg-[#FFA400] xl:aria-[current=page]:bg-[#FFA400]'
                            : 'text-[#FFA400]'
                        }`}
                      >
                        {label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>,
        document.body,
      )}
    </>
  );
}
