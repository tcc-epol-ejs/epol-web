import Footer from '../../components/footer/footer';
import Header from '../../components/header';
import { FaScaleBalanced } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';
import { TbAccessibleFilled } from 'react-icons/tb';
import CardQuemSomos from '../../components/cardQuemSomos/cardQuemSomos';
import PipoMascote from '../../assets/Imagens/Pipos/Pipo_Pipo_NB_EDIT.png';
import PipoDiogo from '../../assets/Imagens/Pipos/Pipo_Diogo_NB.png';
import PipoEmanu from '../../assets/Imagens/Pipos/Pipo_Emanuela_NB.png';
import PipoGui from '../../assets/Imagens/Pipos/Pipo_Guilherme_NB.png';
import PipoMika from '../../assets/Imagens/Pipos/Pipo_Mikaela_NB.png';
import PipoNico from '../../assets/Imagens/Pipos/Pipo_Nicolas_NB.png';
import PipoRicardo from '../../assets/Imagens/Pipos/Pipo_Ricardo_NB.png';
import PipoSabrina from '../../assets/Imagens/Pipos/Pipo_Sabrina_NB.png';
import PerfilDiogo from '../../assets/Imagens/Perfis/Perfil_Diogo_ND.jpeg';
import PerfilEmanu from '../../assets/Imagens/Perfis/Perfil_Emanuela_ND.jpeg';
import PerfilGui from '../../assets/Imagens/Perfis/Perfil_Guilherme_ND.jpeg';
import PerfilMika from '../../assets/Imagens/Perfis/Perfil_Mikaela_ND.jpeg';
import PerfilNico from '../../assets/Imagens/Perfis/Perfil_Nicolas_ND.jpeg';
import PerfilRicardo from '../../assets/Imagens/Perfis/Perfil_Ricardo_ND.jpeg';
import PerfilSabrina from '../../assets/Imagens/Perfis/Perfil_Sabrina_ND.jpeg';

const membros = [
  {
    nome: 'Diogo',
    cargo: 'Gerenciador do Banco de Dados',
    descricao:
      '"O Epol é a prova da que a informação é ferramenta de mudança."',
    imagem: PipoDiogo,
    fotoPerfil: PerfilDiogo,
  },
  {
    nome: 'Emanuella',
    cargo: 'Desenvolvedora Full-Stack',
    descricao:
      '"Para mim o Epol demonstra que a política é o principal passo para mudar a realidade."',
    imagem: PipoEmanu,
    fotoPerfil: PerfilEmanu,
  },
  {
    nome: 'Guilherme',
    cargo: 'Desenvolvedor Full-Stack',
    descricao:
      '"O Epol é o primeiro site que une informação e inovação de forma séria mas também atrativa."',
    imagem: PipoGui,
    fotoPerfil: PerfilGui,
  },
  {
    nome: 'Mikaela',
    cargo: 'Desenvolvedora Full-Stack',
    descricao: '"Epol é uma forma jovem de descobrir a política."',
    imagem: PipoMika,
    fotoPerfil: PerfilMika,
  },
  {
    nome: 'Nicolas',
    cargo: 'Desenvolvedor Full-Stack',
    descricao:
      '"O Epol tem a missão aproximar os jovens à política brasileira."',
    imagem: PipoNico,
    fotoPerfil: PerfilNico,
  },
  {
    nome: 'Ricardo',
    cargo: 'Desenvolvedor Full-Stack',
    descricao:
      '"O Epol tem potencial para educar milhares de jovens politicamente."',
    imagem: PipoRicardo,
    fotoPerfil: PerfilRicardo,
  },
  {
    nome: 'Sabrina',
    cargo: 'Documentação e Design',
    descricao: '"Acredito que o Epol simplifica a política para o dia a dia."',
    imagem: PipoSabrina,
    fotoPerfil: PerfilSabrina,
  },
];

