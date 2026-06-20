import { ChangeEvent, useState } from 'react';
import Textbox from '../../components/textboxes/textboxRecuperar';
import Botao from '../../components/botoes/botaoRecuperar';
import efeitoTras from '../../assets/Imagens/efeitotras.png';
import losango from '../../assets/Imagens/losango.png';
import efeitoFrente from '../../assets/Imagens/efeitofrente.png';

function RecuperarSenha() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    setShowError(false);
  }

  function handleConfirmPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(event.target.value);
    setShowError(false);
  }

  function handleSave() {
    if (!password || !confirmPassword || password !== confirmPassword) {
      setShowError(true);
      return;
    }
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
          <Textbox
            type="password"
            value={password}
            onChange={handlePasswordChange}
          >
            Nova senha
          </Textbox>
          <Textbox
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          >
            Confirme a senha
          </Textbox>
          {showError && (
            <p className="text-red-500 text-sm font-semibold text-center">
              As senhas devem ser iguais e não podem ficar vazias.
            </p>
          )}
          <Botao onClick={handleSave}>SALVAR SENHA</Botao>
        </div>

        <img
          src={efeitoFrente}
          alt="efeito frente"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default RecuperarSenha;
