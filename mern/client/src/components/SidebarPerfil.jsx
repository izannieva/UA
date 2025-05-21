import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/styleSidebarPerfil.css";

function SidebarPerfil({ userEmail }) {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPw, newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Contraseña cambiada correctamente");
        setOldPw("");
        setNewPw("");
        setTimeout(() => setShowModal(false), 1500);
      } else {
        setMsg(data.error || "Error al cambiar la contraseña");
      }
    } catch (err) {
      setMsg("Error de conexión");
    }
    setLoading(false);
  };

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
        <button onClick={() => setShowModal(true)}>Cambiar contraseña</button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Cambiar contraseña</h2>
            <form onSubmit={handleChangePassword} className="modal-form">
              <label>Contraseña actual</label>
              <input
                type="password"
                value={oldPw}
                onChange={e => setOldPw(e.target.value)}
                required
              />
              <label>Nueva contraseña</label>
              <input
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                required
                minLength={6}
              />
              {msg && <p style={{ color: msg.includes("correctamente") ? "green" : "red" }}>{msg}</p>}
              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Cambiando..." : "Cambiar"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} disabled={loading}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}

export default SidebarPerfil;