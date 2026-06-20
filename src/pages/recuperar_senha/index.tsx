import { ChangeEvent, useState } from 'react';
import Textbox from '../../components/textboxes/textboxRecuperar';
import Botao from '../../components/botoes/botaoRecuperar';
import efeitoTras from '../../assets/Imagens/efeitotras.png';
import losango from '../../assets/Imagens/losango.png';
import efeitoFrente from '../../assets/Imagens/efeitofrente.png';
import Voltar from '../../components/botoes/botaoRecuperar/voltar';

function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handleRecover() {
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
          <Textbox value={email} onChange={handleEmailChange}>
            Digite seu E-mail
          </Textbox>
          <Botao onClick={handleRecover}>ENVIAR CÓDIGO</Botao>
          <Voltar>Voltar</Voltar>
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
                Um link de recuperação foi enviado para o email
              </p>
              <p className="mt-3 break-words font-semibold text-[#2a2a72]">
                {email || 'seu e-mail'}
              </p>
              <Voltar
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 px-4 py-2 text-[12px] uppercase"
              >
                Voltar
              </Voltar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecuperarSenha;
