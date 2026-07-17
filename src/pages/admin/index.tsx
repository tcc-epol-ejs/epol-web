import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Botao from '../../components/botoes/botao';
import Textbox from '../../components/inputs';
import Select from '../../components/selects';
import LogoEPOL from '../../assets/SVGs/LogoEPOL.svg';

const bolasConfig = [
  { size: 280, top: '-40px', left: '-30px', opacity: 0.25 },
  { size: 160, top: '20px', left: '220px', opacity: 0.15 },
  { size: 100, top: '160px', left: '30px', opacity: 0.2 },
  { size: 240, top: '-50px', right: '-30px', opacity: 0.25 },
  { size: 150, top: '60px', right: '220px', opacity: 0.15 },
  { size: 80, top: '10px', right: '180px', opacity: 0.2 },
  { size: 260, bottom: '-50px', left: '-40px', opacity: 0.25 },
  { size: 120, bottom: '-20px', left: '190px', opacity: 0.2 },
  { size: 300, bottom: '-60px', right: '-40px', opacity: 0.25 },
  { size: 160, bottom: '120px', right: '200px', opacity: 0.15 },
];

const estadosBrasil = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const generos = ['Masculino', 'Feminino', 'Não binário', 'Outro'];

const cargos = ['Presidente', 'Vice-presidente', 'Governador'];

