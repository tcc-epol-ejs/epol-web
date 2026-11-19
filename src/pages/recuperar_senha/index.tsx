import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Textbox from '../../components/inputs';
import Botao from '../../components/botoes/botao';
import Confirmar from '../../components/botoes/botaoRecuperar/confirmar';
import Voltar from '../../components/botoes/botaoRecuperar/voltar';
import Footer from '../../components/footer/footer';
import { recuperarSenha, redefinirSenha } from '../../services/api';
import LogoEpol from '../../assets/Imagens/Logos/LogoEPOLPreta.png';

type RecuperarSenhaProps = {
  onSuccess?: () => void;
};

const bolasConfig = [
  { size: 280, top: '-40px', left: '-30px', opacity: 1 },
  { size: 160, top: '20px', left: '220px', opacity: 0.6 },
  { size: 100, top: '160px', left: '30px', opacity: 0.75 },
  { size: 240, top: '-50px', right: '-30px', opacity: 1, bgColor: '#FFA400' },
  { size: 150, top: '60px', right: '220px', opacity: 0.5, bgColor: '#FFA400' },
  { size: 80, top: '10px', right: '180px', opacity: 0.7, bgColor: '#FFA400' },
  { size: 260, bottom: '-50px', left: '-40px', opacity: 1, bgColor: '#FFA400' },
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

// Escala as bolinhas decorativas (tamanho E posição) pela variável CSS --s,
// que muda conforme a largura da tela (veja as classes na <section>).
// Antes elas tinham px fixos pensados para telas largas e, no celular,
// ficavam enormes e amontoadas.
const esc = (valor: string | number) => `calc(${valor}px * var(--s))`;
const escPos = (valor: string) => `calc(${valor} * var(--s))`;

// Hook genérico para media queries
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

function RecuperarSenha({ onSuccess }: RecuperarSenhaProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const isResetStep = Boolean(token);
  const location = useLocation();
  const { usuario } = useAuth();
  const veioDoPerfil =
    (location.state as { origem?: string } | null)?.origem === 'perfil';

  const [email, setEmail] = useState(
    veioDoPerfil ? (usuario?.email ?? '') : '',
  );
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // O círculo só funciona quando há espaço: precisa de largura E altura.
  // Em celular (ou celular deitado) o círculo ficava com ~280px e o conteúdo
  // estourava para fora dele; nesses casos o formulário vira um cartão
  // arredondado que cresce conforme o conteúdo.
  const isCircle = useMediaQuery('(min-width: 768px) and (min-height: 640px)');

  // As duas formas amarelas formam o losango da bandeira do Brasil (com o
  // círculo como o globo). Isso só funciona em tela larga e deitada; em tela
  // vertical elas viram triângulos finos e perdem o sentido, então ali o
  // fundo fica só com as bolinhas.
  const mostrarBandeira = useMediaQuery(
    '(min-width: 768px) and (orientation: landscape)',
  );

  const circleSize = 'min(580px, 75vw, 75dvh)';
  const gap = '20px';

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    setShowError(false);
  }

  function handleNovaSenhaChange(event: ChangeEvent<HTMLInputElement>) {
    setNovaSenha(event.target.value);
    setShowError(false);
  }

  function handleConfirmarSenhaChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmarSenha(event.target.value);
    setShowError(false);
  }

  async function handleRecover() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setErrorMessage('Por favor, insira um email válido');
      setShowError(true);
      return;
    }
    try {
      await recuperarSenha(email);
      setShowModal(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao enviar e-mail de recuperação');
      setShowError(true);
    }
  }

  async function handleResetPassword() {
    if (novaSenha.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres');
      setShowError(true);
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErrorMessage('As senhas não coincidem');
      setShowError(true);
      return;
    }
    try {
      await redefinirSenha(token!, novaSenha);
      setShowModal(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao redefinir senha');
      setShowError(true);
    }
  }

  function handleModalConfirm() {
    setShowModal(false);
    setEmail('');
    setNovaSenha('');
    setConfirmarSenha('');
    if (isResetStep) {
      navigate('/login');
    } else if (veioDoPerfil) {
      navigate('/perfil');
    } else if (onSuccess) {
      onSuccess();
    }
  }

  return (
    <div>
      <section
        className={`w-full min-h-[100dvh] bg-[#e8f0fe] flex items-center justify-center overflow-hidden relative [--s:0.5] sm:[--s:0.7] md:[--s:0.85] lg:[--s:1] ${
          isCircle ? '' : 'px-4 py-10'
        }`}
      >
        {bolasConfig.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: esc(b.size),
              height: esc(b.size),
              top: 'top' in b ? escPos(b.top) : undefined,
              bottom: 'bottom' in b ? escPos(b.bottom) : undefined,
              left: 'left' in b ? escPos(b.left) : undefined,
              right: 'right' in b ? escPos(b.right) : undefined,
              backgroundColor: b.bgColor || '#7b6bb5',
              opacity: b.opacity,
              zIndex: 0,
            }}
          />
        ))}

        {mostrarBandeira && (
          <>
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
          </>
        )}

        {/* Desktop/tablet com altura suficiente: círculo (layout original).
            Celular ou tela baixa: cartão arredondado com altura automática. */}
        <div
          className={
            isCircle
              ? 'relative z-20 bg-[#e8f0fe] rounded-full flex items-center justify-center flex-shrink-0'
              : 'relative z-20 w-[min(100%,440px)] bg-[#e8f0fe] rounded-[32px] px-6 pb-8 pt-8 flex items-center justify-center shadow-[0_20px_50px_-15px_rgba(42,42,114,0.45)]'
          }
          style={
            isCircle ? { width: circleSize, height: circleSize } : undefined
          }
        >
          <div
            className={`flex flex-col items-center gap-4 relative ${
              isCircle ? 'w-[70%] pt-5' : 'w-full'
            }`}
          >
            {/* No círculo a logo "sai" por cima; no cartão ela fica no fluxo */}
            <img
              className={
                isCircle
                  ? 'h-auto w-[100px] absolute -top-[60px]'
                  : 'h-auto w-[84px]'
              }
              alt="Logo EPOL"
              src={LogoEpol}
            />

            <h1 className="text-[#2d2d6b] font-bold text-center text-[20px] sm:text-[22px] leading-tight">
              {isResetStep
                ? 'Defina sua nova senha!'
                : veioDoPerfil
                  ? 'Altere sua senha!'
                  : 'Recupere sua senha!'}
            </h1>

            {isResetStep ? (
              <div className="flex flex-col gap-2 w-full">
                <Textbox
                  showToggle
                  type="password"
                  placeholder="Nova senha"
                  value={novaSenha}
                  onChange={handleNovaSenhaChange}
                />
                <Textbox
                  showToggle
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmarSenha}
                  onChange={handleConfirmarSenhaChange}
                />
                {showError && (
                  <p
                    role="alert"
                    className="text-red-500 text-[12px] sm:text-[10px] font-semibold text-center"
                  >
                    {errorMessage}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <Textbox
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                >
                  Digite seu E-mail
                </Textbox>
                {showError && (
                  <p
                    role="alert"
                    className="text-red-500 text-[12px] sm:text-[10px] font-semibold text-center"
                  >
                    {errorMessage}
                  </p>
                )}
              </div>
            )}

            <Botao onClick={isResetStep ? handleResetPassword : handleRecover}>
              {isResetStep
                ? 'REDEFINIR SENHA'
                : veioDoPerfil
                  ? 'ENVIAR LINK PARA ALTERAR SENHA'
                  : 'ENVIAR LINK DE RECUPERAÇÃO'}
            </Botao>

            <Voltar
              onClick={() => navigate(veioDoPerfil ? '/perfil' : '/login')}
            >
              Voltar
            </Voltar>
          </div>
        </div>
      </section>
      <Footer />
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-[32px] bg-white p-6 text-[#2d2d6b] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.45)]">
            <div className="mt-8 text-center">
              <p className="text-lg font-bold">
                {isResetStep
                  ? 'Senha redefinida!'
                  : veioDoPerfil
                    ? 'Link enviado'
                    : 'Recuperação iniciada'}
              </p>
              <p className="mt-4 text-base leading-7 text-[#7b6bb5]">
                {isResetStep ? (
                  'Sua senha foi alterada com sucesso. Você já pode fazer login normalmente.'
                ) : (
                  <>
                    {veioDoPerfil
                      ? 'Enviamos um link para alterar sua senha para o e-mail: '
                      : 'Um link de recuperação foi enviado para o e-mail: '}
                    <strong className="break-all">{email}</strong>
                  </>
                )}
              </p>
              {!isResetStep && (
                <p className="mt-3 text-xs leading-5 text-gray-400">
                  Verifique também a caixa de spam ou lixo eletrônico.
                </p>
              )}
              <div className="mt-6 flex justify-center">
                <Confirmar onClick={handleModalConfirm}>OK</Confirmar>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecuperarSenha;