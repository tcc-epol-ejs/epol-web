import Input from "../../components/input";

export default function Login() {
  return (
    <div>
      <section className="min-h-screen w-full bg-[#e8f0fe] flex flex-col items-center overflow-hidden justify-center relative">
        <div className="flex flex-col items-center gap-4">
          <img
            className="w-50 h-auto"
            alt="Logo EPOL"
            src="/LogoEPOLPreta.png"
          />
          <h1 className="text-[#2d2d6b] font-bold text-6xl tracking-wide mb-0.5">
            SEJA BEM VINDO!!
          </h1>
          <Input placeholder="Nome de usuário ou Email" />
          <Input placeholder="Senha" />
          <button className="w-100 py-5 rounded-full bg-[#2d2d6b] text-white tracking-widest mt-3 text-2xl">
            CONTINUAR
          </button>
          <p className="text-[#2d2d6b] text-2xl">Esqueceu a senha?</p>
          <p className="text-[#7b6bb5] text-2xl">
            Não tem uma conta?&nbsp;
            <span className="text-[#2d2d8b] font-bold cursor-pointer">
              Cadastre-se
            </span>
          </p>
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
        <div className="w-full border-t border-gray-500 mt-10 pt-4 flex gap-6 text-gray-400 text-sm">
          <span>© 2026 EPOL</span>
          <span>Trabalho de Conclusão de Curso</span>
          <span>Uso não comercial</span>
        </div>
      </footer>
    </div>
  );
}
