import { useEffect, useRef, useState } from 'react';
import LogoEPOL from '../../assets/SVGs/LogoEPOL.svg';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY.current || currentY < 20);
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        w-[calc(100%-124px)] mx-[62px] mt-[42px] h-[80px] pl-[38px] pr-[11.5px] py-[11.5px]
        bg-white rounded-full shadow-xl flex items-center justify-between border-2 border-[#FFA400]
        transition-transform duration-[800ms] ease-in-out
        ${visible ? 'translate-y-0' : '-translate-y-[200px]'}
      `}
    >
      <div>
        <img src={LogoEPOL} alt="" className="w-[90px] mt-1.5" />
      </div>

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
    </header>
  );
}
