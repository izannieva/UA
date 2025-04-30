import React, { useState } from "react";
import "../styles/styleNavbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simula el estado de autenticación

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
          <Link to="/profile">
            <div className="profile-icon">
              <i className="fas fa-user-circle"></i>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;