import { HiOutlineMail } from 'react-icons/hi';
import { FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full min-h-128 bg-[#2d2d6b] text-white py-24 px-8 md:py-36 md:px-16 lg:px-24 flex flex-col md:flex-row gap-10 md:gap-24 lg:gap-76">
      <div className="flex flex-col gap-3">
        <p className="font-bold text-xl md:text-2xl">EPOL</p>
        <p className="text-gray-300 text-lg md:text-2xl">
          Política que faz sentido pra você.
          <br />
          Informação clara para quem vai mudar o Brasil.
        </p>

        <div className="flex items-center gap-2 mt-6">
          <FaInstagram size={24} />
          <span className="text-lg md:text-2xl">epol.tcc</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <HiOutlineMail size={24} />
          <span className="text-lg md:text-2xl">epol@gmail.com</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xl md:text-2xl mb-3">EXPLORAR</p>
        <button
          onClick={() => navigate('/')}
          className="text-lg md:text-2xl text-gray-300 text-left hover:text-white transition-colors"
        >
          Página Inicial
        </button>
        <button
          onClick={() => navigate('/searchpol')}
          className="text-lg md:text-2xl text-gray-300 text-left hover:text-white transition-colors"
        >
          SearchPol
        </button>
        <button
          onClick={() => navigate('/visualizador')}
          className="text-lg md:text-2xl text-gray-300 text-left hover:text-white transition-colors"
        >
          Visualizador
        </button>
        <button
          onClick={() => navigate('/urna')}
          className="text-lg md:text-2xl text-gray-300 text-left hover:text-white transition-colors"
        >
          Urna
        </button>
        <button
          onClick={() => navigate('/titulo')}
          className="text-lg md:text-2xl whitespace-nowrap text-gray-300 text-left hover:text-white transition-colors"
        >
          Título de Eleitor
        </button>
        <button
          onClick={() => navigate('/quem-somos')}
          className="text-lg md:text-2xl text-gray-300 text-left hover:text-white transition-colors"
        >
          Quem Somos
        </button>
      </div>
    </footer>
  );
}
