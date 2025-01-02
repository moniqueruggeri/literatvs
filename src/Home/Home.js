import Button from "../Button/Button";
import Header from "../Header/Header";
import Historic from "../Historico/Historic";
import "./Home.css";
import lugarFeliz from "../img/lugarfeliz.jpg"
import verity from "../img/verity.jpg"
import deFeriasComVoce from "../img/de-ferias-com-voce.jpg"
import flashForward from "../img/flashforward.jpg"
import NavBar from "../NavBar/NavBar";

const Home = ({ toggleSideBar }) => {
  return (
    <section className="home">
      <Header toggleSideBar={toggleSideBar}/>
      <div className="buttons_header">
        <Button 
          className={"button_news"}
          link={"/"} 
          hasIcon={true} 
          hasText={true}
          icon={"grade"} 
          text={"Novidades"} 
        />
        <Button
          className={"button_gift"}
          link={"/"}
          hasIcon={true}
          hasText={true}
          icon={"card_giftcard"}
          text={"Cortesias"}
        />
      </div>
      <Historic
        cover={lugarFeliz}
        title={"Lugar Feliz"}
        description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra sed maecenas odio fermentum viverra."}
        author={"Emily Henry"}
      />

      <Historic
        cover={verity}
        title={"Verity"}
        description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra sed maecenas odio fermentum viverra."}
        author={"Colleen Hoover"}
      />

      <Historic
        cover={deFeriasComVoce}
        title={"De Férias com Você"}
        description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra sed maecenas odio fermentum viverra."}
        author={"Emily Henry"}
      />

      <Historic
        cover={flashForward}
        title={"FlashForward"}
        description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra sed maecenas odio fermentum viverra."}
        author={"Robert J. Sawyer"}
      />
      <NavBar/>
    </section>
  );
};

export default Home;
