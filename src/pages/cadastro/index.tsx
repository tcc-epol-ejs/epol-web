import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrar } from '../../services/api';
import {
  uploadFotoPerfil,
  FOTO_MAX_BYTES,
  FOTO_TIPOS,
} from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Textbox from '../../components/inputs';
import Botao from '../../components/botoes/botao';
import LogoEpol from '../../assets/Imagens/Logos/logoepol.png';
import { ToastContainer, useToasts } from '../../components/toast';
import DateField from '../../components/inputs/data';
import Footer from '../../components/footer/footer';
import SeletorPfpModal from '../../components/seletorPfpModal/index';

const bolasConfig = [
  { size: 280, top: '-40px', left: '-30px', opacity: 1 },
  { size: 160, top: '20px', left: '220px', opacity: 0.6 },
  { size: 100, top: '160px', left: '30px', opacity: 0.75 },
  { size: 240, top: '-50px', right: '-30px', opacity: 0.85 },
  { size: 150, top: '60px', right: '220px', opacity: 0.5 },
  { size: 80, top: '10px', right: '180px', opacity: 0.7 },
  { size: 260, bottom: '-50px', left: '-40px', opacity: 0.9 },
  { size: 120, bottom: '-20px', left: '190px', opacity: 0.7 },
  { size: 300, bottom: '-60px', right: '-40px', opacity: 1 },
  { size: 160, bottom: '120px', right: '200px', opacity: 0.6 },
];

// E-mail: exige usuário + domínio com pelo menos um ponto (ex: nome@dominio.com)
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

// Senha: mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número
const SENHA_MIN_LENGTH = 8;

interface FormData {
  nome: string;
  apelido: string;
  data_nascimento: string;
  email: string;
  confirmEmail: string;
  senha: string;
  confirmSenha: string;
  estado: string;
}

const initialFormData: FormData = {
  nome: '',
  apelido: '',
  data_nascimento: '',
  email: '',
  confirmEmail: '',
  senha: '',
  confirmSenha: '',
  estado: '',
};

type Passo = 1 | 2 | 3 | 4;
const TOTAL_STEPS = 4;

function validarCampo(
  campo: keyof FormData,
  dados: FormData,
): string | undefined {
  switch (campo) {
    case 'nome': {
      const valor = dados.nome.trim();
      if (!valor) return 'Informe seu nome completo';
      if (!valor.includes(' ')) return 'Informe nome e sobrenome';
      return undefined;
    }

    case 'apelido': {
      const valor = dados.apelido.trim();
      if (!valor) return 'Informe um apelido';
      if (valor.length < 2) return 'O apelido deve ter pelo menos 2 caracteres';
      return undefined;
    }

    case 'data_nascimento': {
      const valor = dados.data_nascimento;
      if (!valor) return 'Informe sua data de nascimento';
      const data = new Date(valor);
      if (Number.isNaN(data.getTime())) return 'Data de nascimento inválida';
      if (data.getTime() > Date.now())
        return 'A data de nascimento não pode ser no futuro';
      return undefined;
    }

    case 'email': {
      const valor = dados.email.trim();
      if (!valor) return 'Informe seu e-mail';
      if (!EMAIL_REGEX.test(valor))
        return 'Insira um e-mail válido (ex: nome@dominio.com)';
      return undefined;
    }

    case 'confirmEmail': {
      if (!dados.confirmEmail.trim()) return 'Confirme seu e-mail';
      if (dados.confirmEmail.trim() !== dados.email.trim())
        return 'Os e-mails não coincidem';
      return undefined;
    }

    case 'estado': {
      if (!dados.estado.trim()) return 'Informe seu estado';
      return undefined;
    }

    case 'senha': {
      const valor = dados.senha;
      if (!valor) return 'Informe uma senha';
      if (valor.length < SENHA_MIN_LENGTH)
        return `A senha deve ter pelo menos ${SENHA_MIN_LENGTH} caracteres`;
      if (!/[A-Z]/.test(valor))
        return 'A senha deve conter ao menos uma letra maiúscula';
      if (!/[a-z]/.test(valor))
        return 'A senha deve conter ao menos uma letra minúscula';
      if (!/\d/.test(valor)) return 'A senha deve conter ao menos um número';
      return undefined;
    }

    case 'confirmSenha': {
      if (!dados.confirmSenha) return 'Confirme sua senha';
      if (dados.confirmSenha !== dados.senha) return 'As senhas não coincidem';
      return undefined;
    }

    default:
      return undefined;
  }
}

