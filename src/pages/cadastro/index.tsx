import Input from "../../components/Input";

function Cadastro() {
  return (
    <section className="w-full h-dvh bg-[#2a2a72] flex items-center justify-center overflow-hidden relative">
      {/* Losango amarelo */}
      <div className="absolute w-[600px] h-[600px] bg-[#FFA400] rotate-45"></div>

      {/* Conteúdo centralizado */}
      <div className="relative z-10 flex flex-col items-center gap-4 w-[300px]">
        <img
          className="w-20 h-auto"
          alt="Logo EPOL"
          src="/img/LogoEPOLPreta.png"
        />

        <p className="text-[#FFA400] font-bold text-xl tracking-widest">
          CADASTRE-SE!!
        </p>

        <Input placeholder="Email" />
        <Input placeholder="Nome Completo" />
        <Input placeholder="Nome do Usuário" />

        <button className="w-full rounded-full bg-[#FFA400] text-white font-bold py-2 text-[15px]">
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
