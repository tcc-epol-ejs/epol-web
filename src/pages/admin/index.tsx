import { useNavigate } from 'react-router-dom';
import LogoEPOL from '../../assets/SVGs/LogoEPOL.svg';
// essa página usa um header próprio, então não importe o outro dos componentes!!!

export default function Admin() {
  const navigate = useNavigate();

  return (
    <section className="min-h-[100dvh] bg-[#f8fbff] text-[#1f2332]">
      <div className="fixed top-0 left-0 right-0 z-[1000]">
        <div className="mx-[62px] mt-[42px] flex h-[80px] w-[calc(100%-124px)] items-center justify-between rounded-full border-2 border-[#3f5ca7] bg-white pl-[38px] pr-[11.5px] py-[11.5px]">
          <div className="flex items-center gap-4">
            <img src={LogoEPOL} alt="Logo EPOL" className="w-[90px] mt-1.5" />
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#3f5ca7]">
                Administração
              </p>
              <h1 className="mt-1 text-lg font-bold text-[#1f2332]">
                Cadastro de dados políticos
              </h1>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full border border-[#3f5ca7] bg-white px-4 py-2 text-sm font-semibold text-[#3f5ca7] hover:bg-[#eef2ff]"
            >
              Voltar ao site
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
