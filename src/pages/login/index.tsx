import Textbox from "../../components/textboxes/textbox";
import Botao from "../../components/botoes/botao";

export default function Login() {
  return (
    <div>
      <section className="min-h-screen w-full bg-[#e8f0fe] flex flex-col items-center overflow-hidden justify-center relative">
        <div className="h-screen w-screen flex items-center justify-center p-5 bg-[#eaf6ff]">
          <div className="h-screen w-screen flex items-center justify-center">
            <img
              src="/efeitotras.png"
              alt="efeito traseiro"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <img
              src="/losango.png"
              alt="losango"
              className="absolute inset-0 w-full h-full object-contain z-0"
            />

            <div className="flex flex-col items-center gap-4 z-10 relative">
              <img
                className="w-50 h-auto"
                alt="Logo EPOL"
                src="/LogoEPOLPreta.png"
              />
              <h1 className="text-[#2d2d6b] font-bold text-6xl tracking-wide mb-0.5">
                SEJA BEM VINDO!!
              </h1>
              <Textbox placeholder="Nome de usuário ou Email" />
              <Textbox placeholder="Senha" />
              <Botao bgColor="#2d2d6b" textColor="#ffffff">
                CONTINUAR
              </Botao>
              <p className="text-[#2d2d6b] text-2xl">Esqueceu a senha?</p>
              <p className="text-[#7b6bb5] text-2xl">
                Não tem uma conta?&nbsp;
                <span className="text-[#2d2d8b] font-bold cursor-pointer">
                  Cadastre-se
                </span>
              </p>
            </div>

            <img
              src="/efeitofrente.png"
              alt="efeito frente"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          </div>
        </div>
      </section>

      <footer className="w-full bg-[#2d2d6b] text-white py-96 px-24 flex gap-76">
        <div className="flex flex-col gap-3">
          <p className="font-bold text-2xl">EPOL</p>
          <p className="text-gray-300 text-2xl">
            Política que faz sentido pra você.
            <br />
            Informação clara para quem vai mudar o Brasil.
            <br />
            <br />
            <br />
            <br />
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-auto mb-8"
                alt="Logo Insta"
                src="/LogoInstaBranca.png"
              />
              <span>
                epol.tcc
                <p>
                  <br />
                </p>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-auto"
                alt="Logo Email"
                src="/LogoEmailBranca.png"
              />
              <span>epol@gmail.com</span>
            </div>
          </p>
        </div>

        <div className="flex flex-col gap-3 mr-150">
          <p className="text-2xl w-40 mb-3">EXPLORAR</p>
          <p className="text-2xl mt-3 text-gray-300">Página Inicial</p>
          <p className="text-2xl mt-3 text-gray-300">SearchPol</p>
          <p className="text-2xl mt-3 text-gray-300">Visualizador</p>
          <p className="text-2xl mt-3 text-gray-300">Urna</p>
          <p className="text-2xl mt-3 whitespace-nowrap text-gray-300">
            Título de Eleitor
          </p>
        </div>
      </footer>
    </div>
  );
}
