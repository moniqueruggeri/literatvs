import "./SideNavBar.css";
import SideHeader from "../SideHeader/SideHeader";
import Button from "../Button/Button";
import Line from "../Line/Line";
import Profile from "../Profile/Profile"

const SideNavBar = ({ onClose, isOpen }) => {
  return (
    <>
      <div className="sidebar-container">
        <div className="sidebar-wrapper">
          <div className={`sideBar ${isOpen ? "active" : ''}`}>
            <SideHeader onClose={onClose} />
            <div className="sideBarButtons">
              <Button
                link={Profile}
                hasIcon={true}
                icon={"person_outline"}
                hasText={true}
                text={"Perfil"}
                />
              <Button
                link={"./"}
                hasIcon={true}
                icon={"person_add"}
                hasText={true}
                text={"Convidar"}
                />
              <Button
                link={"./"}
                hasIcon={true}
                icon={"settings"}
                hasText={true}
                text={"Configurações"}
                />
              <Line />
              <Button
                link={"./"}
                hasIcon={true}
                icon={"workspace_premium"}
                hasText={true}
                text={"Desafios"}
                />
              <Button
                link={"./"}
                hasIcon={true}
                icon={"emoji_events"}
                hasText={true}
                text={"Ranking"}
                />
              <Button
                link={"./"}
                hasIcon={true}
                icon={"book"}
                hasText={true}
                text={"Leituras do ano"}
                />
              <Button
                link={"./"}
                hasIcon={true}
                icon={"local_library"}
                hasText={true}
                text={"T.B.R."}
                />
            </div>
            <div className="sideBarBottonButtons">
              <Line />
              <Button
                className={"fab fa-instagram"}
                link={"./"}
                hasIcon={false}
                hasText={true}
                text={"Siga-nos"}
                />
              <Button
                link={"./"}
                hasIcon={true}
                icon={"assignment"}
                hasText={true}
                text={"Termos e condições"}
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNavBar;