// Campos que pertencem a cada passo (a foto de perfil é opcional, sem validação)
const CAMPOS_POR_PASSO: Record<Passo, (keyof FormData)[]> = {
  1: ['nome', 'apelido', 'data_nascimento'],
  2: ['email', 'confirmEmail', 'estado'],
  3: [],
  4: ['senha', 'confirmSenha'],
};

// Seletor de estado customizado (mesmo estilo visual do calendário)

const ESTADOS_BR = [
  { nome: 'Acre', uf: 'AC' },
  { nome: 'Alagoas', uf: 'AL' },
  { nome: 'Amapá', uf: 'AP' },
  { nome: 'Amazonas', uf: 'AM' },
  { nome: 'Bahia', uf: 'BA' },
  { nome: 'Ceará', uf: 'CE' },
  { nome: 'Distrito Federal', uf: 'DF' },
  { nome: 'Espírito Santo', uf: 'ES' },
  { nome: 'Goiás', uf: 'GO' },
  { nome: 'Maranhão', uf: 'MA' },
  { nome: 'Mato Grosso', uf: 'MT' },
  { nome: 'Mato Grosso do Sul', uf: 'MS' },
  { nome: 'Minas Gerais', uf: 'MG' },
  { nome: 'Pará', uf: 'PA' },
  { nome: 'Paraíba', uf: 'PB' },
  { nome: 'Paraná', uf: 'PR' },
  { nome: 'Pernambuco', uf: 'PE' },
  { nome: 'Piauí', uf: 'PI' },
  { nome: 'Rio de Janeiro', uf: 'RJ' },
  { nome: 'Rio Grande do Norte', uf: 'RN' },
  { nome: 'Rio Grande do Sul', uf: 'RS' },
  { nome: 'Rondônia', uf: 'RO' },
  { nome: 'Roraima', uf: 'RR' },
  { nome: 'Santa Catarina', uf: 'SC' },
  { nome: 'São Paulo', uf: 'SP' },
  { nome: 'Sergipe', uf: 'SE' },
  { nome: 'Tocantins', uf: 'TO' },
];

