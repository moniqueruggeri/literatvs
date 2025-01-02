import "./Login.css"
import logoShort from "../img/logo1.png"
import Button from "../Button/Button"
import { Link } from "react-router-dom"
import CustomForm from "../Form/CustomForm"
import WelcomeText from "../WelcomeText/WelcomeText"

const Login = () => {

    const formFields = [
        {name: 'email', type:'email', placeholder:'Email'},
        {name: 'password', type:'password', placeholder:'Senha'}
    ]

    return (
        <div className="login home">
            <img src={logoShort} alt="logo"/>
            <WelcomeText/>
            <CustomForm
                fields={formFields}
                hasForgotPassword={true}
                text={"Fazer login"}
            />
            <div className="buttons">
                <Button
                className={"register-buttons-sec"}
                link={"/"}
                hasIcon={false}
                hasText={true}
                text={"Google"}
                />
                <Button
                className={"register-buttons-sec"}
                link={"/"}
                hasIcon={false}
                hasText={true}
                text={"Facebook"}
                />
            </div>

            <p>Ainda não tem conta? <Link to={"./Cadastrar"}><span>Cadastre-se</span></Link></p>
        </div>
    )
}

export default Login