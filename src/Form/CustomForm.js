import Button from "../Button/Button";
import "./CustomForm.css";

const CustomForm = ({ fields, hasForgotPassword, text, link }) => {
  return (
    <>
      <form>
        {fields.map((field, index) => (
          <div key={index}>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
            />
          </div>
        ))}
        {hasForgotPassword && <p className="forgotPassword">Esqueci minha senha</p>}
      </form>
          <Button className="button register-buttons-main"
            link={link}
            hasIcon={false}
            hasText={true}
            text={text}
          />
    </>
  );
};

export default CustomForm;
