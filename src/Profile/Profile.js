import Button from "../Button/Button";
import ProfilePic from "../ProfilePic/ProfilePic";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="home">
      <header className="profile-header">
        <div className="profile-specs">
          <ProfilePic />
          <div className="username">
            <h2>Martina</h2>
            <p>@martina</p>
          </div>
        </div>
        <div className="profile-nums">
          <ul className="nums-list">
            <li>
              <span>29</span> Seguidores
            </li>
            <li>
              <span>31</span> Seguindo
            </li>
            <li>
              <span>161</span> Livros
            </li>
          </ul>
          <Button
            link={"/"}
            className={"register-buttons-sec"}
            hasIcon={false}
            hasText={true}
            text={"Seguir"}
          />
        </div>
      </header>
    </div>
  );
};

export default Profile;
