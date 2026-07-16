import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoEPOL from '../../assets/SVGs/LogoEPOL.svg';

export default function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'partido' | 'politico'>(
    'partido',
  );

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

      <div className="pt-[140px]">
        <div className="mx-[62px] w-[calc(100%-124px)] pb-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-[32px] border border-[#d9e2ff] bg-white p-6 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.2)]">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-[#3f5ca7]">
                      O que quer adicionar?
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">
                      Adicionar novo item
                    </h2>
                  </div>
                  <div className="flex gap-2 rounded-full bg-[#eef2ff] p-1">
                    <button
                      type="button"
                      onClick={() => setActiveSection('partido')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeSection === 'partido' ? 'bg-[#3f5ca7] text-white' : 'text-[#3f5ca7] hover:bg-[#d7e0ff]'}`}
                    >
                      Partido
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('politico')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeSection === 'politico' ? 'bg-[#3f5ca7] text-white' : 'text-[#3f5ca7] hover:bg-[#d7e0ff]'}`}
                    >
                      Político
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] bg-[#f5f8ff] p-6">
                  <p className="text-sm font-semibold text-[#3f5ca7]">
                    Dados para{' '}
                    {activeSection === 'partido' ? 'partido' : 'político'}
                  </p>
                  <p className="mt-4 text-[#4c557a]">
                    Formulário em construção...
                  </p>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[32px] border border-[#d9e2ff] bg-white p-6 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.2)]">
                <p className="text-sm uppercase tracking-[0.28em] text-[#3f5ca7]">
                  Observações
                </p>
                <div className="mt-4 space-y-4 text-sm leading-6 text-[#4c557a]">
                  <div>
                    <p className="font-semibold text-[#1f2332]">
                      Título da observação
                    </p>
                    <p>Colocar observações importantes depois!</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
