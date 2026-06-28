export default function Footer() {
  return (
    <footer className="w-full min-h-128 bg-[#2d2d6b] text-white py-24 px-8 md:py-36 md:px-16 lg:px-24 flex flex-col md:flex-row gap-10 md:gap-24 lg:gap-76">
      <div className="flex flex-col gap-3">
        <p className="font-bold text-xl md:text-2xl">EPOL</p>
        <p className="text-gray-300 text-lg md:text-2xl">
          Política que faz sentido pra você.
          <br />
          Informação clara para quem vai mudar o Brasil.
        </p>

        <div className="flex items-center gap-2 mt-6">
          <img
            className="w-6 md:w-8 h-auto"
            alt="Logo Insta"
            src="/src/assets/Imagens/Logos/LogoInstaBranca.png"
          />
          <span className="text-lg md:text-2xl">epol.tcc</span>
        </div>

        <div className="flex items-center gap-2">
          <img
            className="w-6 md:w-8 h-auto"
            alt="Logo Email"
            src="/src/assets/Imagens/Logos/LogoEmailBranca.png"
          />
          <span className="text-lg md:text-2xl">epol@gmail.com</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xl md:text-2xl mb-3">EXPLORAR</p>
        <p className="text-lg md:text-2xl text-gray-300">Página Inicial</p>
        <p className="text-lg md:text-2xl text-gray-300">SearchPol</p>
        <p className="text-lg md:text-2xl text-gray-300">Visualizador</p>
        <p className="text-lg md:text-2xl text-gray-300">Urna</p>
        <p className="text-lg md:text-2xl whitespace-nowrap text-gray-300">
          Título de Eleitor
        </p>
      </div>
    </footer>
  );
}
