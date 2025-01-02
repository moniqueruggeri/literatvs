import React from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";
import ProfilePic from "../ProfilePic/ProfilePic";


const Header = ({ toggleSideBar }) => {

  return (
    <>
      <div className="header">
        <h1>
          <span>Olá,</span>
          <br /> Martina!
        </h1>
        <ProfilePic onClick={toggleSideBar}/>
      </div>
      <SearchBar />
    </>
  );
};

export default Header;
