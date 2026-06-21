import { useNavigate } from 'react-router-dom';
import Textbox from '../../components/textboxes/textbox';
import Botao from '../../components/botoes/botao';

const bolasConfig = [
  { size: 280, top: '-40px', left: '-30px', opacity: 1 },
  { size: 160, top: '20px', left: '220px', opacity: 0.6 },
  { size: 100, top: '160px', left: '30px', opacity: 0.75 },
  {
    size: 240,
    top: '-50px',
    right: '-30px',
    opacity: 1,
    bgColor: '#FFA400',
  },
  { size: 150, top: '60px', right: '220px', opacity: 0.5, bgColor: '#FFA400' },
  { size: 80, top: '10px', right: '180px', opacity: 0.7, bgColor: '#FFA400' },
  {
    size: 260,
    bottom: '-50px',
    left: '-40px',
    opacity: 1,
    bgColor: '#FFA400',
  },
  {
    size: 120,
    bottom: '-20px',
    left: '190px',
    opacity: 0.7,
    bgColor: '#FFA400',
  },
  { size: 300, bottom: '-60px', right: '-40px', opacity: 1 },
  { size: 160, bottom: '120px', right: '200px', opacity: 0.6 },
];

export default function Login() {
  const circleSize = 'min(580px, 75vw, 75dvh)';
  const gap = '20px';
  const navigate = useNavigate();

  return (
    <div>
      <section className="w-full min-h-[100dvh] bg-[#e8f0fe] flex items-center justify-center overflow-hidden relative">
        {bolasConfig.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              top: 'top' in b ? b.top : undefined,
              bottom: 'bottom' in b ? b.bottom : undefined,
              left: 'left' in b ? b.left : undefined,
              right: 'right' in b ? b.right : undefined,
              backgroundColor: b.bgColor || '#7b6bb5',
              opacity: b.opacity,
              zIndex: 0,
            }}
          />
        ))}

        <div
          className="absolute inset-y-0 left-0 z-10"
          style={{
            width: '50vw',
            backgroundColor: '#FFA400',
            clipPath: `polygon(0% 50%, 100% 0%, calc(100% - ${gap}) 50%, 100% 100%)`,
          }}
        />

        <div
          className="absolute inset-y-0 right-0 z-10"
          style={{
            width: '50vw',
            backgroundColor: '#FFA400',
            clipPath: `polygon(${gap} 0%, 100% 50%, ${gap} 100%, 0% 50%)`,
          }}
        />

        <div
          className="relative z-20 bg-[#e8f0fe] rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: circleSize, height: circleSize }}
        >
          <div className="flex flex-col items-center gap-4 w-[70%] pt-5 relative">
            <img
              className="h-auto w-[100px] absolute -top-[60px]"
              alt="Logo EPOL"
              src="/LogoEPOLPreta.png"
            />

            <h1 className="text-[#2d2d6b] font-bold text-center text-[22px] leading-tight">
              Bem-vindo de volta!
            </h1>

            <div className="flex flex-col gap-4 w-full">
              <Textbox placeholder="Nome de usuário ou Email" />
              <Textbox showToggle type="password" placeholder="Senha" />
            </div>

            <Botao bgColor="#2d2d6b" textColor="#fff">
              entrar
            </Botao>

            <p
              className="text-[#2d2d6b] text-center cursor-pointer hover:underline"
              style={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
              onClick={() => navigate('/recuperar-senha')}
            >
              Esqueceu a senha?
            </p>

            <p
              className="text-[#7b6bb5] text-center"
              style={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
            >
              Não tem uma conta?{' '}
              <span
                onClick={() => navigate('/cadastro')}
                className="text-[#2d2d8b] font-semibold cursor-pointer hover:underline"
              >
                Cadastre-se
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* <footer className="w-full bg-[#2d2d6b] text-white py-96 px-24 flex gap-76">
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
      </footer> */}
    </div>
  );
}
