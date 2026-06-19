import Textbox from '../../components/textboxes/textboxRecuperar';
import Botao from '../../components/botoes/botaoRecuperar';
import efeitoTras from '../../assets/efeitotras.png';
import losango from '../../assets/losango.png';
import efeitoFrente from '../../assets/efeitofrente.png';
import Voltar from '../../components/botoes/botaoRecuperar/voltar';

function RecuperarSenha() {
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
          <Textbox>Digite seu E-mail</Textbox>
          <Botao>ENVIAR CÓDIGO</Botao>
          <Voltar>Voltar</Voltar>
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
