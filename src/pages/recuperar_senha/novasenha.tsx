import { ChangeEvent, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Textbox from '../../components/textboxes/textboxRecuperar';
import Botao from '../../components/botoes/botaoRecuperar';
import efeitoTras from '../../assets/Imagens/efeitotras.png';
import losango from '../../assets/Imagens/losango.png';
import efeitoFrente from '../../assets/Imagens/efeitofrente.png';
import Confirmar from '../../components/botoes/botaoRecuperar/confirmar';

type RecuperarSenhaProps = {
  onSuccess?: () => void;
};

function RecuperarSenha({ onSuccess }: RecuperarSenhaProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    setErrorMessage('');
  }

  function handleConfirmPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(event.target.value);
    setErrorMessage('');
  }

  function handleSave() {
    if (!password || !confirmPassword) {
      setErrorMessage('As senhas não podem ficar vazias.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não são iguais.');
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
            DIGITE SUA SENHA
          </h1>

          <div className="relative w-full max-w-[320px]">
            <Textbox
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className="pr-12"
            >
              Nova senha
            </Textbox>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2a2a72]"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <div className="relative w-full max-w-[320px]">
            <Textbox
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="pr-12"
            >
              Confirme a senha
            </Textbox>
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2a2a72]"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm font-semibold text-center">
              {errorMessage}
            </p>
          )}
          <Botao onClick={handleSave}>ALTERAR SENHA</Botao>
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
              <p className="text-lg font-bold">Senha alterada!</p>
              <p className="mt-4 text-base leading-7 text-[#4d5176]">
                Sua nova senha foi definida. Você será redirecionado para a
                página de login.
              </p>
              <div className="mt-6 flex justify-center">
                <Confirmar
                  onClick={() => {
                    setShowModal(false);
                    setPassword('');
                    setConfirmPassword('');
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
