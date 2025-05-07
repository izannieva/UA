import React, { useState } from "react";
import "../styles/StyleResultadoBusqueda.css";

function ResultadoBusqueda() {
  // Datos estáticos simulados
  const assets = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Asset ${i + 1}`,
    size: `${(Math.random() * 200 + 50).toFixed(1)}MB`,
    date: `2023-${Math.floor(Math.random() * 12 + 1)}-${Math.floor(Math.random() * 28 + 1)}`,
  }));

  // Estado para filtros y paginación
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtrar y buscar assets
  const filteredAssets = assets.filter((asset) =>
    (filter === "All" || asset.name.toLowerCase().includes(filter.toLowerCase())) &&
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reiniciar a la primera página al cambiar el filtro
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página al buscar
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
          <div key={asset.id} className="asset-card">
            <div className="asset-thumbnail">
              <input type="checkbox" />
            </div>
            <div className="asset-info">
              <h3>{asset.name}</h3>
              <p>{asset.size}</p>
              <p>{asset.date}</p>
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
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default ResultadoBusqueda;