import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Botao from '../../components/botoes/botao';
import Textbox from '../../components/inputs';
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
  const [statusMessage, setStatusMessage] = useState('');

  const updateField = (field: string, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setStatusMessage('');
  };

  const handleSectionChange = (section: 'partido' | 'politico') => {
    setActiveSection(section);
    setFormData(initialFormState);
    setStatusMessage('');
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
        setStatusMessage('Preencha todos os campos do partido.');
        return;
      }

      /* 
      LÓGICA DE INSERT DOS PARTIDOS
      const query = `
        INSERT INTO dados_politicos.partidos (
          nome_completo, 
          sigla, 
          numero_legenda, 
          presidente_nacional, 
          data_fundacao, 
          ideologia
        ) VALUES (
          $1, $2, $3, $4, $5, $6
        ) RETURNING id;
      `;
      
      const values = [
        formData.nome, 
        formData.sigla, 
        parseInt(formData.numero), 
        formData.presidente, 
        formData.fundacao,
        [formData.ideologia]
      ];
      */

      setStatusMessage('Partido pronto para envio.');
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
        setStatusMessage('Preencha todos os campos do candidato.');
        return;
      }

      /* 
      LÓGICA DE INSERT DOS CANDIDATOS
      const query = `
        INSERT INTO dados_politicos.candidatos (
          nome_completo, 
          nome_politico, 
          numero_urna, 
          candidatura, 
          cargo_atual, 
          uf_candidatura, 
          partido_id,
          feitos_resumo
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        ) RETURNING id;
      `;
      
      const values = [
        formData.nome,
        formData.nome,
        parseInt(formData.numero), 
        formData.cargo,
        formData.cargo, 
        formData.estado,
        "uuid-do-partido-aqui",
        [formData.descricao]
      ];
      */

      setStatusMessage('Candidato pronto para envio.');
    }
  };

  return (
    <section className="relative min-h-[100dvh] bg-[#f8fbff] text-[#1f2332]">
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
                        Adicionar novo item
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
                    <p className="text-sm font-semibold text-[#3f5ca7]">
                      Dados para{' '}
                      {activeSection === 'partido' ? 'partido' : 'candidato'}
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {activeSection === 'partido' ? (
                        <>
                          <Textbox
                            placeholder="Nome"
                            value={formData.nome}
                            onChange={(event) =>
                              updateField('nome', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Sigla"
                            value={formData.sigla}
                            onChange={(event) =>
                              updateField('sigla', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Número"
                            value={formData.numero}
                            onChange={(event) =>
                              updateField('numero', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Presidente"
                            value={formData.presidente}
                            onChange={(event) =>
                              updateField('presidente', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Fundação"
                            value={formData.fundacao}
                            onChange={(event) =>
                              updateField('fundacao', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Ideologia"
                            value={formData.ideologia}
                            onChange={(event) =>
                              updateField('ideologia', event.target.value)
                            }
                          />
                        </>
                      ) : (
                        <>
                          <Textbox
                            placeholder="Nome"
                            value={formData.nome}
                            onChange={(event) =>
                              updateField('nome', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Partido"
                            value={formData.partido}
                            onChange={(event) =>
                              updateField('partido', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Cargo"
                            value={formData.cargo}
                            onChange={(event) =>
                              updateField('cargo', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Gênero"
                            value={formData.genero}
                            onChange={(event) =>
                              updateField('genero', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Estado"
                            value={formData.estado}
                            onChange={(event) =>
                              updateField('estado', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Idade"
                            value={formData.idade}
                            onChange={(event) =>
                              updateField('idade', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Número"
                            value={formData.numero}
                            onChange={(event) =>
                              updateField('numero', event.target.value)
                            }
                          />
                          <Textbox
                            placeholder="Descrição"
                            value={formData.descricao}
                            onChange={(event) =>
                              updateField('descricao', event.target.value)
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
                          setStatusMessage('Campos limpos.');
                        }}
                        className="rounded-full border border-[#3f5ca7] bg-white px-5 py-3 text-sm font-semibold text-[#3f5ca7] transition hover:bg-[#eef2ff]"
                      >
                        Limpar campos
                      </button>
                    </div>
                    {statusMessage && (
                      <div className="mt-4 rounded-[20px] bg-[#fee2e2] px-4 py-3 text-sm text-[#dc2626] border border-[#fca5a5]">
                        {statusMessage}
                      </div>
                    )}
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
