// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styleNavbar.css";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    navigate("/login");
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
            <Link to="/login" className="button">Iniciar Sesión</Link>
            <Link to="/register" className="button">Registrarse</Link>
            <Link to="/asset" className="button">MirarAsset</Link>
          </>
        ) : (
          <div className="navbar-user-menu">
            <span>{userEmail}</span>
            <div className="dropdown-menu">
              <Link to="/perfil">Mi Perfil</Link>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
