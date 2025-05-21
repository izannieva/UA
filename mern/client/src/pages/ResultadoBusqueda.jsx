import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/StyleResultadoBusqueda.css";
import { 
  FiArrowRight, 
  FiSearch, 
  FiStar, 
  FiGrid, 
  FiUser, 
  FiBox, 
  FiImage, 
  FiPackage 
} from 'react-icons/fi';

function ResultadoBusqueda() {
  // Existing state variables
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate items per page based on screen width
  const [itemsPerPage, setItemsPerPage] = useState(calculateItemsPerPage());
  
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filtroURL = params.get("filter");
    const searchURL = params.get("search");
    if (filtroURL) setFilter(filtroURL);
    if (searchURL) setSearch(searchURL);
  }, [location.search]);

  useEffect(() => {
    fetch("http://localhost:5050/asset")
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch(() => setAssets([]));
  }, []);

  // Calculate optimal items per page based on screen width
  function calculateItemsPerPage() {
    const width = window.innerWidth;
    if (width < 640) return 6;     // Mobile: 2x3 grid
    if (width < 1024) return 9;    // Tablet: 3x3 grid
    return 12;                     // Desktop: 4x3 grid
  }

  // Add resize listener to adjust items per page
  useEffect(() => {
    function handleResize() {
      setItemsPerPage(calculateItemsPerPage());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter assets - simplificado sin filtros de precio
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory =
      filter === "All" || (asset.categoria && asset.categoria.toLowerCase() === filter.toLowerCase());
    const matchesSearch =
      !search || (asset.titulo && asset.titulo.toLowerCase().includes(search.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Ensure pagination resets when filter/search/items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search, itemsPerPage]);

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Categories with icons
  const categories = [
    { id: "All", name: "Todos los Assets", icon: <FiGrid /> },
    { id: "Personajes", name: "Personajes", icon: <FiUser /> },
    { id: "Objetos", name: "Objetos", icon: <FiBox /> },
    { id: "Texturas", name: "Texturas", icon: <FiImage /> },
    { id: "Packs", name: "Paquetes", icon: <FiPackage /> }
  ];

  // Generate random rating for demo purposes
  const getRandomRating = () => (Math.random() * 2 + 3).toFixed(1); // Between 3.0 and 5.0

  // Dentro de la función de renderizado del componente
  return (
    <div className="rb-search-container rb-search-container-with-navbar">
      {/* Barra lateral */}
      <div className="ex-sidebar">
        <h2 className="ex-cat-title">Explora</h2>
        <div className="ex-cat-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`ex-cat-button ${filter === category.id ? "active" : ""}`}
              onClick={() => handleFilterChange(category.id)}
            >
              <span className="ex-cat-icon">{category.icon}</span>
              <span className="ex-cat-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Contenedor principal */}
      <div className="rb-content">
        {/* Header fijo */}
        <div className="rb-header">
          <div className="rb-title-container">
            <h1>{filter === "All" ? "Todos los Assets" : filter}</h1>
            <div className="rb-count">{filteredAssets.length} recursos</div>
          </div>
          
          {/* Barra de búsqueda con ícono */}
          <div className="ua-search-container">
            <form onSubmit={handleSearchSubmit} className="ua-search-wrapper">
              <input
                type="text"
                className="ua-search-input"
                placeholder="Buscar recursos..."
                value={search}
                onChange={handleSearchChange}
              />
            </form>
          </div>
        </div>
        
        {/* Área con scroll para los recursos */}
        <div className="rb-assets-scroll-area">
          <div className="rb-assets-grid">
            {paginatedAssets.map((asset) => (
              <Link 
                to={`/asset/${asset._id.$oid || asset._id}`} 
                className="rb-asset-card" 
                key={asset._id.$oid || asset._id}
              >
                <div className="rb-asset-image-container">
                  <img
                    src={
                      asset.imagen
                        ? `http://localhost:5050/uploads/${asset.imagen}`
                        : "/images/asset-placeholder.png"
                    }
                    alt={asset.titulo || "Recurso"}
                    className="rb-asset-image"
                    onError={(e) => {
                      e.target.src = "/images/asset-placeholder.png";
                      e.target.onerror = null;
                    }}
                  />
                  <div className={`rb-asset-type type-${asset.tipo?.toLowerCase() || '3d'}`}>
                    {asset.tipo || "3D"}
                  </div>
                </div>
                <div className="rb-asset-info">
                  <h3 className="rb-asset-title">{asset.titulo || "Recurso sin nombre"}</h3>
                  <div className="rb-asset-creator">
                    {asset.usuario?.nombre || "Creador desconocido"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="rb-pagination">
              <button
                className="rb-pagination-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </button>
              {/* Lógica de paginación */}
              <button
                className="rb-pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultadoBusqueda;