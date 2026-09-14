interface CardQuemSomosProps {
  nome: string;
  cargo: string;
  descricao: string;
  imagem?: string;
  fotoPerfil?: string;
}

export default function CardQuemSomos({
  nome,
  cargo,
  descricao,
  imagem,
  fotoPerfil,
}: CardQuemSomosProps) {
  return (
    <div className="w-52 h-72 [perspective:1000px] group">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* FRENTE */}
        <div className="absolute inset-0 rounded-2xl border-4 border-[#FFA400] bg-[#d0d0f0] [backface-visibility:hidden] flex flex-col items-center justify-end overflow-hidden">
          {imagem && (
            <img
              src={imagem}
              alt={nome}
              className="w-full flex-1 object-contain object-bottom"
            />
          )}
          <span className="relative text-black font-black text-sm tracking-wider drop-shadow-lg py-2">
            {nome}
          </span>
        </div>

        {/* VERSO */}
        <div className="absolute inset-0 rounded-2xl border-4 border-[#FFA400] bg-[#2A2A72] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col gap-3 p-4">
          {/* Topo: foto + nome e cargo */}
          <div className="flex items-center gap-3">
            {fotoPerfil ? (
              <img
                src={fotoPerfil}
                alt={nome}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border-2 border-[#FFA400]"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#4A4A9A] flex-shrink-0 border-2 border-[#FFA400]" />
            )}
            <div className="flex flex-col min-w-0">
              <p className="text-[#FFA400] font-black text-sm">{nome}</p>
              <p className="text-[#CBCBEC] text-[9px] font-semibold tracking-wider uppercase leading-tight">
                {cargo}
              </p>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-white text-xm text-center leading-relaxed flex-1 flex items-center justify-center">
            {descricao}
          </p>
        </div>
      </div>
    </div>
  );
}
