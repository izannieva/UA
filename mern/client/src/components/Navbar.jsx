// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
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
    if (searchQuery.trim()) {
      navigate(`/busqueda?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
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
            <Link to="/perfil" className="button" title="Ver Perfil">
              <FaUserCircle size={22} />
            </Link>
            <button onClick={handleLogout} className="button" title="Cerrar Sesión">
              <FaSignOutAlt size={20} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
