import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styleLanding.css";
import { FiBox, FiUsers, FiImage, FiPackage, FiArrowRight, FiRefreshCw } from "react-icons/fi";

const categorias = [
  { id: "personajes", name: "Personajes", icon: <FiUsers /> },
  { id: "objetos", name: "Objetos", icon: <FiBox /> },
  { id: "texturas", name: "Texturas", icon: <FiImage /> },
  { id: "packs", name: "Packs", icon: <FiPackage /> }
];

function LandingPage() {
  const [assets, setAssets] = useState([]);
  const [randomAssets, setRandomAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5050/asset")
      .then((res) => res.json())
      .then((data) => {
        setAssets(data);
        // Seleccionar 4 assets aleatorios
        selectRandomAssets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching assets:", error);
        setAssets([]);
        setLoading(false);
      });
  }, []);

  // Función para seleccionar assets aleatorios
  const selectRandomAssets = (assetArray) => {
    if (assetArray.length <= 4) {
      setRandomAssets(assetArray);
    } else {
      const shuffled = [...assetArray].sort(() => 0.5 - Math.random());
      setRandomAssets(shuffled.slice(0, 4));
    }
  };

  // Función para refrescar los assets mostrados
  const refreshAssets = () => {
    if (assets.length > 4) {
      selectRandomAssets(assets);
    }
  };

  return (
    <div className="landing-container">
      <aside className="sidebar">
        <h2>Explora</h2>
        <ul className="category-list">
          {categorias.map((cat) => (
            <li key={cat.id}>
              <Link to={`/busqueda?filter=${encodeURIComponent(cat.name)}`}>
                <span className="category-icon">{cat.icon}</span>
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-cta">
          <h3>¿Tienes un asset?</h3>
          <p>Compártelo con la comunidad</p>
          <Link to="/upload-asset" className="upload-button">Subir Asset</Link>
        </div>
      </aside>

      <main className="main-content">
        {/* Banner simplificado */}
        <div className="hero-banner">
          <div className="hero-content">
            <h1 className="landing-title">Nova Assets</h1>
            <p className="hero-description">
              Descubre y comparte assets de alta calidad para tus proyectos creativos.
              Encuentra modelos 3D, texturas y más.
            </p>
            <div className="hero-actions">
              <Link to="/busqueda" className="primary-button">Explorar Assets</Link>
              
            </div>
          </div>
        </div>

        {/* Sección de assets destacados aleatorios */}
        <section className="featured-assets">
          <div className="section-header">
            <h2>Assets Destacados</h2>
            <div className="assets-actions">
              <button className="refresh-button" onClick={refreshAssets} title="Mostrar otros assets">
                <FiRefreshCw />
              </button>
              <Link to="/busqueda" className="view-all">Ver Todos <FiArrowRight /></Link>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando assets...</p>
            </div>
          ) : (
            <div className="assets-display">
              {randomAssets.length > 0 ? (
                <div className="assets-grid-compact">
                  {randomAssets.map((asset) => (
                    <Link 
                      to={`/asset/${asset._id.$oid || asset._id}`} 
                      className="asset-card" 
                      key={asset._id.$oid || asset._id}
                    >
                      <div className="asset-image-container">
                        <img
                          src={
                            asset.imagen
                              ? `http://localhost:5050/uploads/${asset.imagen}`
                              : "/images/placeholder.png"
                          }
                          alt={asset.titulo}
                          className="asset-image"
                        />
                        {/* Overlay title on the image */}
                        <div className="asset-title-overlay">
                          <h4 className="asset-title">{asset.titulo || "Sin título"}</h4>
                        </div>
                      </div>
                      <div className="asset-info">
                        <div className="asset-creator">
                          {asset.usuario?.nombre || "Usuario"}
                        </div>
                        <div className="asset-rating">
                          <span className="asset-rating-stars">★★★★☆</span>
                          <span className="asset-rating-count">{asset.downloads || 0}</span>
                        </div>
                        {asset.precio === 0 && (
                          <div className="asset-price free">Free</div>
                        )}
                        {asset.precio > 0 && (
                          <div className="asset-price">${asset.precio}</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="no-assets">No hay assets destacados disponibles.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default LandingPage;