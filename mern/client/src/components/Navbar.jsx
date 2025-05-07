import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styleNavbar.css";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si el token existe en localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Actualiza el estado según la existencia del token
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token al cerrar sesión
    setIsAuthenticated(false); // Actualiza el estado
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/images/logo.png" alt="Nova Assets Logo" />
        </Link>
      </div>
      <div className="navbar-actions">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="button">Iniciar sesión</Link>
            <Link to="/register" className="button">Registrarse</Link>
          </>
        ) : (
          <>
            <Link to="/perfil" className="profile-icon">
              <i className="fas fa-user-circle"></i>
            </Link>
            <button onClick={handleLogout} className="button">Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;