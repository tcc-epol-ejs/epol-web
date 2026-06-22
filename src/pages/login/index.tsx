import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Textbox from '../../components/inputs';
import Botao from '../../components/botoes/botao';
import LogoEpol from '../../assets/Imagens/Logos/LogoEPOLPreta.png';

const bolasConfig = [
  { size: 280, top: '-40px', left: '-30px', opacity: 1 },
  { size: 160, top: '20px', left: '220px', opacity: 0.6 },
  { size: 100, top: '160px', left: '30px', opacity: 0.75 },
  {
    size: 240,
    top: '-50px',
    right: '-30px',
    opacity: 1,
    bgColor: '#FFA400',
  },
  { size: 150, top: '60px', right: '220px', opacity: 0.5, bgColor: '#FFA400' },
  { size: 80, top: '10px', right: '180px', opacity: 0.7, bgColor: '#FFA400' },
  {
    size: 260,
    bottom: '-50px',
    left: '-40px',
    opacity: 1,
    bgColor: '#FFA400',
  },
  {
    size: 120,
    bottom: '-20px',
    left: '190px',
    opacity: 0.7,
    bgColor: '#FFA400',
  },
  { size: 300, bottom: '-60px', right: '-40px', opacity: 1 },
  { size: 160, bottom: '120px', right: '200px', opacity: 0.6 },
];

export default function Login() {
  const circleSize = 'min(580px, 75vw, 75dvh)';
  const gap = '20px';
  const navigate = useNavigate();
  const { salvarSessao } = useAuth();

  const [emailOuUsuario, setEmailOuUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginSucesso, setLoginSucesso] = useState(false);

  function handleEmailOuUsuarioChange(event: ChangeEvent<HTMLInputElement>) {
    setEmailOuUsuario(event.target.value);
    setShowError(false);
  }

  function handleSenhaChange(event: ChangeEvent<HTMLInputElement>) {
    setSenha(event.target.value);
    setShowError(false);
  }

  async function handleLogin() {
    if (!emailOuUsuario.trim()) {
      setErrorMessage('Informe seu e-mail');
      setShowError(true);
      return;
    }
    if (!senha.trim()) {
      setErrorMessage('Informe sua senha');
      setShowError(true);
      return;
    }
    try {
      const { usuario, token } = await login(emailOuUsuario, senha);
      salvarSessao(usuario, token);
      setLoginSucesso(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'E-mail ou senha inválidos');
      setShowError(true);
    }
  }

  return (
    <div>
      <section className="w-full min-h-[100dvh] bg-[#e8f0fe] flex items-center justify-center overflow-hidden relative">
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
              backgroundColor: b.bgColor || '#7b6bb5',
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
          className="relative z-20 bg-[#e8f0fe] rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: circleSize, height: circleSize }}
        >
          <div className="flex flex-col items-center gap-4 w-[70%] pt-5 relative">
            <img
              className="h-auto w-[100px] absolute -top-[60px]"
              alt="Logo EPOL"
              src={LogoEpol}
            />

            <h1 className="text-[#2d2d6b] font-bold text-center text-[22px] leading-tight">
              Bem-vindo de volta!
            </h1>

            <div className="flex flex-col gap-4 w-full">
              <Textbox
                placeholder="E-mail"
                value={emailOuUsuario}
                onChange={handleEmailOuUsuarioChange}
              />
              <Textbox
                showToggle
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={handleSenhaChange}
              />
              {showError && (
                <p className="text-red-500 text-[10px] font-semibold text-center">
                  {errorMessage}
                </p>
              )}
            </div>

            <Botao bgColor="#2d2d6b" textColor="#fff" onClick={handleLogin}>
              entrar
            </Botao>

            {loginSucesso && (
              <p className="text-green-500 text-[12px] font-semibold text-center">
                Logado com sucesso!
              </p>
            )}
            <p
              className="text-[#2d2d6b] text-center cursor-pointer font-semibold hover:underline"
              style={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
              onClick={() => navigate('/recuperar-senha')}
            >
              Esqueceu a senha?
            </p>

            <p
              className="text-[#2d2d6b] text-center"
              style={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
            >
              Não tem uma conta?{' '}
              <span
                onClick={() => navigate('/cadastro')}
                className="text-[#2d2d6b] font-semibold cursor-pointer hover:underline"
              >
                Cadastre-se
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
