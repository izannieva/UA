// components/SidebarPerfil.jsx
import { Link, useLocation } from "react-router-dom";
import "../styles/styleSidebarPerfil.css"; // puedes mover los estilos aquí si lo prefieres

function SidebarPerfil({ userEmail }) {
  const location = useLocation();

  return (
    <aside className="perfil-sidebar">
      <div className="perfil-avatar-section">
        <i className="fas fa-user"></i>
        <p>{userEmail}</p>
      </div>
      <nav className="perfil-menu">
        <ul>
          <Link to="/perfil">
            <li className={location.pathname === "/perfil" ? "active" : ""}>Perfil</li>
          </Link>
          <Link to="/mis-assets">
            <li className={location.pathname === "/mis-assets" ? "active" : ""}>Mis Assets</li>
          </Link>
          <Link to="/" className="menu-button">
            <li>Main Menu</li>
          </Link>
        </ul>
      </nav>
      <div className="perfil-storage">
        <button>Cambiar contraseña</button>
      </div>
    </aside>
  );
}

export default SidebarPerfil;
