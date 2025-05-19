import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styleLanding.css";

const categorias = [
  "Personajes",
  "Objetos",
  "Texturas",
  "Packs"
];

function LandingPage() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/asset")
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch(() => setAssets([]));
  }, []);

  // Selecciona 5 assets aleatorios
  const getRandomAssets = (arr, n) => {
    if (!arr.length) return [];
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };
  const randomAssets = getRandomAssets(assets, 5);

  return (
    <div className="landing-container">
      <aside className="sidebar">
        <h2>Tipos de assets</h2>
        <ul>
          {categorias.map((cat) => (
            <li key={cat}>
              <Link to={`/busqueda?filter=${encodeURIComponent(cat)}`}>{cat}</Link>
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1 className="landing-title">Bienvenido a Nova Assets</h1>
        </div>

        <section className="assets-section">
          <h2>Assets Destacados</h2>
          <div className="assets-grid">
            {randomAssets.map((asset) => (
              <Link
              to={`/asset/${asset._id.$oid || asset._id}`}
              key={asset._id.$oid || asset._id}
              className="asset-card-link"
              >
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
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
