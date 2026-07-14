import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrar } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Textbox from '../../components/inputs';
import Botao from '../../components/botoes/botao';
import LogoEpol from '../../assets/Imagens/Logos/logoepol.png';

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

function Cadastro() {
  const circleSize = 'min(580px, 75vw, 75dvh)';
  const gap = '20px';
  const navigate = useNavigate();
  const { salvarSessao } = useAuth();

  // Controle de qual passo está ativo (1 ou 2)
  const [step, setStep] = useState<1 | 2>(1);

  // Passo 1
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [email, setEmail] = useState('');

  // Passo 2
  const [partido, setPartido] = useState('');
  const [senha, setSenha] = useState('');
  const [estado, setEstado] = useState('');

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleNomeChange(event: ChangeEvent<HTMLInputElement>) {
    setNome(event.target.value);
    setShowError(false);
  }

  function handleApelidoChange(event: ChangeEvent<HTMLInputElement>) {
    setApelido(event.target.value);
    setShowError(false);
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    setShowError(false);
  }

  function handlePartidoChange(event: ChangeEvent<HTMLInputElement>) {
    setPartido(event.target.value);
    setShowError(false);
  }

  function handleSenhaChange(event: ChangeEvent<HTMLInputElement>) {
    setSenha(event.target.value);
    setShowError(false);
  }

  function handleEstadoChange(event: ChangeEvent<HTMLInputElement>) {
    setEstado(event.target.value);
    setShowError(false);
  }

  function handleAvancar() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome.trim()) {
      setErrorMessage('Informe seu nome');
      setShowError(true);
      return;
    }
    if (!apelido.trim()) {
      setErrorMessage('Informe um apelido');
      setShowError(true);
      return;
    }
    if (!email.trim() || !emailRegex.test(email)) {
      setErrorMessage('Por favor, insira um e-mail válido');
      setShowError(true);
      return;
    }

    setShowError(false);
    setStep(2);
  }

  function handleVoltar() {
    setShowError(false);
    setStep(1);
  }

  async function handleCadastro() {
    if (!partido.trim()) {
      setErrorMessage('Informe o partido');
      setShowError(true);
      return;
    }
    if (senha.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres');
      setShowError(true);
      return;
    }
    if (!estado.trim()) {
      setErrorMessage('Informe o estado');
      setShowError(true);
      return;
    }

    try {
      await cadastrar({
        nome,
        apelido,
        email,
        partido,
        senha,
        estado,
      });
      navigate('/login');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao cadastrar');
      setShowError(true);
    }
  }

  return (
    <section className="w-full min-h-[100dvh] bg-[#2a2a72] flex items-center justify-center overflow-hidden relative">
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
          />

          <h1 className="text-[#FFA400] font-bold text-center text-[22px] leading-tight">
            Crie sua conta!
          </h1>

          {/* Indicador simples de progresso */}
          <p
            className="text-[#CBCBEC] text-center font-semibold"
            style={{ fontSize: '11px' }}
          >
            Passo {step} de 2
          </p>

          <div className="flex flex-col gap-4 w-full">
            {step === 1 && (
              <>
                <Textbox
                  placeholder="Nome"
                  value={nome}
                  onChange={handleNomeChange}
                />
                <Textbox
                  placeholder="Apelido"
                  value={apelido}
                  onChange={handleApelidoChange}
                />
                <Textbox
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Textbox
                  placeholder="Partido"
                  value={partido}
                  onChange={handlePartidoChange}
                />
                <Textbox
                  showToggle
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={handleSenhaChange}
                />
                <Textbox
                  placeholder="Estado"
                  value={estado}
                  onChange={handleEstadoChange}
                />
              </>
            )}

            {showError && (
              <p className="text-red-400 text-[10px] font-semibold text-center">
                {errorMessage}
              </p>
            )}
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

          {step === 2 && (
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
                cadastrar
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
  );
}

export default Cadastro;
