import { ChangeEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Textbox from '../../components/textboxes/textbox';
import Botao from '../../components/botoes/botao';
import Confirmar from '../../components/botoes/botaoRecuperar/confirmar';
import Voltar from '../../components/botoes/botaoRecuperar/voltar';

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

function RecuperarSenha({ onSuccess }: RecuperarSenhaProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const isResetStep = Boolean(token);

  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

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

  function handleRecover() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setErrorMessage('Por favor, insira um email válido');
      setShowError(true);
      return;
    }
    // TODO: chamar a API pra disparar o e-mail com o link (?token=...)
    setShowModal(true);
  }

  function handleResetPassword() {
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
    // TODO: chamar a API passando { token, novaSenha } pra efetivar a troca
    setShowModal(true);
  }

  function handleModalConfirm() {
    setShowModal(false);
    setEmail('');
    setNovaSenha('');
    setConfirmarSenha('');
    if (isResetStep) {
      navigate('/login');
    } else if (onSuccess) {
      onSuccess();
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
              src="/LogoEPOLPreta.png"
            />

            <h1 className="text-[#2d2d6b] font-bold text-center text-[22px] leading-tight">
              {isResetStep ? 'Defina sua nova senha!' : 'Recupere sua senha!'}
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
                  <p className="text-red-500 text-[10px] font-semibold text-center">
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
                  <p className="text-red-500 text-[10px] font-semibold text-center">
                    {errorMessage}
                  </p>
                )}
              </div>
            )}

            <Botao onClick={isResetStep ? handleResetPassword : handleRecover}>
              {isResetStep ? 'REDEFINIR SENHA' : 'ENVIAR LINK DE RECUPERAÇÃO'}
            </Botao>

            <Voltar onClick={() => navigate('/login')}>Voltar</Voltar>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-6 text-[#2d2d6b] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.45)]">
            <div className="mt-8 text-center">
              <p className="text-lg font-bold">
                {isResetStep ? 'Senha redefinida!' : 'Recuperação iniciada'}
              </p>
              <p className="mt-4 text-base leading-7 text-[#7b6bb5]">
                {isResetStep ? (
                  'Sua senha foi alterada com sucesso. Você já pode fazer login normalmente.'
                ) : (
                  <>
                    Um link de recuperação foi enviado para o e-mail:{' '}
                    <strong>{email}</strong>
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
