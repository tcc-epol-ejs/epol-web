import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Botao from '../../components/botoes/botao';
import Textbox from '../../components/inputs';
import Textarea from '../../components/inputs/textarea';
import LogoEPOL from '../../assets/SVGs/LogoEPOL.svg';
import { ToastContainer, useToasts } from '../../components/toast';
import DateField from '../../components/inputs/data';
import ModalSelectField from '../../components/selects/selectModal';
import { cadastrarCandidato, cadastrarPartido } from '../../services/api';

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

// CHECK constraint do banco: candidatura só aceita 'Presidente' ou 'Governador'
const OPCOES_CANDIDATURA = ['Presidente', 'Governador'];

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

// Paleta de cores dos campos customizados (DateField / ModalSelectField)
const CORES_CAMPO = {
  corDestaque: '#FFA400',
  corTexto: '#2a2a72',
  corFundoCampo: '#a9a9f6',
  corBordaCampo: '#a9a9f6',
  corPlaceholder: '#5A5A70',
  corFundoPainel: '#A9A9F6',
  corBordaPainel: '#8888D3',
  corHover: '#CBCBFF',
};

// Formulário de Partido

interface PartidoFormData {
  nome_completo: string;
  sigla: string;
  apelido_gentilico: string;
  numero_legenda: string;
  data_fundacao: string;
  data_deferimento: string;
  fundadores: string; // textarea: um nome por linha
  presidente_nacional: string;
  propostas_url: string; // textarea: uma URL por linha
  propostas_resumo: string; // textarea: uma proposta por linha
  ideologia: string; // textarea: uma ideologia por linha
  bandeira_url: string;
  uf_sede: string;
  tag: string; // textarea: uma tag por linha
}

const initialPartidoForm: PartidoFormData = {
  nome_completo: '',
  sigla: '',
  apelido_gentilico: '',
  numero_legenda: '',
  data_fundacao: '',
  data_deferimento: '',
  fundadores: '',
  presidente_nacional: '',
  propostas_url: '',
  propostas_resumo: '',
  ideologia: '',
  bandeira_url: '',
  uf_sede: '',
  tag: '',
};

const ROTULOS_PARTIDO: Record<keyof PartidoFormData, string> = {
  nome_completo: 'Nome Completo',
  sigla: 'Sigla',
  apelido_gentilico: 'Apelido/Gentílico',
  numero_legenda: 'Número da Legenda',
  data_fundacao: 'Data de Fundação',
  data_deferimento: 'Data de Deferimento',
  fundadores: 'Fundadores',
  presidente_nacional: 'Presidente Nacional',
  propostas_url: 'URLs das Propostas',
  propostas_resumo: 'Resumo das Propostas',
  ideologia: 'Ideologia',
  bandeira_url: 'Bandeira (URL)',
  uf_sede: 'UF da Sede',
  tag: 'Tags',
};

const CAMPOS_OBRIGATORIOS_PARTIDO: (keyof PartidoFormData)[] = [
  'nome_completo',
  'sigla',
  'numero_legenda',
  'data_fundacao',
  'data_deferimento',
  'fundadores',
  'presidente_nacional',
];

// Formulário de Candidato

interface CandidatoFormData {
  candidatura: string;
  numero_candidatura: string;
  numero_urna: string;
  nome_completo: string;
  nome_politico: string;
  data_nascimento: string;
  naturalidade: string;
  uf_naturalidade: string;
  formacao_academica: string; // textarea: "Curso - Instituição - Ano" por linha
  profissao_anterior: string;
  foto_url: string;
  cargo_atual: string;
  uf_candidatura: string; // obrigatório quando candidatura === 'Governador'
  vice: string;
  tempo_atuacao_anos: string;
  feitos_url: string; // textarea: uma URL por linha
  feitos_resumo: string; // textarea: um feito por linha
}

const initialCandidatoForm: CandidatoFormData = {
  candidatura: '',
  numero_candidatura: '',
  numero_urna: '',
  nome_completo: '',
  nome_politico: '',
  data_nascimento: '',
  naturalidade: '',
  uf_naturalidade: '',
  formacao_academica: '',
  profissao_anterior: '',
  foto_url: '',
  cargo_atual: '',
  uf_candidatura: '',
  vice: '',
  tempo_atuacao_anos: '',
  feitos_url: '',
  feitos_resumo: '',
};

const ROTULOS_CANDIDATO: Record<keyof CandidatoFormData, string> = {
  candidatura: 'Candidatura',
  numero_candidatura: 'Número de Candidatura (TSE)',
  numero_urna: 'Número da Urna',
  nome_completo: 'Nome Completo',
  nome_politico: 'Nome Político',
  data_nascimento: 'Data de Nascimento',
  naturalidade: 'Naturalidade',
  uf_naturalidade: 'UF de Naturalidade',
  formacao_academica: 'Formação Acadêmica',
  profissao_anterior: 'Profissão Anterior',
  foto_url: 'Foto (URL)',
  cargo_atual: 'Cargo Atual',
  uf_candidatura: 'UF de Candidatura',
  vice: 'Vice',
  tempo_atuacao_anos: 'Tempo de Atuação (anos)',
  feitos_url: 'URLs dos Feitos',
  feitos_resumo: 'Resumo dos Feitos',
};

const CAMPOS_OBRIGATORIOS_CANDIDATO: (keyof CandidatoFormData)[] = [
  'candidatura',
  'nome_completo',
  'nome_politico',
  'data_nascimento',
  'naturalidade',
  'uf_naturalidade',
  'cargo_atual',
];

function textareaParaArray(texto: string): string[] {
  return texto
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean);
}

