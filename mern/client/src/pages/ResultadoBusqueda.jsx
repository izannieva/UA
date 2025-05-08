import React, { useEffect, useState } from "react";
import "../styles/StyleResultadoBusqueda.css";
import { useLocation } from "react-router-dom";

function ResultadoBusqueda() {
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Filtrar por categoría y búsqueda
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory =
      filter === "All" || (asset.categoria && asset.categoria.toLowerCase() === filter.toLowerCase());
    const matchesSearch =
      asset.titulo && asset.titulo.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Paginación
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
    setCurrentPage(1);
  };

  return (
    <div className="resultado-busqueda-container">
      <h1>Resultado de búsqueda avanzada</h1>
      <div className="filters-container">
        <div className="filters">
          <button
            className={`filter-button ${filter === "All" ? "active" : ""}`}
            onClick={() => handleFilterChange("All")}
          >
            All
          </button>
          <button
            className={`filter-button ${filter === "Personajes" ? "active" : ""}`}
            onClick={() => handleFilterChange("Personajes")}
          >
            Personajes
          </button>
          <button
            className={`filter-button ${filter === "Objetos" ? "active" : ""}`}
            onClick={() => handleFilterChange("Objetos")}
          >
            Objetos
          </button>
          <button
            className={`filter-button ${filter === "Texturas" ? "active" : ""}`}
            onClick={() => handleFilterChange("Texturas")}
          >
            Texturas
          </button>
          <button
            className={`filter-button ${filter === "Packs" ? "active" : ""}`}
            onClick={() => handleFilterChange("Packs")}
          >
            Packs
          </button>
          <div className="search-bar">
            <input
              type="text"
              placeholder="BUSCAR"
              value={search}
              onChange={handleSearchChange}
            />
            <button className="search-button">🔍</button>
          </div>
        </div>
      </div>
      <div className="assets-grid">
        {paginatedAssets.map((asset) => (
          <div key={asset._id.$oid || asset._id} className="asset-card">
            <div className="asset-thumbnail">
              <img
                src={
                  asset.imagen
                    ? `http://localhost:5050/uploads/${asset.imagen}`
                    : "/images/placeholder.png"
                }
                alt={asset.titulo}
                style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }}
              />
            </div>
            <div className="asset-info">
              <h3>{asset.titulo}</h3>
              <p className="asset-category">{asset.categoria}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default ResultadoBusqueda;