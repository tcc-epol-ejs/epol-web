import Input from '../../components/Input';
import Bolas from '../../components/bolas';

function Cadastro() {
  return (
    <section className="w-full min-h-[100dvh] bg-[#2a2a72] flex items-center justify-center overflow-hidden relative">
      <div className="absolute w-[545px] h-[496px] left-[445px] top-[108px] bg-[#2a2a72] rounded-full"></div>
      <div
        style={{
          position: 'absolute',
          left: 730,
          top: 0,
          width: '50%',
          height: '100%',
          backgroundColor: '#FFA400',
          clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
        }}
      ></div>
      <Bolas />
      <Bolas className="left-[-20px] top-[270px]" />
      <Bolas className="left-[-20px] top-[1000px]" />
      <Bolas className="right-[-100px] top-[800px]" />
      <div className="absolute w-[140px] h-[140px] left-[149.85px] top-[534.7px] bg-[rgba(136,136,211,0.83)] rounded-full rotate-[118.19deg]"></div>

      <div
        style={{
          position: 'absolute',
          right: 730,
          top: 0,
          width: '50%',
          height: '100%',
          backgroundColor: '#FFA400',
          clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
        }}
      ></div>
      <div className="absolute w-[600px] h-[600px] left-[415px]  top-[85px] bg-[#2a2a72] rounded-full"></div>
      <div className="absolute w-[456.42px] h-[433px] right-[-227.17px] top-[200px] rotate-[118.19deg]"></div>

      <div
        className="relative z-50 flex flex-col items-center gap-6 w-[300px]"
        style={{ transform: 'scale(1.3)' }}
      >
        <img
          className="w-30 h-auto max-w-[100px]"
          alt="Logo EPOL"
          src="/img/logoepol.png"
        />
        <h1 className="text-[#FFA400] text-[35px] font-bold">CADASTRE-SE!!</h1>

        <div className="flex flex-col gap-4 w-full">
          <Input placeholder="Email" />
          <Input placeholder="Nome do Usuário" />
          <Input placeholder="Senha" />
        </div>

        <button
          className="w-[250px] h-[40px] rounded-full bg-[#FFA400] text-[18px] outline-none border-none focus:outline-none cursor-pointer"
          style={{ color: 'white' }}
        >
          CADASTRAR
        </button>

        <p className="text-white text-sm" style={{ color: 'white' }}>
          Já tem uma conta?{' '}
          <span className="text-[#A9A9F6] font-thin cursor-pointer">
            Entrar
          </span>
        </p>
      </div>
    </section>
  );
}

export default Cadastro;
