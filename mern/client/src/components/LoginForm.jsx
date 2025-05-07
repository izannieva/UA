import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/stylesRegistro.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    correo: "",
    pw: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Inicializa useNavigate
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(formData.correo) && formData.pw.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Introduce un correo válido y una contraseña de al menos 6 caracteres.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem("token", data.token);
        
        setMessage("Inicio de sesión exitoso");
        console.log("Usuario autenticado:", data);
        setTimeout(() => navigate("/")); // Redirige a la landing

        
      } else {
        setMessage("Error: " + (data.error || "Credenciales incorrectas"));
      }
    } catch (err) {
      console.error("Error de conexión", err);
      setMessage("No se pudo conectar con el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Iniciar sesión</h2>

      <input
        type="email"
        name="correo"
        placeholder="Correo electrónico"
        value={formData.correo}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="pw"
        placeholder="Contraseña"
        value={formData.pw}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={!validateForm()}>
        Entrar
      </button>

      <div className="links">
        <p>¿No tienes una cuenta? <Link to="/register">Regístrate</Link></p>
        <Link to="#">¿Olvidaste tu contraseña?</Link>
      </div>

      {message && <p>{message}</p>}
    </form>
  );
};

export default LoginForm;
