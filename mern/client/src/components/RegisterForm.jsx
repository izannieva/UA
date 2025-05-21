import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/stylesRegistro.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    correo: "",
    nombre: "",
    apellido: "",
    usuario: "",
    pw: "",
    pais: "",
  });

  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCountries([
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada",
      "Chile", "China", "Colombia", "Cuba", "Czechia", "Denmark", "Dominican Republic", "Ecuador", "Egypt", "Finland", "France", "Germany", 
      "Greece", "Guatemala", "Honduras", "Hungary", "India", "Indonesia", "Iran", "Ireland", "Israel", "Italy", "Japan", "Mexico",
      "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
      "Russia", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Kingdom", "United States", "Uruguay", "Venezuela", "Vietnam"
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    return (
      emailRegex.test(formData.correo) &&
      nameRegex.test(formData.nombre) &&
      nameRegex.test(formData.apellido) &&
      formData.pw.length >= 6
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Por favor, rellena todos los campos correctamente.");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registro exitoso");
        console.log("Usuario creado:", data);
        setTimeout(() => navigate("/login"));
      } else {
        setMessage("Error: " + (data.error || "No se pudo registrar"));
      }
    } catch (err) {
      console.error("Error de conexión", err);
      setMessage("No se pudo conectar con el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Crear una cuenta</h2>

      <select name="pais" onChange={handleChange} required>
        <option value="">Selecciona tu país</option>
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <input
        type="email"
        name="correo"
        placeholder="Dirección de correo electrónico"
        value={formData.correo}
        onChange={handleChange}
        required
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
      </div>

      <input
        type="text"
        name="usuario"
        placeholder="Nombre en pantalla"
        value={formData.usuario}
        onChange={handleChange}
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
        Continuar
      </button>

      <div className="links">
        <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p>
        <Link to="/">Política de privacidad</Link>
      </div>

      {message && <p>{message}</p>}
    </form>
  );
};

export default RegisterForm;
