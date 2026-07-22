import { useEffect, useRef, useState } from 'react';
import LogoEPOL from '../../assets/SVGs/LogoEPOL.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Página Inicial', path: '/main' },
  { label: 'SearchPol', path: '/searchpol' },
  { label: 'Visualizador', path: '/visualizador' },
  { label: 'Match', path: '/match' },
  { label: 'Título de Eleitor', path: '/titulo-de-eleitor' },
];

export default function Header() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, carregando } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY.current || currentY < 20);
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nomeExibido = usuario?.apelido || usuario?.nome || '';

  return (
    <header
      className={`
        w-[calc(100%-124px)] mx-[62px] mt-[42px] h-[80px] pl-[38px] pr-[11.5px] py-[11.5px]
        bg-white rounded-full shadow-xl flex items-center justify-between border-2 border-[#FFA400]
        transition-transform duration-[800ms] ease-in-out
        ${visible ? 'translate-y-0' : '-translate-y-[200px]'}
      `}
    >
      <div className="flex items-center gap-10">
        <img src={LogoEPOL} alt="" className="w-[90px] mt-1.5 shrink-0" />

        {usuario && !carregando && (
          <nav className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    border-none outline-none bg-transparent text-[14px] font-semibold whitespace-nowrap
                    transition-colors
                    ${isActive ? 'text-[#FFA400]' : 'text-[#333] hover:text-[#FFA400]'}
                  `}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {carregando ? (
        <div className="w-[160px] h-[45px]" />
      ) : usuario ? (
        <button
          onClick={() => navigate('/perfil')}
          className="flex items-center gap-2.5 pr-2 pl-1.5 py-1.5 rounded-full hover:bg-[#FFF6E8] transition-colors border-none outline-none"
        >
          <span className="text-[14px] font-semibold text-[#333]">
            {nomeExibido}
          </span>
          <div className="w-[40px] h-[40px] rounded-full bg-[#FFA400] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[16px]">
              {nomeExibido.charAt(0).toUpperCase()}
            </span>
          </div>
        </button>
      ) : (
        <div className="flex gap-5">
          <button
            onClick={() => navigate('/login')}
            className="border-none outline-none text-[14px] font-semibold text-[#FFA400] hover:underline"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate('/cadastro')}
            className="border-none outline-none font-semibold px-[22px] text-[14px] py-1.5 h-[53px] rounded-full text-center bg-[#FFA400] text-[#333] hover:brightness-[.85]"
          >
            Cadastre-se
          </button>
        </div>
      )}
    </header>
  );
}
