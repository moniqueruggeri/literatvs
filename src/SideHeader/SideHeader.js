import "./SideHeader.css"
import ProfilePic from "../ProfilePic/ProfilePic"
import { Link } from "react-router-dom"

const SideHeader = ({onClose}) => {

    return (
        <header className="sideHeader">
            <ProfilePic onClick={onClose}/>
            <div>
                <ul>
                    <li><Link to="/"><span>23</span>Seguidores</Link></li>
                    <li><Link to="/"><span>31</span>Seguindo</Link></li>
                    <li><Link to="/"><span>101</span>Livros</Link></li>
                </ul>
                <h2>Martina</h2>
            </div>
        </header>
    )
}

export default SideHeader