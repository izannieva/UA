import { useState } from "react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    pw: "",
  });

  const [message, setMessage] = useState("");

  //funcion para actualizar el estado del formulario cuando el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Limpiar mensajes previos
    
    // Validación del correo electrónico con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setMessage("Introduce un correo electrónico válido.");
        console.error("Error: Formato de correo inválido.");
        return;
    }
    try {
      const response = await fetch("http://localhost:5050/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("usuario creado", data);
        setMessage("Registro exitoso");
      } else {
        console.log("Error al registrar", data.error);
        setMessage("Error: " + (data.error || "No se pudo registrar"));
      }
    } catch (error) {
        console.log("Error de conexión con el servidor",error);
    }
    };

  return (
        <form onSubmit={handleSubmit} className="form-container">
        <h2>Registro de Usuario</h2>
        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input type="email" name="correo" placeholder="Correo electrónico" onChange={handleChange} />
        <input type="password" name="pw" placeholder="Contraseña" onChange={handleChange} />
        <button type="submit">Registrarse</button>
        {message && <p>{message}</p>}
        </form>
  );
};

export default RegisterForm;
