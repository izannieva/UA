import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

function LandingPage() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/asset")
      .then((res) => res.json())
      .then((data) => {
        setAssets(data); // data es un array de assets
      })
      .catch(() => {
        setAssets([]);
      });
  }, []);

  return (
    <div className="landing-container">
      <main className="landing-main">
        <h1>¡Bienvenido a Nova Assets!</h1>
        <p>En esta página podrás encontrar infinidad de assets para todo tipo de videojuegos.</p>
        <div className="content-section">
          <div className="filters">
            <input type="text" placeholder="Filtrar por..." className="filter-input" />
            <ul className="filter-list">
              <li><Link to="/busqueda?filter=objetos">Objetos</Link></li>
              <li><Link to="/busqueda?filter=modelos3d">Modelos 3D</Link></li>
              <li><Link to="/busqueda?filter=packs">Packs</Link></li>
              <li><Link to="/busqueda?filter=personajes">Personajes</Link></li>
            </ul>
          </div>
          <div className="assets-preview">
            <h2>Assets Destacados</h2>
            <div className="assets-carousel">
              {assets.map((asset) => (
                <div className="asset-item" key={asset._id.$oid || asset._id}>
                  <img
                    src={
                      asset.imagen
                        ? `http://localhost:5050/uploads/${asset.imagen}`
                        : "/images/placeholder.png"
                    }
                    alt={asset.titulo}
                    style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }}
                  />
                  <h4 style={{ color: "#fff", margin: "8px 0" }}>{asset.titulo}</h4>
                  <p style={{ color: "#a78bfa", margin: 0 }}>{asset.categoria}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
