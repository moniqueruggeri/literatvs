import React from "react";
import profilePicture from "../img/profile_picture.png";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
  return (
    <>
      <div className="header">
        <h1>
          <span>Olá,</span>
          <br /> Martina!
        </h1>
        <img src={profilePicture} alt="foto de perfil Martina" />
      </div>
      <SearchBar />
    </>
  );
};

export default Header;
