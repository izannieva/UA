import "../styles/styleAsset.css";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Correcto

function AssetPage() {
  const { id } = useParams(); // <-- El ID dinámico de la URL
  const [asset, setAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [author, setAuthor] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    fetch(`${API_URL}/asset/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setAsset(data);
      if (data.autorId) {
        // Solicitar los datos del usuario asociado al asset
        fetch(`${API_URL}/user/${data.autorId}`)
        .then((res) => res.json())
        .then((userData) => setAuthor(userData)) // Guardar los datos del usuario
        .catch((err) => console.error("Error al cargar el autor:", err));
      }
    })
    .catch((err) => console.error("Error al cargar el asset:", err));
  }, [id]);
  
  useEffect(() => {
    fetch(`${API_URL}/asset`)
    .then((res) => res.json())
    .then((data) => setAssets(data))
    .catch(() => setAssets([]));
  }, []);
  
  const randomAssets = useMemo(() => {
    if (!assets.length || !asset) return [];
    const filtered = assets.filter((a) => a._id !== asset._id);
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [assets, asset]);
  
  const handleDownload = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setShowLoginPopup(true);
      return;
    }
    
    try {
      // Cambiar la URL para usar la ruta del backend
      const response = await fetch(
        `${API_URL}/asset/download/${asset.modelo}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${asset.titulo || "modelo"}.glb`; // Nombre del archivo descargado
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error al descargar el archivo:", err);
      alert("Ocurrió un error al descargar el asset.");
    }
  };
  
  if (!asset) return <p>Cargando...</p>;
  
  return (
    <div className="asset-page">
    <div className="asset-main">
    <div className="asset-image-section">
    <img
    src={`${API_URL}/uploads/${asset.imagen}`}
    alt={asset.titulo}
    className="main-image"
    />
    <div className="thumbnail-row">
    <img
    src={`${API_URL}/uploads/${asset.imagen}`}
    alt={asset.titulo}
    className="thumbnail"
    />
    <img
    src={`${API_URL}/uploads/${asset.imagen}`}
    alt={asset.titulo}
    className="thumbnail"
    />
    <img
    src={`${API_URL}/uploads/${asset.imagen}`}
    alt={asset.titulo}
    className="thumbnail"
    />
    </div>
    </div>
    
    <div className="asset-info-section">
    <h1 className="asset-title">{asset.titulo}</h1>
    <div className="author-section">
    <i className="fa fa-user-circle author-icon" />
    <span className="author-name">
    {author ? `${author.nombre}` : "Cargando..."}
    </span>
    </div>
    
    <div className="tags">
    {asset.tags?.map((tag, index) => (
      <span className="tag" key={index}>
      {tag}
      </span>
    ))}
    </div>
    
    <div className="details">
    <div className="detail-row">
    <span className="label">Fecha</span>
    <span className="value">
    {new Date(asset.fechaSubida).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
    </span>
    </div>
    <div className="detail-row">
    <span className="label">Categoria</span>
    <span className="value">{asset.categoria}</span>
    </div>
    </div>
    
    <div className="buttons">
    <button className="primary" onClick={handleDownload}>
    Descargar ahora
    </button>
    </div>
    </div>
    </div>
    
    <div className="asset-description">
    <h2>Descripción del producto</h2>
    <p>{asset.descripcion}</p>
    </div>
    
    {/* Carrusel de otros assets */}
    <div className="related-assets-section">
    <h2>Más assets</h2>
    <div className="carousel-container">
    {randomAssets.map((a) => (
      <Link
      to={`/asset/${a._id}`}
      key={a._id}
      className="asset-card-link"
      >
      <div className="asset-card">
      <img
      src={
        a.imagen
        ? `${API_URL}/uploads/${a.imagen}`
        : "/images/placeholder.png"
      }
      alt={a.titulo}
      className="asset-image"
      />
      <h4 className="asset-title">{a.titulo}</h4>
      <p className="asset-category">{a.categoria}</p>
      </div>
      </Link>
    ))}
    </div>
    </div>
    {showLoginPopup && (
      <div className="modal-backdrop">
      <div className="modal">
      <h3>Inicia sesión para descargar</h3>
      <p>Debes tener una cuenta para descargar este asset.</p>
      <Link to="/login">
      <button className="primary">Ir a iniciar sesión</button>
      </Link>
      <button
      className="secondary"
      onClick={() => setShowLoginPopup(false)}
      >
      Cancelar
      </button>
      </div>
      </div>
    )}
    </div>
  );
}

export default AssetPage;
