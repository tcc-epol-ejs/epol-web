import "./recuperarsenha.css";
import Botao from "../../components/botao";
import efeitoTras from "../../assets/efeitotras.png";
import losango from "../../assets/losango.png";
import efeitoFrente from "../../assets/efeitofrente.png";

function RecuperarSenha() {
  return (
    <div className="recuperar-page">
      <div className="recuperar-stage">
        <img
          src={efeitoTras}
          alt="efeito traseiro"
          className="recuperar-layer"
        />
        <img src={losango} alt="losango" className="recuperar-layer" />

        <div className="recuperar-content">
          <h1 className="recuperar-title">Recuperar Senha</h1>
          <input
            type="text"
            placeholder="Email ou usuário"
            className="recuperar-input"
          />
          <Botao type="button">Enviar código</Botao>
        </div>

        <img
          src={efeitoFrente}
          alt="efeito frente"
          className="recuperar-layer"
        />
      </div>
    </div>
  );
}

export default RecuperarSenha;
