import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styleNavbar.css";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token al cerrar sesión
    setIsAuthenticated(false); // Actualiza el estado global
  };
  
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la barra de búsqueda

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery); // Aquí puedes redirigir o manejar la búsqueda
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/images/logo.png" alt="Nova Assets Logo" />
        </Link>
      </div>
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>
      <div className="navbar-actions">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="button">Iniciar Sesión</Link>
            <Link to="/register" className="button">Registrarse</Link>
          </>
        ) : (
          <>
            <Link to="/perfil" className="profile-icon">
              <i className="fas fa-user-circle"></i>
            </Link>
            <button onClick={handleLogout} className="button">Cerrar Sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;