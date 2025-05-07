import "../styles/StylePerfil.css";
import { useState } from "react";

function Perfil() {
  const [activeSection, setActiveSection] = useState("profile"); // Estado para controlar la sección activa

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="perfil-container">
      <aside className="perfil-sidebar">
        <div className="perfil-avatar-section">
          <img
            src="/images/user-avatar.png"
            alt="Avatar del usuario"
            className="perfil-avatar"
          />
          <h2>Usuario 1</h2>
          <p>usuario@example.com</p>
        </div>
        <nav className="perfil-menu">
          <ul>
            <li
              className={activeSection === "profile" ? "active" : ""}
              onClick={() => handleSectionChange("profile")}
            >
              Profile
            </li>
            <li
              className={activeSection === "assets" ? "active" : ""}
              onClick={() => handleSectionChange("assets")}
            >
              Assets
            </li>
            <li>Main Menu</li>
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
        {activeSection === "profile" && (
          <>
            <section className="perfil-info">
              <h2>Personal Information</h2>
              <div className="info-group">
                <label>Nombre</label>
                <p>Samuel García</p>
              </div>
              <div className="info-group">
                <label>Email</label>
                <p>samuel@example.com</p>
              </div>
              <div className="info-group">
                <label>Número teléfono</label>
                <p>+34 123 456 789</p>
              </div>
              <div className="info-group">
                <label>Localización</label>
                <p>Madrid, España</p>
              </div>
              <div className="info-group">
                <label>Role</label>
                <p>Desarrollador</p>
              </div>
              <div className="info-group">
                <label>Sobre mí</label>
                <p>Apasionado por la tecnología y el desarrollo de software.</p>
              </div>
            </section>
            <section className="perfil-account">
              <h2>Account Information</h2>
              <ul>
                <li>
                  <strong>Miembro desde:</strong> 2023-01-15
                </li>
                <li>
                  <strong>Tipo de cuenta:</strong> Premium
                </li>
                <li>
                  <strong>Último login:</strong> Today, 09:30 AM
                </li>
                <li>
                  <strong>Two-Factor Auth:</strong> Enabled
                </li>
                <li>
                  <strong>Historial de login:</strong> <a href="#">View History</a>
                </li>
                <li>
                  <strong>Connected Devices:</strong> 3 Devices
                </li>
                <li>
                  <strong>API Access:</strong> <a href="#">Manage Keys</a>
                </li>
                <li>
                  <strong>Account Status:</strong> Active
                </li>
                <li>
                  <strong>Subscription Plan:</strong> Enterprise
                </li>
                <li>
                  <strong>Facturación:</strong> Monthly
                </li>
                <li>
                  <strong>Próxima facturación:</strong> 2024-02-15
                </li>
              </ul>
            </section>
          </>
        )}
        {activeSection === "assets" && (
          <section className="perfil-assets">
            <h2>Mis Assets</h2>
            <div className="assets-grid">
              <div className="asset-card">
                <img src="/images/asset1.png" alt="Asset 1" />
                <h3>Asset 1</h3>
              </div>
              <div className="asset-card">
                <img src="/images/asset2.png" alt="Asset 2" />
                <h3>Asset 2</h3>
              </div>
              <div className="asset-card">
                <img src="/images/asset3.png" alt="Asset 3" />
                <h3>Asset 3</h3>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Perfil;