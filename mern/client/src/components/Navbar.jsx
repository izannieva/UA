// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/StyleNavbar.css";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []);
  
  const [searchQuery, setSearchQuery] = useState(""); 

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.png" alt="Nova Assets Logo" />
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      <div className="navbar-actions">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="button">Iniciar Sesión</Link>
            <Link to="/register" className="button">Registrarse</Link>
          </>
        ) : (
          <>
            <Link to="/upload-asset" className="button">Subir Asset</Link>
            <Link to="/perfil" className="button">Ver Perfil</Link>
            <button onClick={handleLogout} className="button">Cerrar Sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
