// src/pages/Perfil.jsx
import { useEffect, useState } from "react";
import SidebarPerfil from "../components/SidebarPerfil";
import "../styles/StylePerfil.css";

function Perfil() {
  const [userData, setUserData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/user/perfil`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) setUserData(data);
        else console.error("Error al cargar perfil:", data.error);
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) return <p style={{ color: "white" }}>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <SidebarPerfil userEmail={userData.correo} />
      <main className="perfil-main">
        <section className="perfil-info">
          <h2>Información Personal</h2>
          <div className="info-grid">
            <div className="info-group"><label>Nombre</label><p>{userData.nombre}</p></div>
            <div className="info-group"><label>Apellido</label><p>{userData.apellido}</p></div>
            <div className="info-group"><label>Email</label><p>{userData.correo}</p></div>
            <div className="info-group"><label>Usuario</label><p>{userData.usuario}</p></div>
            <div className="info-group"><label>País</label><p>{userData.pais}</p></div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;
