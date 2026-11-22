import { useId, useState } from 'react';

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
  const detalhesId = useId();
  const [aberto, setAberto] = useState(false);
  const [emPrevia, setEmPrevia] = useState(false);
  const mostrarDetalhes = aberto || emPrevia;

  return (
    <div
      className="relative mx-auto w-full min-w-0 max-w-[22rem] [perspective:1000px] xl:mx-0 xl:w-52"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setEmPrevia(true);
      }}
      onPointerLeave={() => setEmPrevia(false)}
    >
      <button
        type="button"
        aria-label={
          aberto ? `Fechar perfil de ${nome}` : `Ver perfil de ${nome}`
        }
        aria-controls={detalhesId}
        aria-expanded={mostrarDetalhes}
        onClick={() => {
          setEmPrevia(false);
          setAberto((atual) => !atual);
        }}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A2A72]"
      />

      <div
        className={`grid min-h-[16rem] transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none xl:min-h-72 ${mostrarDetalhes ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <div
          aria-hidden="true"
          className="col-start-1 row-start-1 flex flex-col items-center justify-end gap-1 overflow-hidden rounded-2xl border-4 border-[#FFA400] bg-[#d0d0f0] px-2 pb-3 [backface-visibility:hidden]"
        >
          {imagem && (
            <img
              src={imagem}
              alt=""
              className="h-44 w-full object-contain object-bottom xl:h-52"
            />
          )}
          <span className="text-sm font-black tracking-wider text-black">
            {nome}
          </span>
          <span className="text-xs font-semibold text-[#2A2A72]">
            Ver perfil
          </span>
        </div>

        <div
          id={detalhesId}
          aria-hidden={!mostrarDetalhes}
          className="col-start-1 row-start-1 flex flex-col gap-3 rounded-2xl border-4 border-[#FFA400] bg-[#2A2A72] p-3 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-4"
        >
          <div className="flex items-center gap-2">
            {fotoPerfil ? (
              <img
                src={fotoPerfil}
                alt=""
                className="h-12 w-12 shrink-0 rounded-xl border-2 border-[#FFA400] object-cover"
              />
            ) : (
              <div className="h-12 w-12 shrink-0 rounded-xl border-2 border-[#FFA400] bg-[#4A4A9A]" />
            )}
            <div className="flex min-w-0 flex-col">
              <p className="text-[#FFA400] font-black text-sm">{nome}</p>
              <p className="break-words text-[11px] font-semibold uppercase leading-tight text-[#CBCBEC]">
                {cargo}
              </p>
            </div>
          </div>

          <p className="flex flex-1 items-center justify-center text-center text-sm leading-relaxed text-white">
            {descricao}
          </p>
          <span
            aria-hidden="true"
            className="text-center text-xs font-semibold text-[#FFA400]"
          >
            {aberto ? 'Voltar' : 'Clique para manter aberto'}
          </span>
        </div>
      </div>
    </div>
  );
}
