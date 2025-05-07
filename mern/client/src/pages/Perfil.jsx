import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/stylePerfil.css";

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

        const response = await fetch("http://localhost:5050/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
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
      <aside className="perfil-sidebar">
        <div className="perfil-avatar-section">
          <img src="/images/user-avatar.png" alt="Avatar del usuario" className="perfil-avatar" />
          <h2>{userData.nombre}</h2>
          <p>{userData.correo}</p>
        </div>
        <nav className="perfil-menu">
          <ul>
            <li className="active">Profile</li>
            <li>Assets</li>
            <Link to="/" className="menu-button">
              <li>Main Menu</li>
            </Link>
          </ul>
        </nav>
        <div className="perfil-storage">
          <p>Storage</p>
          <div className="storage-bar">
            <div className="storage-used" style={{ width: "75%" }}></div>
          </div>
          <p>75.8GB / 100GB</p>
        </div>
      </aside>

      <main className="perfil-main">
        <section className="perfil-info">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-group">
              <label>Nombre</label>
              <p>{userData.nombre}</p>
            </div>
            <div className="info-group">
              <label>Email</label>
              <p>{userData.correo}</p>
            </div>
            <div className="info-group">
              <label>Usuario</label>
              <p>{userData.usuario}</p>
            </div>
            <div className="info-group">
              <label>Apellido</label>
              <p>{userData.apellido}</p>
            </div>
            <div className="info-group">
              <label>País</label>
              <p>{userData.pais}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;
