import { useEffect, useState } from "react";
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
  FiPackage,
  FiFilter,
  FiX
} from 'react-icons/fi';

function ResultadoBusqueda() {
  const API_URL = import.meta.env.VITE_API_URL;  // <--- Declaración global aquí

  // Existing state variables
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate items per page based on screen width
  const [itemsPerPage, setItemsPerPage] = useState(calculateItemsPerPage());
  const [sortOrder, setSortOrder] = useState("newest"); // Opciones: newest, oldest, a-z, z-a
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768); // Estado para controlar la barra lateral
  
  const location = useLocation();
  
  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const filtroURL = params.get("filter");
    const searchURL = params.get("search");

    if (filtroURL) setFilter(filtroURL);
    if (searchURL) setSearch(searchURL);
  }, [location.search]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    // Primero obtenemos todos los assets
    fetch(`${API_URL}/asset`)
      .then((res) => res.json())
      .then((data) => {
        // Obtenemos los IDs únicos de autores
        const authorIds = [...new Set(data.map(asset => asset.autorId).filter(Boolean))];
        
        // Si hay autores, buscamos sus datos
        if (authorIds.length > 0) {
          // Hacemos peticiones para obtener la información de cada autor
          const authorPromises = authorIds.map(authorId => 
            fetch(`${API_URL}/user/${authorId}`)
              .then(res => res.ok ? res.json() : null)
              .catch(() => null)
          );
          
          // Cuando tengamos todos los datos de autores
          Promise.all(authorPromises)
            .then(authors => {
              // Creamos un mapa de ID -> datos del autor
              const authorMap = {};
              authors.forEach(author => {
                if (author && author._id) {
                  authorMap[author._id] = author;
                }
              });
              
              // Enriquecemos los assets con la información de sus autores
              const enrichedAssets = data.map(asset => {
                if (asset.autorId && authorMap[asset.autorId]) {
                  return {
                    ...asset,
                    autor: authorMap[asset.autorId]
                  };
                }
                return asset;
              });
              
              setAssets(enrichedAssets);
            })
            .catch(err => {
              console.error("Error fetching author data:", err);
              setAssets(data);
            });
        } else {
          setAssets(data);
        }
      })
      .catch(() => setAssets([]));
  }, [API_URL]);

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
      // Auto-open sidebar on large screens, close on mobile
      setSidebarOpen(window.innerWidth > 768);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter assets - incluye búsqueda por tags
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory =
      filter === "All" || (asset.categoria && asset.categoria.toLowerCase() === filter.toLowerCase());
    
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search || 
      (asset.titulo && asset.titulo.toLowerCase().includes(searchLower)) ||
      (Array.isArray(asset.tags) && asset.tags.some(tag => tag.toLowerCase().includes(searchLower)));
    
    return matchesCategory && matchesSearch;
  });

  // Función para ordenar assets
  const sortAssets = (assets) => {
    switch (sortOrder) {
      case "newest":
        return [...assets].sort((a, b) => {
          const dateA = a.fechaSubida ? new Date(a.fechaSubida) : new Date(0);
          const dateB = b.fechaSubida ? new Date(b.fechaSubida) : new Date(0);
          return dateB - dateA; // Más recientes primero
        });
      case "oldest":
        return [...assets].sort((a, b) => {
          const dateA = a.fechaSubida ? new Date(a.fechaSubida) : new Date(0);
          const dateB = b.fechaSubida ? new Date(b.fechaSubida) : new Date(0);
          return dateA - dateB; // Más antiguos primero
        });
      case "a-z":
        return [...assets].sort((a, b) => {
          const titleA = a.titulo?.toLowerCase() || "";
          const titleB = b.titulo?.toLowerCase() || "";
          return titleA.localeCompare(titleB);
        });
      case "z-a":
        return [...assets].sort((a, b) => {
          const titleA = a.titulo?.toLowerCase() || "";
          const titleB = b.titulo?.toLowerCase() || "";
          return titleB.localeCompare(titleA);
        });
      default:
        return assets;
    }
  };

  // Ordenar los assets filtrados
  const sortedFilteredAssets = sortAssets(filteredAssets);

  // Ensure pagination resets when filter/search/items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search, itemsPerPage, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedFilteredAssets.length / itemsPerPage);
  const paginatedAssets = sortedFilteredAssets.slice(
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

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Dentro de la función de renderizado del componente
  return (
    <div className="rb-search-container rb-search-container-with-navbar">
      {/* Mobile sidebar toggle button */}
      <button 
        className="sidebar-toggle-button" 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FiX /> : <FiFilter />}
      </button>
      
      {/* Barra lateral con clase condicional */}
      <div className={`ex-sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
            <div className="rb-count">{sortedFilteredAssets.length} recursos</div>
          </div>
          
          {/* Selector de ordenación (MOVIDO AQUÍ) */}
          <div className="rb-sort-container">
            <label htmlFor="sort-select" className="rb-sort-label">
              <FiFilter className="rb-sort-icon" />
              <span>Ordenar:</span>
            </label>
            <select 
              id="sort-select"
              className="rb-sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="a-z">Nombre (A-Z)</option>
              <option value="z-a">Nombre (Z-A)</option>
            </select>
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
                        ? asset.imagen // Usar directamente la URL de Cloudinary
                        : "/images/asset-placeholder.png"
                    }
                    alt={asset.titulo || "Recurso"}
                    className="rb-asset-image"
                    onError={(e) => {
                      e.target.src = "/images/asset-placeholder.png";
                      e.target.onerror = null;
                    }}
                  />
                  {/* Se ha eliminado el div que mostraba el tipo "3D" */}
                </div>
                <div className="rb-asset-info">
                  <h3 className="rb-asset-title">{asset.titulo || "Recurso sin nombre"}</h3>
                  <div className="rb-asset-creator">
                    <span className="creator-label">Subido:</span> {
                      asset.fechaSubida 
                        ? new Date(asset.fechaSubida).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : "Fecha desconocida"
                    }
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
