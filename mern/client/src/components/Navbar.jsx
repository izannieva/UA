// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { FaSearch, FaSignOutAlt, FaUserCircle, FaCloudUploadAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styleNavbar.css";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busqueda?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src="/images/logo.png" alt="Nova Assets Logo" />
          </Link>

          {/* Desktop Search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
          
          {/* Mobile Search Toggle */}
          <button type="button" className="search-toggle" onClick={toggleMobileSearch}>
            <FaSearch />
          </button>
        </div>

        <div className="navbar-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="button">Iniciar Sesión</Link>
              <Link to="/register" className="button button-register">Registrarse</Link>
            </>
          ) : (
            <>
              <Link to="/upload-asset" className="button upload-icon-button" title="Subir Asset">
                <FaCloudUploadAlt size={22} />
              </Link>
              <Link to="/perfil" className="button" title="Perfil">
                <FaUserCircle size={22} />
              </Link>
              <button onClick={handleLogout} className="button" title="Cerrar sesión">
                <FaSignOutAlt size={20} />
              </button>
            </>
          )}
        </div>
      </nav>
      
      {/* Mobile Search Bar */}
      <form className={`navbar-search-mobile ${mobileSearchOpen ? 'open' : ''}`} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>
    </>
  );
}

export default Navbar;
