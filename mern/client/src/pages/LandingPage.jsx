import { useEffect, useState, useCallback } from "react";
import { FiArrowRight, FiBox, FiEye, FiHeart, FiImage, FiMenu, FiPackage, FiRefreshCw, FiUsers, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import "../styles/styleLanding.css";

const categorias = [
  { id: "personajes", name: "Personajes", icon: <FiUsers /> },
  { id: "objetos", name: "Objetos", icon: <FiBox /> },
  { id: "texturas", name: "Texturas", icon: <FiImage /> },
  { id: "packs", name: "Packs", icon: <FiPackage /> }
];

function LandingPage() {
  // Add state for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const [assets, setAssets] = useState([]);
  const [randomAssets, setRandomAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchAssets = useCallback(() => {
    setLoading(true);
    // Add timestamp to prevent caching
    fetch(`${API_URL}/asset?t=${new Date().getTime()}`)
      .then((res) => res.json())
      .then((data) => {
        setAssets(data);
        selectRandomAssets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching assets:", error);
        setAssets([]);
        setLoading(false);
      });
  }, [API_URL]);

  // Make sure we refetch data when navigating back to the landing page
  useEffect(() => {
    // This will force a re-fetch when returning to this page
    fetchAssets();
  }, [fetchAssets, location.key]); // Add location.key as dependency

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

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="landing-container">
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <h2>Explora</h2>
        <ul className="category-list">
          {categorias.map((cat) => (
            <li key={cat.id}>
              <Link 
                to={`/busqueda?filter=${encodeURIComponent(cat.name)}`}
                onClick={() => setMobileMenuOpen(false)} // Close menu when link clicked
              >
                <span className="category-icon">{cat.icon}</span>
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-cta">
          <h3>¿Tienes un asset?</h3>
          <p>Compártelo con la comunidad</p>
          <Link to="/upload-asset" className="upload-button" onClick={() => setMobileMenuOpen(false)}>
            Subir Asset
          </Link>
        </div>
      </aside>

      {/* Mobile menu toggle button */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

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
                <div className="nova-assets-grid">
                  {randomAssets.map((asset) => (
                    <Link 
                      to={`/asset/${asset._id.$oid || asset._id}`} 
                      className="nova-asset-card" 
                      key={asset._id.$oid || asset._id}
                    >
                      <div className="nova-asset-image-container">
                        <img
                          src={
                            asset.imagen
                              ? asset.imagen 
                              : "/images/placeholder.png"
                          }
                          alt={asset.titulo}
                          className="nova-asset-image"
                          onError={(e) => {
                            e.target.src = "/images/placeholder.png";
                          }}
                        />
                      </div>
                      <div className="nova-asset-info">
                        <h4 className="nova-asset-title">{asset.titulo || "Sin título"}</h4>
                        
                        {/* Tags section */}
                        <div className="nova-asset-tags">
                          {asset.tags && asset.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="nova-asset-tag">{tag}</span>
                          ))}
                          {asset.tags && asset.tags.length > 3 && (
                            <span className="nova-asset-tag-more">+{asset.tags.length - 3}</span>
                          )}
                        </div>
                        
                        {/* Like counter and upload date */}
                        <div className="nova-asset-footer">
                          <div className="nova-asset-stat">
                            <FiHeart className="nova-stat-icon" />
                            <span>{asset.likes?.length || 0}</span>
                          </div>
                          <span className="nova-asset-date">
                            {new Date(asset.fechaSubida || Date.now()).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                        </div>
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