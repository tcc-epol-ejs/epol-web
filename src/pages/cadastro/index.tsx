import Input from "../../components/Input";

function Cadastro() {
  return (
    <section className="w-full h-dvh bg-[#2a2a72] flex items-center justify-center overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-white rounded-full"></div>
      <div className="absolute w-[545px] h-[496px] left-[445px] top-[108px] bg-[#2a2a72] rounded-full"></div>
      <div
        style={{
          position: "absolute",
          left: 730,
          top: 0,
          width: "50%",
          height: "100%",
          backgroundColor: "#FFA400",
          clipPath: "polygon(0 0, 100% 50%, 0 100%)",
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          right: 730,
          top: 0,
          width: "50%",
          height: "100%",
          backgroundColor: "#FFA400",
          clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
        }}
      ></div>
      <div className="absolute w-[545px] h-[496px] left-[450px] top-[108px] bg-[#2a2a72] rounded-full"></div>
      <div className="absolute w-[456.42px] h-[433px] right-[-227.17px] top-[200px] rotate-[118.19deg]">
        <div className="absolute w-[197px] h-[197px] left-[-104.62px] top-[339px] bg-[#8888D3] rounded-full rotate-[118.19deg]"></div>

        <div className="absolute w-[346.2px] h-[315.95px] left-[-162px] top-[470px] bg-[rgba(136,136,211,0.81)] rounded-full rotate-[117.81deg]"></div>

        <div className="absolute w-[140px] h-[140px] left-[149.85px] top-[534.7px] bg-[rgba(136,136,211,0.83)] rounded-full rotate-[118.19deg]"></div>
      </div>
      {/* Formulário - sempre na frente de tudo */}
      <div className="relative z-60 ..."></div>

      <div
        className="relative z-60 flex flex-col items-center gap-4 w-[300px]"
        style={{ transform: "scale(1.3)" }}
      >
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

        <button
          className="w-[200px] rounded-full bg-[#FFA400] font-bold py-8 text-[18px] outline-none border-none focus:outline-none focus:ring-0"
          style={{ color: "white" }}
        >
          CADASTRAR
        </button>

        <p className="text-white text-sm" style={{ color: "white" }}>
          Já tem uma conta?{" "}
          <span className="text-[#A9A9F6] cursor-pointer">Entrar</span>
        </p>
      </div>
    </section>
  );
}

export default Cadastro;