export default function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'partido' | 'politico'>(
    'partido',
  );

  const [partidoForm, setPartidoForm] =
    useState<PartidoFormData>(initialPartidoForm);
  const [candidatoForm, setCandidatoForm] =
    useState<CandidatoFormData>(initialCandidatoForm);

  const { toasts, mostrarErro, mostrarSucesso, fecharToast } = useToasts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY.current || currentY < 20);
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function updatePartidoField(campo: keyof PartidoFormData, valor: string) {
    setPartidoForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function updateCandidatoField(campo: keyof CandidatoFormData, valor: string) {
    setCandidatoForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function criarHandleNumero(
    atualizar: (valor: string) => void,
    maxDigitos: number,
  ) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const valor = e.target.value;
      if (valor !== '' && (!/^\d+$/.test(valor) || valor.length > maxDigitos)) {
        return;
      }
      atualizar(valor);
    };
  }

  const handleNumeroLegendaChange = criarHandleNumero(
    (v) => updatePartidoField('numero_legenda', v),
    2,
  );
  const handleNumeroUrnaChange = criarHandleNumero(
    (v) => updateCandidatoField('numero_urna', v),
    5,
  );
  const handleTempoAtuacaoChange = criarHandleNumero(
    (v) => updateCandidatoField('tempo_atuacao_anos', v),
    3,
  );

  function handleSectionChange(section: 'partido' | 'politico') {
    setActiveSection(section);
  }

  function validarPartido(): boolean {
    for (const campo of CAMPOS_OBRIGATORIOS_PARTIDO) {
      if (!partidoForm[campo].trim()) {
        mostrarErro(`Preencha o campo "${ROTULOS_PARTIDO[campo]}".`);
        return false;
      }
    }

    const numero = Number(partidoForm.numero_legenda);
    if (Number.isNaN(numero) || numero < 10 || numero > 99) {
      mostrarErro('O número da legenda deve estar entre 10 e 99.');
      return false;
    }

    return true;
  }

  function validarCandidato(): boolean {
    for (const campo of CAMPOS_OBRIGATORIOS_CANDIDATO) {
      if (!candidatoForm[campo].trim()) {
        mostrarErro(`Preencha o campo "${ROTULOS_CANDIDATO[campo]}".`);
        return false;
      }
    }

    // Regra de negócio do dicionário de dados: uf_candidatura é obrigatório
    // quando candidatura = 'Governador'
    if (
      candidatoForm.candidatura === 'Governador' &&
      !candidatoForm.uf_candidatura.trim()
    ) {
      mostrarErro(
        'UF de Candidatura é obrigatória para candidatos a Governador.',
      );
      return false;
    }

    const dataNascimento = new Date(candidatoForm.data_nascimento);
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
      mostrarErro('A idade mínima é de 30 anos.');
      return false;
    }

    if (idade > 99) {
      mostrarErro('A idade máxima é de 99 anos.');
      return false;
    }

    if (candidatoForm.foto_url && !isValidUrl(candidatoForm.foto_url)) {
      mostrarErro(
        'A URL da foto é inválida. Certifique-se de começar com http:// ou https://',
      );
      return false;
    }

    return true;
  }

  function handleAdd() {
    const valido =
      activeSection === 'partido' ? validarPartido() : validarCandidato();
    if (!valido) return;
    setIsModalOpen(true);
  }

  async function handleConfirmAdd() {
    try {
      if (activeSection === 'partido') {
        const payloadPartido = {
          ...partidoForm,
          numero_legenda: Number(partidoForm.numero_legenda),
          fundadores: textareaParaArray(partidoForm.fundadores),
          ideologia: textareaParaArray(partidoForm.ideologia),
          propostas_url: textareaParaArray(partidoForm.propostas_url),
          propostas_resumo: textareaParaArray(partidoForm.propostas_resumo),
          tag: textareaParaArray(partidoForm.tag),
          apelido_gentilico: partidoForm.apelido_gentilico || null,
          data_deferimento: partidoForm.data_deferimento || null,
          presidente_nacional: partidoForm.presidente_nacional || null,
          bandeira_url: partidoForm.bandeira_url || null,
          uf_sede: partidoForm.uf_sede || null,
        };

        await cadastrarPartido(payloadPartido);
        mostrarSucesso('Partido adicionado com sucesso!');
        setPartidoForm(initialPartidoForm);
      } else {
        const payloadCandidato = {
          ...candidatoForm,
          numero_urna: candidatoForm.numero_urna
            ? Number(candidatoForm.numero_urna)
            : null,
          tempo_atuacao_anos: candidatoForm.tempo_atuacao_anos
            ? Number(candidatoForm.tempo_atuacao_anos)
            : 0,
          formacao_academica: textareaParaArray(
            candidatoForm.formacao_academica,
          ),
          feitos_url: textareaParaArray(candidatoForm.feitos_url),
          feitos_resumo: textareaParaArray(candidatoForm.feitos_resumo),
          numero_candidatura: candidatoForm.numero_candidatura || null,
          uf_candidatura: candidatoForm.uf_candidatura || null,
          vice: candidatoForm.vice || null,
          profissao_anterior: candidatoForm.profissao_anterior || null,
          foto_url: candidatoForm.foto_url || null,
        };

        await cadastrarCandidato(payloadCandidato);
        mostrarSucesso('Candidato adicionado com sucesso!');
        setCandidatoForm(initialCandidatoForm);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      mostrarErro(err.message || 'Erro ao realizar o cadastro.');
      setIsModalOpen(false);
    }
  }

  function handleLimparCampos() {
    if (activeSection === 'partido') {
      setPartidoForm(initialPartidoForm);
    } else {
      setCandidatoForm(initialCandidatoForm);
    }
    mostrarSucesso('Campos limpos.');
  }

  return (
    <section className="relative min-h-[100dvh] bg-[#f8fbff] text-[#1f2332]">
      <ToastContainer toasts={toasts} onFechar={fecharToast} />

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
          <div
            className={`mx-[62px] mt-[42px] flex h-[80px] w-[calc(100%-124px)] items-center justify-between rounded-full border-2 border-[#3f5ca7] bg-white pl-[38px] pr-[11.5px] py-[11.5px] transition-transform duration-[800ms] ease-in-out ${visible ? 'translate-y-0' : '-translate-y-[200px]'}`}
          >
            <div className="flex items-center gap-5">
              <img src={LogoEPOL} alt="Logo EPOL" className="w-[90px] mt-1.5" />
              <div className="h-8 w-[1px] bg-[#CAD3EA]/30" />
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#3f5ca7]">
                  Administração
                </p>
                <h1 className="mt-1 text-base font-semibold text-[#1f2332]">
                  Cadastro de dados políticos
                </h1>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-4 text-xs font-semibold text-[#3f5ca7] hover:underline"
              >
                Voltar ao site principal
              </button>
            </div>
          </div>
        </div>

        <div className="pt-[140px]">
          <div className="mx-[62px] w-[calc(100%-124px)] pb-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
              <div className="rounded-[32px] border border-[#d9e2ff] bg-white p-6 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.2)]">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[#3f5ca7]">
                        O que quer adicionar?
                      </p>
                      <h2 className="mt-2 text-lg font-bold">
                        {activeSection === 'partido'
                          ? 'Novo partido'
                          : 'Novo candidato'}
                      </h2>
                    </div>
                    <div className="flex gap-2 rounded-full bg-[#eef2ff] p-1">
                      <button
                        type="button"
                        onClick={() => handleSectionChange('partido')}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activeSection === 'partido' ? 'bg-[#3f5ca7] text-white' : 'text-[#3f5ca7] hover:bg-[#d7e0ff]'}`}
                      >
                        Partido
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSectionChange('politico')}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activeSection === 'politico' ? 'bg-[#3f5ca7] text-white' : 'text-[#3f5ca7] hover:bg-[#d7e0ff]'}`}
                      >
                        Candidato
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-[#f5f8ff] p-6">
                    <div className="mt-2 grid gap-4 sm:grid-cols-2">
                      {activeSection === 'partido' ? (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Nome Completo
                            </label>
                            <Textbox
                              value={partidoForm.nome_completo}
                              onChange={(e) =>
                                updatePartidoField(
                                  'nome_completo',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Sigla
                            </label>
                            <Textbox
                              value={partidoForm.sigla}
                              onChange={(e) =>
                                updatePartidoField('sigla', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Apelido/Gentílico (Opcional)
                            </label>
                            <Textbox
                              value={partidoForm.apelido_gentilico}
                              onChange={(e) =>
                                updatePartidoField(
                                  'apelido_gentilico',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Número da Legenda (10-99)
                            </label>
                            <Textbox
                              value={partidoForm.numero_legenda}
                              type="number"
                              onChange={handleNumeroLegendaChange}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Data de Fundação
                            </label>
                            <DateField
                              value={partidoForm.data_fundacao}
                              onChange={(iso) =>
                                updatePartidoField('data_fundacao', iso)
                              }
                              {...CORES_CAMPO}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Data de Deferimento (TSE)
                            </label>
                            <DateField
                              value={partidoForm.data_deferimento}
                              onChange={(iso) =>
                                updatePartidoField('data_deferimento', iso)
                              }
                              {...CORES_CAMPO}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Presidente Nacional
                            </label>
                            <Textbox
                              value={partidoForm.presidente_nacional}
                              onChange={(e) =>
                                updatePartidoField(
                                  'presidente_nacional',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              UF da Sede (Opcional)
                            </label>
                            <ModalSelectField
                              opcoes={estadosBrasil}
                              value={partidoForm.uf_sede}
                              onChange={(v) => updatePartidoField('uf_sede', v)}
                              permiteVazio
                              {...CORES_CAMPO}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Bandeira (Opcional)
                            </label>
                            <Textbox
                              value={partidoForm.bandeira_url}
                              onChange={(e) =>
                                updatePartidoField(
                                  'bandeira_url',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Fundadores (um nome por linha)
                            </label>
                            <Textarea
                              value={partidoForm.fundadores}
                              onChange={(e) =>
                                updatePartidoField('fundadores', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Ideologia (uma por linha) (Opcional)
                            </label>
                            <Textarea
                              value={partidoForm.ideologia}
                              onChange={(e) =>
                                updatePartidoField('ideologia', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              URLs das Propostas (uma por linha) (Opcional)
                            </label>
                            <Textarea
                              value={partidoForm.propostas_url}
                              onChange={(e) =>
                                updatePartidoField(
                                  'propostas_url',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Resumo das Propostas (uma por linha) (Opcional)
                            </label>
                            <Textarea
                              value={partidoForm.propostas_resumo}
                              onChange={(e) =>
                                updatePartidoField(
                                  'propostas_resumo',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Tags (uma por linha) (Opcional)
                            </label>
                            <Textarea
                              value={partidoForm.tag}
                              onChange={(e) =>
                                updatePartidoField('tag', e.target.value)
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Candidatura
                            </label>
                            <ModalSelectField
                              opcoes={OPCOES_CANDIDATURA}
                              value={candidatoForm.candidatura}
                              onChange={(v) =>
                                updateCandidatoField('candidatura', v)
                              }
                              {...CORES_CAMPO}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Nome Completo
                            </label>
                            <Textbox
                              value={candidatoForm.nome_completo}
                              onChange={(e) =>
                                updateCandidatoField(
                                  'nome_completo',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Nome Político
                            </label>
                            <Textbox
                              value={candidatoForm.nome_politico}
                              onChange={(e) =>
                                updateCandidatoField(
                                  'nome_politico',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Data de Nascimento
                            </label>
                            <DateField
                              value={candidatoForm.data_nascimento}
                              onChange={(iso) =>
                                updateCandidatoField('data_nascimento', iso)
                              }
                              {...CORES_CAMPO}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Naturalidade (Cidade)
                            </label>
                            <Textbox
                              value={candidatoForm.naturalidade}
                              onChange={(e) =>
                                updateCandidatoField(
                                  'naturalidade',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              UF de Naturalidade
                            </label>
                            <ModalSelectField
                              opcoes={estadosBrasil}
                              value={candidatoForm.uf_naturalidade}
                              onChange={(v) =>
                                updateCandidatoField('uf_naturalidade', v)
                              }
                              {...CORES_CAMPO}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Cargo Atual
                            </label>
                            <ModalSelectField
                              opcoes={cargos_atuais}
                              value={candidatoForm.cargo_atual}
                              onChange={(v) =>
                                updateCandidatoField('cargo_atual', v)
                              }
                              {...CORES_CAMPO}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              UF de Candidatura
                              {candidatoForm.candidatura === 'Governador'
                                ? ''
                                : ' (P/ Governador)'}
                            </label>
                            <ModalSelectField
                              opcoes={estadosBrasil}
                              value={candidatoForm.uf_candidatura}
                              onChange={(v) =>
                                updateCandidatoField('uf_candidatura', v)
                              }
                              permiteVazio
                              {...CORES_CAMPO}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Número da Urna (Opcional)
                            </label>
                            <Textbox
                              value={candidatoForm.numero_urna}
                              type="number"
                              onChange={handleNumeroUrnaChange}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Número de Candidatura - TSE (Opcional)
                            </label>
                            <Textbox
                              value={candidatoForm.numero_candidatura}
                              onChange={(e) =>
                                updateCandidatoField(
                                  'numero_candidatura',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Vice (Opcional)
                            </label>
                            <Textbox
                              value={candidatoForm.vice}
                              onChange={(e) =>
                                updateCandidatoField('vice', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Tempo de Atuação em anos (Opcional)
                            </label>
                            <Textbox
                              value={candidatoForm.tempo_atuacao_anos}
                              type="number"
                              onChange={handleTempoAtuacaoChange}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Profissão Anterior (Opcional)
                            </label>
                            <Textbox
                              value={candidatoForm.profissao_anterior}
                              onChange={(e) =>
                                updateCandidatoField(
                                  'profissao_anterior',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Foto (URL) (Opcional)
                            </label>
                            <Textbox
                              value={candidatoForm.foto_url}
                              onChange={(e) =>
                                updateCandidatoField('foto_url', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Formação Acadêmica — "Curso - Instituição - Ano"
                              (uma por linha) (Opcional)
                            </label>
                            <Textarea
                              value={candidatoForm.formacao_academica}
                              onChange={(e) =>
                                updateCandidatoField(
                                  'formacao_academica',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              URLs dos Feitos (uma por linha) (Opcional)
                            </label>
                            <Textarea
                              value={candidatoForm.feitos_url}
                              onChange={(e) =>
                                updateCandidatoField(
                                  'feitos_url',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-[#3f5ca7] uppercase tracking-wider ml-1">
                              Resumo dos Feitos (um por linha) (Opcional)
                            </label>
                            <Textarea
                              value={candidatoForm.feitos_resumo}
                              onChange={(e) =>
                                updateCandidatoField(
                                  'feitos_resumo',
                                  e.target.value,
                                )
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
                        onClick={handleLimparCampos}
                        className="rounded-full border border-[#3f5ca7] bg-white px-5 py-4 text-xs font-semibold text-[#3f5ca7] transition hover:bg-[#eef2ff] text-nowrap"
                      >
                        Limpar campos
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-[140px] lg:self-start">
                <div className="rounded-[32px] border border-[#d9e2ff] bg-white p-6 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.2)]">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#3f5ca7]">
                    Observações
                  </p>
                  <div className="mt-4 space-y-4 text-xs leading-6 text-[#4c557a]">
                    <div>
                      <p className="font-semibold text-[#1f2332]">
                        CAMPOS DE URL
                      </p>
                      <p>
                        Sempre que for adicionar uma imagem (bandeira do partido
                        ou foto do candidato), utilize um link (URL) válido ao
                        invés de um arquivo local.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1f2332]">
                        CAMPOS COM VÁRIOS VALORES
                      </p>
                      <p>
                        Campos como Fundadores, Ideologia, Tags e Feitos aceitam
                        múltiplos valores: digite um item por linha (aperte
                        Enter pra separar).
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1f2332]">
                        CAMPO BANDEIRA (PARTIDO)
                      </p>
                      <p>
                        Siga esse padrão ao preencher esse campo:
                        /logos/partidos/*sigla-partido*.svg
                        (Ex:/logos/partidos/avante.svg)
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
            <h3 className="text-lg font-bold text-[#1f2332] mb-2">
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