function QuemSomos() {
  return (
    <>
      <div className="fixed top-0 z-[1000] w-full">
        <Header />
      </div>

      <main>
        <section className="flex w-full flex-col items-center gap-8 bg-[#e8f0fe] px-4 pb-12 pt-24 sm:px-8 md:pt-[135px] xl:min-h-[100dvh] xl:flex-row xl:gap-8 xl:px-12 xl:pt-[155px] 2xl:px-16">
          <h1 className="flex flex-col gap-1 self-start text-[clamp(2rem,7vw,3rem)] font-black uppercase leading-tight text-black xl:shrink-0 xl:self-center">
            <span>CONHEÇA</span>
            <span className="text-[#FFA400]">A EQUIPE</span>
            <span className="border-b-4 border-black pb-2">EPOL</span>
          </h1>

          <div className="grid w-full min-w-0 max-w-[896px] grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 xl:mx-auto xl:flex xl:flex-col">
            <div className="contents xl:flex xl:justify-center xl:gap-4">
              {membros.slice(0, 3).map((membro) => (
                <CardQuemSomos key={membro.nome} {...membro} />
              ))}
            </div>
            <div className="contents xl:flex xl:justify-center xl:gap-4">
              {membros.slice(3).map((membro) => (
                <CardQuemSomos key={membro.nome} {...membro} />
              ))}
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col bg-[#FFA400] lg:min-h-[100dvh] lg:flex-row">
          <div className="order-last flex h-[clamp(11rem,55vw,22rem)] w-full items-end justify-center overflow-hidden lg:order-first lg:h-auto lg:w-1/3 lg:justify-start">
            <img
              src={PipoMascote}
              alt="Pipo, mascote do EPOL"
              className="h-full w-full object-contain object-bottom lg:-ml-12 lg:h-[min(90dvh,52rem)] lg:w-auto lg:max-w-none lg:origin-bottom-left lg:rotate-[15deg]"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-6 px-4 pb-6 pt-12 sm:px-8 lg:gap-8 lg:py-16 lg:pr-16">
            <h2 className="text-[clamp(3rem,9vw,6rem)] font-black uppercase tracking-wider text-[#2A2A72]">
              PIPO
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-l-4 border-[#2A2A72] pl-4">
                <p className="text-[#2A2A72] font-black text-xl uppercase tracking-wider">
                  De onde eu vim?
                </p>
                <p className="text-white text-base leading-7 font-semibold">
                  Surgi de um conjunto de ideias da minha equipe para
                  representar o EPOL em uma figura afetiva para o projeto. Da
                  necessidade de ter um mascote para ilustrar tudo isso, uniram
                  uma lupa a algo bem mais caricato e expressivo... e assim
                  nasci eu, o PIPO!
                </p>
              </div>

              <div className="flex flex-col gap-2 border-l-4 border-[#2A2A72] pl-4">
                <p className="text-[#2A2A72] font-black text-xl uppercase tracking-wider">
                  Quais são meus ideais?
                </p>
                <ul className="flex flex-col gap-1">
                  <li className="text-white text-base leading-6 font-semibold">
                    <span className="text-[#2A2A72] font-black">
                      Curiosidade:
                    </span>{' '}
                    Investigar os fatos sem preconceitos, buscando respostas
                    claras e diretas.
                  </li>
                  <li className="text-white text-base leading-6 font-semibold">
                    <span className="text-[#2A2A72] font-black">
                      Acessibilidade:
                    </span>{' '}
                    Traduzir a linguagem difícil da política em algo simples e
                    fácil de entender.
                  </li>
                  <li className="text-white text-base leading-6 font-semibold">
                    <span className="text-[#2A2A72] font-black">
                      Protagonismo jovem:
                    </span>{' '}
                    A juventude tem voz ativa e a participação política vai além
                    do voto.
                  </li>
                  <li className="text-white text-base leading-6 font-semibold">
                    <span className="text-[#2A2A72] font-black">
                      Transparência:
                    </span>{' '}
                    Iluminar o que está escondido para que todos enxerguem a
                    realidade com clareza.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-1 border-l-4 border-[#2A2A72] pl-4">
                <p className="text-[#2A2A72] font-black text-xl uppercase tracking-wider">
                  Qual a minha missão
                </p>
                <p className="text-white text-base leading-7 font-semibold">
                  Minha missão é chamar a atenção dos jovens para o projeto EPOL
                  e mostrar que a política pode, sim, ser acessível e
                  interessante. Acredito que esse engajamento é fundamental para
                  o futuro do nosso país. Por isso, unir e atrair as pessoas
                  para essa conversa é o meu grande objetivo!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid w-full grid-cols-1 content-center gap-10 bg-[#e8f0fe] px-4 py-12 sm:px-8 lg:min-h-[100dvh] lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-16">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="w-fit rounded-lg bg-[#FFA400] px-4 py-3 sm:px-6">
              <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-black uppercase tracking-wider text-[#2A2A72]">
                QUEM SOMOS ?
              </h2>
            </div>
            <div className="rounded-2xl bg-[#2A2A72] p-5 sm:p-8">
              <p className="text-base font-semibold leading-7 text-white lg:text-lg lg:leading-8">
                Sabe aquela sensação de não entender nada quando o assunto é
                política? A gente também já passou por isso e percebeu algo
                comum entre os jovens: o tema é pouco discutido, e mesmo já
                tendo idade pra votar, boa parte de nós não sabe ao certo pra
                que serve cada cargo. Foi dessa percepção que o EPOL nasceu: um
                espaço pra entender de verdade o que acontece no país, quem são
                os candidatos e o que cada partido defende — de forma simples,
                sem abrir mão da credibilidade.
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
            <h2 className="text-[clamp(2rem,7vw,3rem)] font-black tracking-wider text-[#FFA400]">
              VALORES
            </h2>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-[#a9a9f6] bg-[#d0d0f0] sm:h-16 sm:w-16">
                <FaScaleBalanced size={28} className="text-[#2A2A72]" />
              </div>
              <div>
                <p className="text-[#2A2A72] font-black text-lg underline">
                  Imparcialidade
                </p>
                <p className="text-[#333] text-sm mt-1">
                  Apresentar os fatos sem viés político, deixando você formar
                  sua própria opinião
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-[#a9a9f6] bg-[#d0d0f0] sm:h-16 sm:w-16">
                <MdVerified size={28} className="text-[#2A2A72]" />
              </div>
              <div>
                <p className="text-[#2A2A72] font-black text-lg underline">
                  Credibilidade
                </p>
                <p className="text-[#333] text-sm mt-1">
                  Informação verificada, com fontes confiáveis por trás de cada
                  conteúdo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-[#a9a9f6] bg-[#d0d0f0] sm:h-16 sm:w-16">
                <TbAccessibleFilled size={28} className="text-[#2A2A72]" />
              </div>
              <div>
                <p className="text-[#2A2A72] font-black text-lg underline">
                  Acessibilidade
                </p>
                <p className="text-[#333] text-sm mt-1">
                  Política pra todo mundo entender, não só pra quem já manja do
                  assunto
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default QuemSomos;
