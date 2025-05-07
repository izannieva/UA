// src/pages/Perfil.jsx
import { useEffect, useState } from "react";
import "../styles/StylePerfil.css";

function Perfil() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No hay token en el localStorage");
          return;
        }

        console.log("Token enviado:", token);

        const response = await fetch("http://localhost:5050/user/perfil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Datos del usuario:", data);
          setUserData(data);
        } else {
          console.error("Error al cargar datos del usuario:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión al servidor:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) return <p style={{ color: "white" }}>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-info">
        <h1 style={{ color: "white" }}>Bienvenido, {userData.nombre || "Usuario"}</h1>
        <p style={{ color: "white" }}>Correo: {userData.correo}</p>
        <p style={{ color: "white" }}>Usuario: {userData.usuario}</p>
        <p style={{ color: "white" }}>Apellido: {userData.apellido}</p>
        <p style={{ color: "white" }}>País: {userData.pais}</p>
      </div>
    </div>
  );
}

export default Perfil;
