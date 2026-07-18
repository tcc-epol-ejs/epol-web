import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Botao from '../../components/botoes/botao';
import Textbox from '../../components/inputs';
import Select from '../../components/selects';
import LogoEPOL from '../../assets/SVGs/LogoEPOL.svg';
import Textarea from '../../components/inputs/textarea';

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

const cargos = ['Presidente', 'Vice-presidente', 'Governador'];
const cargos_atuais = [
  'Presidente',
  'Vice-presidente',
  'Governador',
  'Vice-Governador',
  'Senador',
  'Deputado Federal',
  'Deputado Estadual',
  'Prefeito',
  'Vice-prefeito',
  'Vereador',
];

const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export default function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'partido' | 'politico'>(
    'partido',
  );

  const initialFormState = {
    nome: '',
    sigla: '',
    numero: '',
    fundacao: '',
    presidente: '',
    ideologia: '',
    cargo: '',
    nome_politico: '',
    data_nascimento: '',
    naturalidade: '',
    uf_naturalidade: '',
    cargo_atual: '',
    feitos: '',
    foto: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ text: '', isError: false });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setStatus({ text: '', isError: false });
  };

  const handleNumeroChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

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
        'fundacao',
        'presidente',
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
    } else {
      const camposObrigatorios = [
        'nome',
        'numero',
        'cargo',
        'nome_politico',
        'data_nascimento',
        'naturalidade',
        'uf_naturalidade',
        'cargo_atual',
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

      const dataNascimento = new Date(formData.data_nascimento);
      const hoje = new Date();

      let idade = hoje.getFullYear() - dataNascimento.getFullYear();
      const mesAtual = hoje.getMonth();
      const diaAtual = hoje.getDate();
      const mesNasc = dataNascimento.getMonth();
      const diaNasc = dataNascimento.getDate();

      if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
        idade--;
      }

      if (idade < 30) {
        setStatus({
          text: 'A idade mínima é de 30 anos.',
          isError: true,
        });
        return;
      }

      if (idade > 99) {
        setStatus({
          text: 'A idade máxima é de 99 anos.',
          isError: true,
        });
        return;
      }
    }

    if (formData.foto && !isValidUrl(formData.foto)) {
      setStatus({
        text: 'A URL da foto é inválida. Certifique-se de começar com http:// ou https://',
        isError: true,
      });
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmAdd = () => {
    const mensagem =
      activeSection === 'partido'
        ? 'Partido adicionado com sucesso!'
        : 'Candidato adicionado com sucesso!';

    setStatus({ text: mensagem, isError: false });
    setIsModalOpen(false);
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
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Nome Completo
                            </label>
                            <Textbox
                              value={formData.nome}
                              onChange={(e) =>
                                updateField('nome', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Sigla
                            </label>
                            <Textbox
                              value={formData.sigla}
                              onChange={(e) =>
                                updateField('sigla', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Número
                            </label>
                            <Textbox
                              value={formData.numero}
                              type="number"
                              onChange={handleNumeroChange}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Data de Fundação
                            </label>
                            <Textbox
                              value={formData.fundacao}
                              type="date"
                              onChange={(e) =>
                                updateField('fundacao', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Presidente
                            </label>
                            <Textbox
                              value={formData.presidente}
                              onChange={(e) =>
                                updateField('presidente', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Foto (URL)
                            </label>
                            <Textbox
                              value={formData.foto}
                              onChange={(e) =>
                                updateField('foto', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Ideologia (Opcional)
                            </label>
                            <Textarea
                              value={formData.ideologia}
                              onChange={(e) =>
                                updateField('ideologia', e.target.value)
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Nome Completo
                            </label>
                            <Textbox
                              value={formData.nome}
                              onChange={(e) =>
                                updateField('nome', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Nome Político
                            </label>
                            <Textbox
                              value={formData.nome_politico}
                              onChange={(e) =>
                                updateField('nome_politico', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Data de Nascimento
                            </label>
                            <Textbox
                              type="date"
                              value={formData.data_nascimento}
                              onChange={(e) =>
                                updateField('data_nascimento', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Estado
                            </label>
                            <Select
                              placeholder=" "
                              options={estadosBrasil}
                              value={formData.uf_naturalidade}
                              onChange={(e) =>
                                updateField('uf_naturalidade', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Cidade
                            </label>
                            <Textbox
                              value={formData.naturalidade}
                              onChange={(e) =>
                                updateField('naturalidade', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Cargo Atual
                            </label>
                            <Select
                              placeholder=" "
                              options={cargos_atuais}
                              value={formData.cargo_atual}
                              onChange={(e) =>
                                updateField('cargo_atual', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Cargo de Candidatura
                            </label>
                            <Select
                              placeholder=" "
                              options={cargos}
                              value={formData.cargo}
                              onChange={(e) =>
                                updateField('cargo', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Número da Urna
                            </label>
                            <Textbox
                              value={formData.numero}
                              type="number"
                              onChange={handleNumeroChange}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Foto (URL)
                            </label>
                            <Textbox
                              value={formData.foto}
                              onChange={(e) =>
                                updateField('foto', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Feitos (Opcional)
                            </label>
                            <Textarea
                              value={formData.feitos}
                              onChange={(e) =>
                                updateField('feitos', e.target.value)
                              }
                            />
                          </div>
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
                      <p className="font-semibold text-[#1f2332]">CAMPO FOTO</p>
                      <p>
                        Sempre que quiser adicionar uma foto para o partido ou
                        candidato, utilize um URL válido ao invés de um arquivo
                        local.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-[#1f2332] mb-2">
              Confirmar ação
            </h3>
            <p className="text-sm text-[#4c557a] mb-8">
              Deseja mesmo adicionar um novo{' '}
              {activeSection === 'partido' ? 'partido' : 'candidato'}?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-full border border-[#3f5ca7] px-4 py-3 text-sm font-semibold text-[#3f5ca7] hover:bg-[#eef2ff]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAdd}
                className="flex-1 rounded-full bg-[#2a2a72] px-4 py-3 text-sm font-semibold text-white hover:brightness-[.9]"
              >
                Sim, avançar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
