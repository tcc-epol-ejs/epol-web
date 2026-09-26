import { useEffect, useState } from 'react';
import { HiOutlineMail } from 'react-icons/hi';
import { FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// 1º turno das Eleições 2026 - 4 de outubro, 8h (horário de Brasília)
const ELECTION_DATE = new Date('2026-10-04T08:00:00-03:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

function useElectionCountdown(target: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 30 * 1000); // atualiza a cada 30s, suficiente pra um contador em minutos

    return () => clearInterval(interval);
  }, [target]);

  return timeLeft;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-[#33355C] rounded-lg px-4 py-2.5 min-w-[64px]">
      <span className="text-xl md:text-2xl font-bold text-[#A5A9F0] tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] tracking-wide text-gray-400 uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const { usuario, carregando } = useAuth();
  const { days, hours, minutes } = useElectionCountdown(ELECTION_DATE);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <footer className="w-full bg-[#232528] text-white py-16 px-8 md:py-20 md:px-16 lg:px-24 flex flex-col gap-12">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-24 justify-between">
        <div className="flex flex-col gap-2.5 max-w-xs">
          <p className="font-bold text-lg">EPOL</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Política que faz sentido pra você.
            <br />
            Informação clara para quem vai mudar o Brasil.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <FaInstagram size={18} />
            <span className="text-sm">epol.tcc</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <HiOutlineMail size={18} />
            <span className="text-sm">epol@gmail.com</span>
          </div>
        </div>

        {usuario && !carregando && (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-1.5">
              Explorar
            </p>
            <button
              onClick={() => navigate('/main')}
              className="text-sm text-gray-300 text-left hover:text-white transition-colors"
            >
              Página Inicial
            </button>
            <button
              onClick={() => navigate('/searchpol')}
              className="text-sm text-gray-300 text-left hover:text-white transition-colors"
            >
              SearchPol
            </button>
            <button
              onClick={() => navigate('/match-politico')}
              className="text-sm text-gray-300 text-left hover:text-white transition-colors"
            >
              Match Político
            </button>
            <button
              onClick={() => navigate('/visualizador-geografico')}
              className="text-sm text-gray-300 text-left hover:text-white transition-colors"
            >
              Visualizador Geográfico
            </button>
            <button
              onClick={() => navigate('/urna')}
              className="text-sm whitespace-nowrap text-gray-300 text-left hover:text-white transition-colors"
            >
              Urna
            </button>
            <button
              onClick={() => navigate('/quem-somos')}
              className="text-sm text-gray-300 text-left hover:text-white transition-colors"
            >
              Quem Somos?
            </button>
          </div>
        )}

        <div className="w-full md:w-[300px] shrink-0 bg-[#2A2A45] border border-[#4F46E5]/40 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#8B8FE8] uppercase">
              Eleições 2026
            </p>
            <p className="text-sm font-medium mt-1">
              Exerça sua cidadania. Garanta seu título!
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <CountdownBox value={days} label="Dias" />
            <CountdownBox value={hours} label="Horas" />
            <CountdownBox value={minutes} label="Minutos" />
          </div>

          {usuario && !carregando && (
            <button
              onClick={() => navigate('/etitulo')}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] transition-colors text-white text-xs font-semibold tracking-wide uppercase rounded-full py-2.5 flex items-center justify-center gap-1.5"
            >
              Tire seu Título de Eleitor
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 pt-5 text-xs text-gray-400 flex flex-wrap gap-x-2">
        <span>© 2026 EPOL</span>
        <span>·</span>
        <span>Trabalho de Conclusão de Curso</span>
        <span>·</span>
        <span>Uso não comercial</span>
      </div>
    </footer>
  );
}
