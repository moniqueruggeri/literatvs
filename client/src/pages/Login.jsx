import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"
import "./Login.css";
import logo from "../img/logo-literatvs.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await login(formData);
      console.log("LOGIN SUCCESS:", data);

      setSuccess("Login feito com sucesso!");

      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (err) {
      console.error("LOGIN FRONT ERROR:", err);
      console.error("LOGIN FRONT RESPONSE:", err.response?.data);

      const backendError =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Erro ao fazer login.";

      setError(backendError);
    }
  };

  return (
    <section className="login-section">
      <img src={logo} alt="Literatvs" className="logo" />

      <div className="login-container">
        <div className="welcomming">
          <h1 className="title-login">
            Bem-vindo à sua rede social literária!
          </h1>
          <p className="description-login">
            Organize as suas leituras, participe de desafios e conecte-se à mais
            de 8 milhões de amantes da leitura.
          </p>
        </div>

        <div className="vertical-line"></div>
        <div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-inputs">
              <div className="div-input">
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="div-input">
                <input
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <p className="forgot-password">Esqueci minha senha</p>
            </div>

            <button type="submit" className="button">
              Entrar
            </button>

            <Link to="/register">
              <p className="create-account">Criar conta</p>
            </Link>
          </form>

          {error && <p>{error}</p>}
          {success && <p>{success}</p>}
        </div>
      </div>
    </section>
  );
};

export default Login;
