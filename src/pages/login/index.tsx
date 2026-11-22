import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Textbox from '../../components/inputs';
import Botao from '../../components/botoes/botao';
import Footer from '../../components/footer/footer';
import LogoEpol from '../../assets/Imagens/Logos/LogoEPOLPreta.png';
import './login.css';

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
  const navigate = useNavigate();
  const { salvarSessao } = useAuth();

  const [emailOuUsuario, setEmailOuUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleEmailOuUsuarioChange(event: ChangeEvent<HTMLInputElement>) {
    setEmailOuUsuario(event.target.value);
    setErrorMessage('');
  }

  function handleSenhaChange(event: ChangeEvent<HTMLInputElement>) {
    setSenha(event.target.value);
    setErrorMessage('');
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!emailOuUsuario.trim()) {
      setErrorMessage('Informe seu e-mail');
      return;
    }

    if (!senha.trim()) {
      setErrorMessage('Informe sua senha');
      return;
    }

    try {
      const { usuario, token } = await login(emailOuUsuario, senha);
      salvarSessao(usuario, token);
      navigate('/main');
    } catch (err) {
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : 'E-mail ou senha inválidos',
      );
    }
  }

  return (
    <div>
      <main className="epol-login relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#e8f0fe] px-4 py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {bolasConfig.map((b, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `calc(${b.size}px * var(--escala-bolas))`,
                height: `calc(${b.size}px * var(--escala-bolas))`,
                top: b.top && `calc(${b.top} * var(--escala-bolas))`,
                bottom: b.bottom && `calc(${b.bottom} * var(--escala-bolas))`,
                left: b.left && `calc(${b.left} * var(--escala-bolas))`,
                right: b.right && `calc(${b.right} * var(--escala-bolas))`,
                backgroundColor: b.bgColor || '#7b6bb5',
                opacity: b.opacity,
              }}
            />
          ))}
          <div className="epol-login-bandeira absolute inset-y-0 left-0 w-1/2 bg-[#FFA400] [clip-path:polygon(0_50%,100%_0,calc(100%-20px)_50%,100%_100%)]" />
          <div className="epol-login-bandeira absolute inset-y-0 right-0 w-1/2 bg-[#FFA400] [clip-path:polygon(20px_0,100%_50%,20px_100%,0_50%)]" />
        </div>

        <div className="epol-login-cartao relative flex items-center justify-center bg-[#e8f0fe] px-6 py-8">
          <form
            onSubmit={handleLogin}
            className="epol-login-form flex flex-col items-center gap-4"
          >
            <Link
              to="/"
              aria-label="Página inicial do EPOL"
              className="rounded-md"
            >
              <img className="epol-login-logo h-auto" alt="" src={LogoEpol} />
            </Link>

            <h1 className="text-center text-xl font-bold leading-tight text-[#2d2d6b] sm:text-[22px]">
              Bem-vindo de volta!
            </h1>

            <div className="flex w-full flex-col gap-4">
              <Textbox
                placeholder="E-mail"
                aria-label="E-mail"
                autoComplete="username"
                inputMode="email"
                value={emailOuUsuario}
                onChange={handleEmailOuUsuarioChange}
              />
              <Textbox
                showToggle
                type="password"
                placeholder="Senha"
                aria-label="Senha"
                autoComplete="current-password"
                value={senha}
                onChange={handleSenhaChange}
              />
              {errorMessage && (
                <p
                  role="alert"
                  className="break-words text-center text-xs font-semibold text-red-700"
                >
                  {errorMessage}
                </p>
              )}
            </div>

            <Botao bgColor="#2d2d6b" textColor="#fff" type="submit">
              entrar
            </Botao>

            <Link
              className="inline-flex min-h-8 items-center justify-center text-center text-sm font-semibold text-[#2d2d6b] hover:underline"
              to="/recuperar-senha"
            >
              Esqueceu a senha?
            </Link>

            <p className="text-center text-sm text-[#2d2d6b]">
              Não tem uma conta?{' '}
              <Link
                to="/cadastro"
                className="inline-block py-1 font-semibold hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
