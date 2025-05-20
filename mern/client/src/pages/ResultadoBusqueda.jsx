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
    { id: "All", name: "All Assets", icon: <FiGrid /> },
    { id: "Personajes", name: "Characters", icon: <FiUser /> },
    { id: "Objetos", name: "Props", icon: <FiBox /> },
    { id: "Texturas", name: "Textures", icon: <FiImage /> },
    { id: "Packs", name: "Packs", icon: <FiPackage /> }
  ];

  // Generate random rating for demo purposes
  const getRandomRating = () => (Math.random() * 2 + 3).toFixed(1); // Between 3.0 and 5.0

  return (
    <div className="search-container search-container-with-navbar">
      <div className="search-sidebar">
        <h2 className="filter-title">✨ Explore Assets</h2>
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-button ${filter === category.id ? "active" : ""}`}
              onClick={() => handleFilterChange(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
        
        {/* Removemos la sección de filtros de precio */}
      </div>
      
      <div className="search-content">
        <div className="search-header">
          <div className="title-container">
            <h1>{filter === "All" ? "All Assets" : filter}</h1>
            <div className="search-count">{filteredAssets.length} assets</div>
          </div>
          
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search assets..."
                value={search}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-submit">Search</button>
          </form>
        </div>
        
        <div className="assets-grid">
          {paginatedAssets.map((asset) => (
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
                      : "/images/asset-placeholder.png"
                  }
                  alt={asset.titulo}
                  className="asset-image"
                  onError={(e) => {
                    e.target.src = "/images/asset-placeholder.png";
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />
                <div className="asset-overlay">
                  <h3 className="asset-title">{asset.titulo || "Unknown"}</h3>
                </div>
              </div>
              <div className="asset-info">
                <div className="asset-creator">
                  {asset.usuario?.nombre || "Unknown"}
                </div>
                <div className="asset-meta">
                  <div className="asset-rating">
                    <FiStar className="star-icon" />
                    <span>{getRandomRating()}</span>
                  </div>
                  <div className="asset-price">
                    {asset.precio === 0 ? "Free" : `$${asset.precio}`}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage > 3 && totalPages > 5 
                ? (currentPage - 3) + i + 1 
                : i + 1;
              if (pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    className={`pagination-button ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="pagination-ellipsis">...</span>
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              className="pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultadoBusqueda;