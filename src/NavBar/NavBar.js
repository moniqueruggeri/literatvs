import { Link } from "react-router-dom"
import "./NavBar.css"

const NavBar = () => {
    return (
        <nav className="navBar">
            <ul>
                <li>
                    <Link to={"./"}><i className="material-icons ativo">home</i></Link>
                </li>
                <li>
                    <Link to={"./"}><i className="material-icons">search</i></Link>
                </li>
                <li>
                    <Link to={"./"}><i className="material-icons">collections_bookmark</i></Link>
                </li>
                <li>
                    <Link to={"./"}><i className="material-icons">person</i></Link>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar