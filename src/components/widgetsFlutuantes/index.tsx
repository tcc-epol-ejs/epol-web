// components/WidgetsFlutuantes.tsx

export default function WidgetsFlutuantes() {
  return (
    <div className="relative w-full h-full bg-[#FFA400] rounded-[20px] overflow-hidden flex items-center justify-center">
      {/* Label topo */}
      <div className="absolute top-[110px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 border border-[#472E00] rounded-full px-4 py-1.5 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-[#472E00] inline-block" />
        <span className="text-[11px] font-bold tracking-[2px] text-[#472E00] uppercase">
          Eleições 2026
        </span>
      </div>

      {/* Card Partido — atrás esquerda */}
      <div
        className="absolute z-[2] w-[110px] h-[110px] bg-[#1a1a3e] rounded-[20px] shadow-lg flex flex-col items-start justify-end p-[14px] gap-[5px]"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-170%, -45%) rotate(-10deg)',
          animation: 'floatLeft 4.5s ease-in-out infinite',
        }}
      >
        <div className="flex gap-1.5 mb-auto pt-3">
          <div className="w-[22px] h-[22px] rounded-full bg-[#e74c3c]" />
          <div className="w-[22px] h-[22px] rounded-full bg-[#f39c12]" />
          <div className="w-[22px] h-[22px] rounded-full bg-[#3498db]" />
        </div>
        <span className="text-[11px] font-bold text-[#aab0e0] tracking-[1.5px] uppercase">
          Partido
        </span>
      </div>

      {/* Card Título Eleitor — central */}
      <div
        className="absolute z-[4] w-[220px] bg-[#2A2A72] rounded-[20px] shadow-2xl p-[16px]"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(4deg)',
          animation: 'floatCenter 4s ease-in-out infinite',
        }}
      >
        <div className="relative pl-[18px] mb-[10px] ">
          <div className="absolute left-0 top-0 w-[4px] h-full bg-[#FFA400] rounded-[2px]" />
          <p className="m-0 text-[10px] text-[#aab0e0] tracking-[1px] uppercase">
            Título de Eleitor
          </p>
          <h3 className="m-0 text-[13px] font-bold text-white tracking-[0.5px]">
            Rep. Fed. do Brasil
          </h3>
        </div>

        <div className="w-[48px] h-[48px] rounded-full bg-[#4a4a9a] mx-auto my-2 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="#aab0e0" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#aab0e0" />
          </svg>
        </div>

        {[
          { label: 'Nome', value: 'Maria da Silva', color: '#fff' },
          { label: 'Município', value: 'São Paulo — SP', color: '#fff' },
          { label: 'Inscrição', value: '••• ••• •••', color: '#aab0e0' },
        ].map(({ label, value, color }) => (
          <div key={label} className="my-[5px]">
            <p className="m-0 text-[9px] text-[#aab0e0] uppercase tracking-[1px]">
              {label}
            </p>
            <p className="m-0 text-[12px] font-semibold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Card Urna — direita */}
      <div
        className="absolute z-[5] w-[130px] bg-[#38C6F4] rounded-[20px] shadow-2xl p-[14px] flex flex-col items-center gap-2"
        style={{
          left: '50%',
          top: '40%',
          transform: 'translate(30%, -60%) rotate(8deg)',
          animation: 'floatRight 3.8s ease-in-out infinite',
        }}
      >
        <div className="w-[90px] h-[58px] bg-[#2A2A72] rounded-[8px] flex items-center justify-center">
          <div className="w-[60px] h-[36px] bg-[#e8e8e8] rounded-[4px] flex flex-col items-center justify-center gap-1 overflow-hidden">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-[3px]">
                {[0, 1, 2].map((col) => (
                  <div
                    key={col}
                    className="w-[6px] h-[5px] bg-[#555] rounded-[1px]"
                  />
                ))}
              </div>
            ))}
            <div className="flex gap-[3px]">
              <div className="w-[6px] h-[5px] bg-[#27ae60] rounded-[1px]" />
              <div className="w-[6px] h-[5px] bg-[#c0392b] rounded-[1px]" />
              <div className="w-[6px] h-[5px] bg-[#555] rounded-[1px]" />
            </div>
          </div>
        </div>
        <p className="text-[11px] font-extrabold text-[#2A2A72] uppercase tracking-[1px] text-center leading-tight m-0">
          Urna
          <br />
          Eletrônica
        </p>
      </div>

      {/* Badge Vote — baixo */}
      <div
        className="absolute z-[6] w-[170px] bg-white rounded-[16px] shadow-2xl px-[18px] py-[12px]"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-60%, 50%) rotate(4deg)',
          animation: 'floatVote 5s ease-in-out infinite',
        }}
      >
        <p className="m-0 text-[9px] uppercase tracking-[2px] text-[#888]">
          Exerça seu direito
        </p>
        <p className="m-0 text-[32px] font-black text-[#2A2A72] tracking-[1px] leading-none">
          VO·TE
        </p>
        <div className="flex gap-[3px] items-end mt-1">
          {[10, 16, 8, 20, 12, 6, 18].map((h, i) => (
            <div
              key={i}
              className="w-[6px] bg-[#2A2A72] rounded-[2px] opacity-30"
              style={{ height: h }}
            />
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
          @keyframes floatCenter {
            0%, 100% { transform: translate(-50%, -50%) rotate(-6deg) translateY(0px); }
            50%       { transform: translate(-50%, -50%) rotate(-6deg) translateY(-10px); }
          }
          @keyframes floatLeft {
            0%, 100% { transform: translate(-170%, -45%) rotate(-10deg) translateY(0px); }
            50%       { transform: translate(-170%, -45%) rotate(-10deg) translateY(-14px); }
          }
          @keyframes floatRight {
            0%, 100% { transform: translate(30%, -60%) rotate(8deg) translateY(0px); }
            50%       { transform: translate(30%, -60%) rotate(8deg) translateY(-8px); }
          }
          @keyframes floatVote {
            0%, 100% { transform: translate(-60%, 50%) rotate(4deg) translateY(0px); }
            50%       { transform: translate(-60%, 50%) rotate(4deg) translateY(-12px); }
          }
        `}</style>
    </div>
  );
}
