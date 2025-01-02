import "./ProfilePic.css";
import profilePicture from "../img/profile_picture.png";

const ProfilePic = ({onClick}) => {

  return (
    <div className="profilePic" onClick={onClick}>
      <img src={profilePicture} alt="foto de perfil Martina"/>
    </div>
  );
};

export default ProfilePic;
