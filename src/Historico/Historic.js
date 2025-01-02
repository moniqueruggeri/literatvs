import Button from "../Button/Button";
import HistoricProfile from "../HistoricProfile/HistoricProfile";
import ProgressBar from "../ProgressBar/PorgressBar";
import "./Historic.css";

const Historic = ({ cover, title, author, description }) => {
  return (
    <>
      <div className="historicoDeLeitura">
        <img src={cover} alt="" />
        <div className="sinopse">
          <div className="sinopse_header">
            <div className="sinopse_title">
              <h2 className="title">{title}</h2>
              <p className="author">{author}</p>
            </div>
            <Button
              className={"button_add"}
              link={"/"}
              hasIcon={true}
              hasText={false}
              icon={"add"}
            />
          </div>
          <p className="description">{description}</p>
        </div>
        <ProgressBar />
      </div>
      <HistoricProfile />
    </>
  );
};

export default Historic;
