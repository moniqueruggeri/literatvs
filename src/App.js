import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home/Home";
import { useState } from "react";
import SideNavBar from "./SideNavBar/SideNavBar";
import Login from "./Login/Login";
import Cadastrar from "./Cadastrar/Cadastrar";
import Profile from "./Profile/Profile";

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <Router>
      {isSideBarOpen && (
        <div
          className={`overlay ${isSideBarOpen ? "active" : ""}`}
          onClick={toggleSideBar}
        ></div>
      )}

      <div className={`main-container ${isSideBarOpen ? "sidebar-open" : ""}`}>
        <Routes>
          <Route path="/home" element={<Home toggleSideBar={toggleSideBar} />} />
          <Route path="/" element={<Login/>}/>
          <Route path="/cadastrar" element={<Cadastrar/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
        {isSideBarOpen && <SideNavBar onClose={toggleSideBar} />}
      </div>
    </Router>
  );
}

export default App;
