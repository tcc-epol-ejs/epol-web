import Input from "../../components/Input";

function Cadastro() {
  return (
    <section className="w-full h-dvh bg-[#2a2a72] flex items-center justify-center overflow-hidden relative">
      <div className="absolute w-[200px] h-[200px] bg-[#FFA400] rotate-45"></div>

      <div className="relative z-60 flex flex-col items-center gap-4 w-[300px]">
        <img
          className="w-16 h-auto max-w-[80px]"
          alt="Logo EPOL"
          src="/img/LogoEPOLPreta.png"
        />

        <p className="text-[#FFA400] font-bold text-xl tracking-widest">
          CADASTRE-SE!!
        </p>

        <Input placeholder="Email" />

        <Input placeholder="Nome Completo" />

        <Input placeholder="Nome do Usuário" />

        <Input placeholder="Senha" />

        <button className="w-full rounded-full bg-[#FFA400] text-white font-bold py-2 text-[15px] rounded-full outline-none border-none outline-none focus:outline-none focus:ring-0">
          CADASTRAR
        </button>

        <p className="text-white text-sm">
          Já tem uma conta?{" "}
          <span className="text-[#FFA400] cursor-pointer">Entrar</span>
        </p>
      </div>
    </section>
  );
}

export default Cadastro;
