import CustomForm from "../Form/CustomForm"
import WelcomeText from "../WelcomeText/WelcomeText"
import "./Cadastrar.css"

const Cadastrar = () => {

    const formFields = [
        {name: 'email', type: 'email', placeholder: 'Email'},
        {name: 'email', type: 'email', placeholder: 'Confirme seu email'},
        {name: 'password', type: 'password', placeholder: 'Senha'},
        {name: 'password', type: 'password', placeholder: 'Confime sua senha'}
    ]
    return (
        <div className="home cadastrar">
            <WelcomeText/>
            <CustomForm
                fields={formFields}
                hasForgotPassword={false}
                text={"Finalizar Cadastro"}
                link={"/home"}
            />
        </div>
    )
}

export default Cadastrar