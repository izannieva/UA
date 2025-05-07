import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styleLanding.css";

function LandingPage() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/asset")
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch(() => setAssets([]));
  }, []);

  return (
    <div className="landing-container">
      <aside className="sidebar">
        <h2>Tipos de assets</h2>
        <ul>
          <li><Link to="/busqueda?filter=3d">3D</Link></li>
          <li><Link to="/busqueda?filter=entornos">Entornos</Link></li>
          <li><Link to="/busqueda?filter=animaciones">Animaciones</Link></li>
          <li><Link to="/busqueda?filter=audio">Audio</Link></li>
          <li><Link to="/busqueda?filter=vfx">VFX</Link></li>
          <li><Link to="/busqueda?filter=plantillas">Plantillas</Link></li>
          <li><Link to="/busqueda?filter=plugins">Plugins</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1 className="landing-title">Bienvenido a Nova Assets</h1>
        </div>

        <section className="assets-section">
          <h2>Assets Destacados</h2>
          <div className="assets-grid">
            {assets.map((asset) => (
              <div className="asset-card" key={asset._id.$oid || asset._id}>
                <img
                  src={
                    asset.imagen
                      ? `http://localhost:5050/uploads/${asset.imagen}`
                      : "/images/placeholder.png"
                  }
                  alt={asset.titulo}
                  className="asset-image"
                />
                <h4 className="asset-title">{asset.titulo}</h4>
                <p className="asset-category">{asset.categoria}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
