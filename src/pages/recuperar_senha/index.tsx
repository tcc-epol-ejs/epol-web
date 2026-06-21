import { ChangeEvent, useState } from 'react';
import Textbox from '../../components/textboxes/textboxRecuperar';
import Botao from '../../components/botoes/botaoRecuperar';
import Confirmar from '../../components/botoes/botaoRecuperar/confirmar';
import efeitoTras from '../../assets/Imagens/efeitotras.png';
import losango from '../../assets/Imagens/losango.png';
import efeitoFrente from '../../assets/Imagens/efeitofrente.png';
import Voltar from '../../components/botoes/botaoRecuperar/voltar';
import { useNavigate } from 'react-router-dom';

type RecuperarSenhaProps = {
  onSuccess?: () => void;
};

function RecuperarSenha({ onSuccess }: RecuperarSenhaProps) {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    setShowError(false);
  }

  function handleRecover() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setShowError(true);
      return;
    }
    setShowModal(true);
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center p-5 bg-[#eaf6ff]">
      <div className="h-screen w-screen flex items-center justify-center">
        <img
          src={efeitoTras}
          alt="efeito traseiro"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          src={losango}
          alt="losango"
          className="absolute inset-0 w-full h-full object-contain"
        />

        <div className="relative z-20 flex flex-col items-center gap-4 w-[min(700px,92vw)] -mt-20">
          <h1 className="m-0 mb-[3px] text-[3rem] text-[#4141a8] font-bold">
            RECUPERAR SENHA
          </h1>
          <Textbox type="email" value={email} onChange={handleEmailChange}>
            Digite seu E-mail
          </Textbox>
          {showError && (
            <p className="text-red-500 text-sm font-semibold">
              Por favor, insira um email válido
            </p>
          )}
          <Botao onClick={handleRecover}>ENVIAR CÓDIGO</Botao>
          <Voltar onClick={() => navigate('/login')}>Voltar</Voltar>
        </div>

        <img
          src={efeitoFrente}
          alt="efeito frente"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-6 text-[#1f2a52] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.45)]">
            <div className="mt-8 text-center">
              <p className="text-lg font-bold">Recuperação iniciada</p>
              <p className="mt-4 text-base leading-7 text-[#4d5176]">
                Um link de recuperação foi enviado para o email{' '}
                {<strong>{email}</strong>}
              </p>
              <div className="mt-6 flex justify-center">
                <Confirmar
                  onClick={() => {
                    setShowModal(false);
                    setEmail('');
                    if (onSuccess) {
                      onSuccess();
                    }
                  }}
                >
                  OK
                </Confirmar>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecuperarSenha;