export default function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'partido' | 'politico'>(
    'partido',
  );

  const initialFormState = {
    nome: '',
    sigla: '',
    numero: '',
    presidente: '',
    fundacao: '',
    ideologia: '',
    partido: '',
    cargo: '',
    genero: '',
    estado: '',
    idade: '',
    descricao: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ text: '', isError: false });

  const updateField = (field: string, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setStatus({ text: '', isError: false });
  };

  const handleNumeroChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // permite só dígitos, com no máximo 2 caracteres
    if (value !== '' && (!/^\d+$/.test(value) || value.length > 2)) {
      return;
    }

    updateField('numero', value);
  };

  const handleSectionChange = (section: 'partido' | 'politico') => {
    setActiveSection(section);
    setFormData(initialFormState);
    setStatus({ text: '', isError: false });
  };

  const handleAdd = () => {
    if (activeSection === 'partido') {
      const camposObrigatorios = [
        'nome',
        'sigla',
        'numero',
        'presidente',
        'fundacao',
        'ideologia',
      ];
      const algumVazio = camposObrigatorios.some(
        (campo) => !formData[campo as keyof typeof formData].trim(),
      );

      if (algumVazio) {
        setStatus({
          text: 'Preencha todos os campos do partido.',
          isError: true,
        });
        return;
      }

      const numero = Number(formData.numero);
      if (numero < 10 || numero > 90) {
        setStatus({
          text: 'O número deve estar entre 10 e 90.',
          isError: true,
        });
        return;
      }

      setStatus({ text: 'Partido adicionado com sucesso!', isError: false });
    } else {
      const camposObrigatorios = [
        'nome',
        'partido',
        'cargo',
        'genero',
        'estado',
        'idade',
        'numero',
        'descricao',
      ];
      const algumVazio = camposObrigatorios.some(
        (campo) => !formData[campo as keyof typeof formData].trim(),
      );

      if (algumVazio) {
        setStatus({
          text: 'Preencha todos os campos do candidato.',
          isError: true,
        });
        return;
      }

      const numero = Number(formData.numero);
      if (numero < 10 || numero > 90) {
        setStatus({
          text: 'O número deve estar entre 10 e 90.',
          isError: true,
        });
        return;
      }

      setStatus({ text: 'Candidato adicionado com sucesso!', isError: false });
    }
  };

  return (
    <section className="relative min-h-[100dvh] bg-[#f8fbff] text-[#1f2332]">
      {}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {bolasConfig.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              top: 'top' in b ? b.top : undefined,
              bottom: 'bottom' in b ? b.bottom : undefined,
              left: 'left' in b ? b.left : undefined,
              right: 'right' in b ? b.right : undefined,
              backgroundColor: '#3f5ca7',
              opacity: b.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {}
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
                className="rounded-full border border-[#3f5ca7] bg-white px-4 py-4 text-sm font-semibold text-[#3f5ca7] hover:bg-[#eef2ff]"
              >
                Voltar ao site principal
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
                        {activeSection === 'partido'
                          ? 'Novo partido'
                          : 'Novo candidato'}
                      </h2>
                    </div>
                    <div className="flex gap-2 rounded-full bg-[#eef2ff] p-1">
                      <button
                        type="button"
                        onClick={() => handleSectionChange('partido')}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeSection === 'partido' ? 'bg-[#3f5ca7] text-white' : 'text-[#3f5ca7] hover:bg-[#d7e0ff]'}`}
                      >
                        Partido
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSectionChange('politico')}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeSection === 'politico' ? 'bg-[#3f5ca7] text-white' : 'text-[#3f5ca7] hover:bg-[#d7e0ff]'}`}
                      >
                        Candidato
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-[#f5f8ff] p-6">
                    <div className="mt-2 grid gap-4 sm:grid-cols-2">
                      {}
                      {activeSection === 'partido' ? (
                        <>
                          <Textbox
                            placeholder="Nome"
                            value={formData.nome}
                            onChange={(e) =>
                              updateField('nome', e.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Sigla"
                            value={formData.sigla}
                            onChange={(e) =>
                              updateField('sigla', e.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Número"
                            value={formData.numero}
                            type="number"
                            onChange={handleNumeroChange}
                          />
                          <Textbox
                            placeholder="Presidente"
                            value={formData.presidente}
                            onChange={(e) =>
                              updateField('presidente', e.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Fundação"
                            value={formData.fundacao}
                            type="date"
                            onChange={(e) =>
                              updateField('fundacao', e.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Ideologia"
                            value={formData.ideologia}
                            onChange={(e) =>
                              updateField('ideologia', e.target.value)
                            }
                          />
                        </>
                      ) : (
                        <>
                          <Textbox
                            placeholder="Nome"
                            value={formData.nome}
                            onChange={(e) =>
                              updateField('nome', e.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Partido"
                            value={formData.partido}
                            onChange={(e) =>
                              updateField('partido', e.target.value)
                            }
                          />
                          <Select
                            placeholder="Cargo"
                            options={cargos}
                            value={formData.cargo}
                            onChange={(e) =>
                              updateField('cargo', e.target.value)
                            }
                          />
                          <Select
                            placeholder="Gênero"
                            options={generos}
                            value={formData.genero}
                            onChange={(e) =>
                              updateField('genero', e.target.value)
                            }
                          />
                          <Select
                            placeholder="Estado"
                            options={estadosBrasil}
                            value={formData.estado}
                            onChange={(e) =>
                              updateField('estado', e.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Idade"
                            value={formData.idade}
                            type="number"
                            onChange={(e) =>
                              updateField('idade', e.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Número"
                            value={formData.numero}
                            type="number"
                            onChange={handleNumeroChange}
                          />
                          <Textbox
                            placeholder="Descrição"
                            value={formData.descricao}
                            onChange={(e) =>
                              updateField('descricao', e.target.value)
                            }
                            className="sm:col-span-2"
                          />
                        </>
                      )}
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Botao onClick={handleAdd}>
                        {activeSection === 'partido'
                          ? 'Adicionar partido'
                          : 'Adicionar candidato'}
                      </Botao>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(initialFormState);
                          setStatus({ text: 'Campos limpos.', isError: false });
                        }}
                        className="rounded-full border border-[#3f5ca7] bg-white px-5 py-4 text-sm font-semibold text-[#3f5ca7] transition hover:bg-[#eef2ff] text-nowrap"
                      >
                        Limpar campos
                      </button>
                    </div>

                    {}
                    {status.text && (
                      <div
                        className={`mt-4 rounded-[20px] px-4 py-3 text-sm border ${
                          status.isError
                            ? 'bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]'
                            : 'bg-[#eef2ff] text-[#3f5ca7] border-[#d7e0ff]'
                        }`}
                      >
                        {status.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {}
              <aside className="space-y-6">
                <div className="rounded-[32px] border border-[#d9e2ff] bg-white p-6 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.2)]">
                  <p className="text-sm uppercase tracking-[0.28em] text-[#3f5ca7]">
                    Observações
                  </p>
                  <div className="mt-4 space-y-4 text-sm leading-6 text-[#4c557a]">
                    <div>
                      <p className="font-semibold text-[#1f2332]">Titulo</p>
                      <p>Adicionar observações no futuro!</p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
