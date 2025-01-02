import "./Button.css";
import { Link } from "react-router-dom";

const Button = ({link, hasIcon, hasText, icon, text, className}) => {
  return (
    <Link className={`button ${className}`} to={link}>
      {hasIcon && <i className="material-icons">{icon}</i>}
      {hasText && <span>{text}</span>}
    </Link>
  );
};

export default Button;
