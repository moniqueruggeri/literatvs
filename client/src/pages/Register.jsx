import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../img/logo-literatvs.png";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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
      await register(formData);
      setSuccess("Conta criada com sucesso!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registar.");
    }
  };

  return (
    <section className="register-section">
      <img src={logo} alt="Literatvs" className="logo" />

      <div className="register-container">
      <div className="welcomming">
          <h1 className="title-login">
            Bem-vindo à sua rede social literária!
          </h1>
          <p className="description-login">
            Preencha as informações abaixo para começar.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="div-input">
            <input
              placeholder="Nome"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
            />
          </div>

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

          <button type="submit" className="button">
            Criar conta
          </button>
        </form>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </div>
    </section>
  );
};

export default Register;