function EstadoField({
  value,
  onChange,
  placeholder = 'Estado',
}: {
  value: string;
  onChange: (nomeEstado: string) => void;
  placeholder?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const estadoSelecionado = ESTADOS_BR.find((e) => e.nome === value);

  useEffect(() => {
    function aoClicarFora(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setAberto(false);
      }
    }
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, []);

  function selecionar(nomeEstado: string) {
    onChange(nomeEstado);
    setAberto(false);
  }

  return (
    <div className="relative w-full custom-scroll" ref={containerRef}>
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="w-full flex items-center justify-between rounded-full border border-[#a9a9f6] bg-[#a9a9f6] px-4 py-2.5 font-medium text-sm outline-none transition-all duration-300 focus:brightness-[1.2]"
      >
        <span className={value ? 'text-[#1f2a52]' : 'text-[#5A5A70]'}>
          {estadoSelecionado
            ? `${estadoSelecionado.nome} - ${estadoSelecionado.uf}`
            : placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2a2a72"
          strokeWidth={2}
          className="w-4 h-4 flex-shrink-0"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {aberto && (
        <div className="absolute z-50 top-full left-0 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl bg-[#A9A9F6] border border-[#8888D3] p-2 shadow-xl custom-scroll">
          <div className="flex flex-col gap-0.5">
            {ESTADOS_BR.map((estado) => {
              const selecionado = estado.nome === value;
              return (
                <button
                  key={estado.uf}
                  type="button"
                  onClick={() => selecionar(estado.nome)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selecionado
                      ? 'bg-[#FFA400] text-white font-semibold'
                      : 'text-[#2a2a72] hover:bg-[#6262AD]/60'
                  }`}
                >
                  {estado.nome} - {estado.uf}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Seletor de foto de perfil (opcional)

function FotoPerfilField({
  preview,
  onAbrir,
  onRemover,
}: {
  preview: string | null;
  onAbrir: () => void;
  onRemover: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onAbrir}
        aria-label="Escolher foto de perfil"
        className="w-28 h-28 rounded-full overflow-hidden bg-[#a9a9f6] flex items-center justify-center transition-all duration-300 hover:brightness-[1.15]"
      >
        {preview ? (
          <img
            src={preview}
            alt="Pré-visualização da foto de perfil"
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2a2a72"
            strokeWidth={1.8}
            className="w-10 h-10"
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <p className="text-[#CBCBEC] text-[11px] text-center">
        {preview
          ? 'Toque na foto para trocar'
          : 'Escolha uma foto de perfil (opcional)'}
      </p>

      {preview && (
        <button
          type="button"
          onClick={onRemover}
          className="text-[11px] font-semibold text-[#FFA400] hover:underline"
        >
          Remover foto
        </button>
      )}
    </div>
  );
}

// Indicador de força de senha

function calcularForcaSenha(senha: string): {
  nivel: 0 | 1 | 2 | 3;
  label: string;
  cor: string;
} {
  if (!senha) return { nivel: 0, label: '', cor: 'transparent' };

  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (senha.length >= 12) pontos++;
  if (/[a-z]/.test(senha)) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/\d/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  if (pontos <= 2) return { nivel: 1, label: 'Fraca', cor: '#ef4444' };
  if (pontos <= 4) return { nivel: 2, label: 'Média', cor: '#eab308' };
  return { nivel: 3, label: 'Forte', cor: '#22c55e' };
}

function BarraForcaSenha({ senha }: { senha: string }) {
  const forca = calcularForcaSenha(senha);

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((segmento) => (
          <div
            key={segmento}
            className="h-1.5 flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: segmento <= forca.nivel ? forca.cor : '#4d4d9e',
            }}
          />
        ))}
      </div>
      <span className="text-[10px] font-semibold" style={{ color: forca.cor }}>
        Senha {forca.label.toLowerCase()}
      </span>
    </div>
  );
}

function Cadastro() {
  const circleSize = 'min(580px, 75vw, 75dvh)';
  const gap = '20px';
  const navigate = useNavigate();
  const { salvarSessao } = useAuth();

  const [step, setStep] = useState<Passo>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toasts, mostrarErro, fecharToast } = useToasts();
  const [enviando, setEnviando] = useState(false);

  const [modalFoto, setModalFoto] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // libera a URL temporária quando a foto muda ou o componente desmonta
  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  function handleChange(campo: keyof FormData) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const valor = event.target.value;
      setFormData((prev) => ({ ...prev, [campo]: valor }));
    };
  }

  function handleDataNascimentoChange(iso: string) {
    setFormData((prev) => ({ ...prev, data_nascimento: iso }));
  }

  function handleEstadoChange(nomeEstado: string) {
    setFormData((prev) => ({ ...prev, estado: nomeEstado }));
  }

  function handleFotoSelecionada(file: File) {
    if (!FOTO_TIPOS.includes(file.type)) {
      mostrarErro('Use uma imagem JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > FOTO_MAX_BYTES) {
      mostrarErro('A foto deve ter no máximo 2 MB.');
      return;
    }
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  function handleRemoverFoto() {
    setFotoFile(null);
    setFotoPreview(null);
  }

  function validarPasso(passo: Passo): boolean {
    const camposDoPasso = CAMPOS_POR_PASSO[passo];

    for (const campo of camposDoPasso) {
      const mensagem = validarCampo(campo, formData);
      if (mensagem) {
        mostrarErro(mensagem);
        return false;
      }
    }

    return true;
  }

  function handleAvancar() {
    if (!validarPasso(step)) return;
    setStep((prev) => (prev < TOTAL_STEPS ? ((prev + 1) as Passo) : prev));
  }

  function handleVoltar() {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Passo) : prev));
  }

  async function handleCadastro() {
    if (!validarPasso(4)) return;

    setEnviando(true);

    try {
      const foto_perfil_url = fotoFile
        ? await uploadFotoPerfil(fotoFile)
        : null;

      await cadastrar({
        nome: formData.nome.trim(),
        apelido: formData.apelido.trim(),
        data_nascimento: formData.data_nascimento,
        email: formData.email.trim(),
        senha: formData.senha,
        estado: formData.estado.trim(),
        foto_perfil_url,
      });
      navigate('/login');
    } catch (err: any) {
      mostrarErro(err.message || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <section className="w-full min-h-[100dvh] bg-[#2a2a72] flex items-center justify-center overflow-hidden relative">
        <ToastContainer toasts={toasts} onFechar={fecharToast} />

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
              backgroundColor: '#8888D3',
              opacity: b.opacity,
              zIndex: 0,
            }}
          />
        ))}

        <div
          className="absolute inset-y-0 left-0 z-10"
          style={{
            width: '50vw',
            backgroundColor: '#FFA400',
            clipPath: `polygon(0% 50%, 100% 0%, calc(100% - ${gap}) 50%, 100% 100%)`,
          }}
        />

        <div
          className="absolute inset-y-0 right-0 z-10"
          style={{
            width: '50vw',
            backgroundColor: '#FFA400',
            clipPath: `polygon(${gap} 0%, 100% 50%, ${gap} 100%, 0% 50%)`,
          }}
        />

        <div
          className="relative z-20 bg-[#2a2a72] rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: circleSize, height: circleSize }}
        >
          <div className="flex flex-col items-center gap-4 w-[70%] pt-5 relative">
            <img
              className="h-auto w-[100px] absolute -top-[50px]"
              alt="Logo EPOL"
              src={LogoEpol}
              onClick={() => navigate('/')}
            />

            <h1 className="text-[#FFA400] font-bold text-center text-[22px] leading-tight">
              Crie sua conta!
            </h1>

            <p
              className="text-[#CBCBEC] text-center font-semibold"
              style={{ fontSize: '11px' }}
            >
              Passo {step} de {TOTAL_STEPS}
            </p>

            <div className="relative w-full">
              <div
                aria-hidden="true"
                className="invisible flex flex-col gap-4 w-full"
              >
                <Textbox
                  placeholder="Nome completo"
                  value=""
                  onChange={() => {}}
                />
                <Textbox placeholder="Apelido" value="" onChange={() => {}} />
                <DateField value="" onChange={() => {}} />
              </div>

              <div className="absolute inset-x-0 top-0 flex flex-col gap-4 w-full">
                {step === 1 && (
                  <>
                    <Textbox
                      placeholder="Nome completo"
                      value={formData.nome}
                      onChange={handleChange('nome')}
                    />
                    <Textbox
                      placeholder="Apelido (como você quer ser chamado?)"
                      value={formData.apelido}
                      onChange={handleChange('apelido')}
                    />
                    <DateField
                      value={formData.data_nascimento}
                      onChange={handleDataNascimentoChange}
                      placeholder="Data de Nascimento"
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <Textbox
                      placeholder="E-mail"
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                    />
                    <Textbox
                      placeholder="Confirmar e-mail"
                      type="email"
                      value={formData.confirmEmail}
                      onChange={handleChange('confirmEmail')}
                    />
                    <EstadoField
                      value={formData.estado}
                      onChange={handleEstadoChange}
                    />
                  </>
                )}

                {step === 3 && (
                  <FotoPerfilField
                    preview={fotoPreview}
                    onAbrir={() => setModalFoto(true)}
                    onRemover={handleRemoverFoto}
                  />
                )}

                {step === 4 && (
                  <>
                    <Textbox
                      showToggle
                      type="password"
                      placeholder="Senha"
                      value={formData.senha}
                      onChange={handleChange('senha')}
                    />
                    <Textbox
                      showToggle
                      type="password"
                      placeholder="Confirmar senha"
                      value={formData.confirmSenha}
                      onChange={handleChange('confirmSenha')}
                    />
                    <BarraForcaSenha senha={formData.senha} />
                  </>
                )}
              </div>
            </div>

            {step === 1 && (
              <Botao
                bgColor="#ffa400"
                textColor="#ffffff"
                onClick={handleAvancar}
              >
                avançar
              </Botao>
            )}

            {step > 1 && step < TOTAL_STEPS && (
              <div className="flex gap-3 w-full justify-center">
                <Botao
                  bgColor="#8888D3"
                  textColor="#ffffff"
                  onClick={handleVoltar}
                >
                  voltar
                </Botao>
                <Botao
                  bgColor="#ffa400"
                  textColor="#ffffff"
                  onClick={handleAvancar}
                >
                  avançar
                </Botao>
              </div>
            )}

            {step === TOTAL_STEPS && (
              <div className="flex gap-3 w-full justify-center">
                <Botao
                  bgColor="#8888D3"
                  textColor="#ffffff"
                  onClick={handleVoltar}
                >
                  voltar
                </Botao>
                <Botao
                  bgColor="#ffa400"
                  textColor="#ffffff"
                  onClick={handleCadastro}
                >
                  {enviando ? 'cadastrando...' : 'cadastrar'}
                </Botao>
              </div>
            )}

            <p
              className="text-white text-center"
              style={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
            >
              Já tem uma conta?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-[#CBCBEC] font-semibold cursor-pointer hover:underline"
              >
                Entrar
              </span>
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <SeletorPfpModal
        aberto={modalFoto}
        onFechar={() => setModalFoto(false)}
        onEscolher={handleFotoSelecionada}
      />
    </div>
  );
}

export default Cadastro;
