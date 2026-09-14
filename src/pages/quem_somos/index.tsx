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
    nome: 'Emanuela',
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
    nome: 'Mikaella',
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
      <div className="w-full fixed top-0 z-[1000]">
        <Header />
      </div>

      <section className="w-full h-[100dvh]">
        <div className="w-full h-full bg-[#e8f0fe] flex items-center justify-between px-16 gap-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-black font-black uppercase text-5xl leading-tight">
              CONHEÇA
            </h2>
            <h2 className="text-[#FFA400] font-black uppercase text-5xl leading-tight">
              A EQUIPE
            </h2>
            <h2 className="text-black font-black uppercase text-5xl leading-tight border-b-4 border-black pb-2">
              EPOL
            </h2>
          </div>

          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="flex gap-4 justify-center">
              {membros.slice(0, 3).map((membro, i) => (
                <CardQuemSomos
                  key={i}
                  nome={membro.nome}
                  cargo={membro.cargo}
                  descricao={membro.descricao}
                  imagem={membro.imagem}
                  fotoPerfil={membro.fotoPerfil}
                />
              ))}
            </div>
            <div className="flex gap-4 justify-center">
              {membros.slice(3).map((membro, i) => (
                <CardQuemSomos
                  key={i + 3}
                  nome={membro.nome}
                  cargo={membro.cargo}
                  descricao={membro.descricao}
                  imagem={membro.imagem}
                  fotoPerfil={membro.fotoPerfil}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full h-full bg-[#FFA400] flex">
          <div className="w-[33%] h-full flex items-end overflow-hidden">
            <img
              src={PipoMascote}
              alt="Pipo, mascote do EPOL"
              className="h-[90%] object-contain -ml-12"
              style={{
                transform: 'rotate(15deg)',
                transformOrigin: 'bottom left',
              }}
            />
          </div>

          <div className="flex-1 flex flex-col justify-center gap-8 pr-16 pl-8">
            <h2 className="text-[#2A2A72] font-black uppercase text-8xl tracking-wider">
              PIPO
            </h2>

            <div className="flex flex-col gap-4">
              <div className="border-l-4 border-[#2A2A72] pl-4 flex flex-col gap-1">
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

              <div className="border-l-4 border-[#2A2A72] pl-4 flex flex-col gap-2">
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

              <div className="border-l-4 border-[#2A2A72] pl-4 flex flex-col gap-1">
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
        </div>

        <div className="w-full h-full bg-[#e8f0fe] flex items-center justify-between px-16 gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-[#FFA400] px-6 py-3 rounded-lg w-fit">
              <h1 className="text-[#2A2A72] font-black uppercase text-4xl tracking-wider">
                QUEM SOMOS ?
              </h1>
            </div>
            <div className="bg-[#2A2A72] rounded-2xl p-8">
              <p className="text-white text-lg leading-8 font-semibold">
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

          <div className="flex-1 flex flex-col gap-8">
            <h2 className="text-[#FFA400] font-black text-5xl tracking-wider">
              VALORES
            </h2>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-[#a9a9f6] bg-[#d0d0f0] flex-shrink-0 flex items-center justify-center">
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
              <div className="w-16 h-16 rounded-full border-4 border-[#a9a9f6] bg-[#d0d0f0] flex-shrink-0 flex items-center justify-center">
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
              <div className="w-16 h-16 rounded-full border-4 border-[#a9a9f6] bg-[#d0d0f0] flex-shrink-0 flex items-center justify-center">
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
        </div>

        <Footer />
      </section>
    </>
  );
}

export default QuemSomos;
