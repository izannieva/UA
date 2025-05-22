import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/styleAsset.css";

// Componente para cargar y renderizar el modelo 3D
function Model({ modelUrl, onError }) {
  try {
    const { scene } = useGLTF(modelUrl);
    return <primitive object={scene} />;
  } catch (error) {
    console.error("Error cargando el modelo:", error);
    onError && onError(error);
    return null;
  }
}

function AssetPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [author, setAuthor] = useState(null);

  // Estado para el visor 3D
  const [modelError, setModelError] = useState(false);
  const [viewMode, setViewMode] = useState('image'); // 'image' o 'model'

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/asset/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAsset(data);
        if (data.autorId) {
          fetch(`${API_URL}/user/${data.autorId}`)
            .then((res) => res.json())
            .then((userData) => setAuthor(userData))
            .catch((err) => console.error("Error al cargar el autor:", err));
        }
        // Si hay modelo, prefiere empezar en modo modelo
        if (data.modelo) setViewMode('model');
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
      const response = await fetch(asset.modelo, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${asset.titulo || "modelo"}.glb`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error al descargar el archivo:", err);
      alert("Ocurrió un error al descargar el asset.");
    }
  };

  if (!asset) return <p>Cargando...</p>;

  // --- INICIO INTEGRACIÓN VISTA 3D ---
  const modelUrl = asset.modelo || null;
  const handleModelError = () => {
    setModelError(true);
    setViewMode('image');
  };
  // --- FIN INTEGRACIÓN VISTA 3D ---

  return (
    <div className="asset-page">
      <div className="asset-main">
        <div className="asset-image-section"
         style={{
                width: "100%",
                height: "600px",
                background: "#181824",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
          {/* Vista 3D o imagen hay que cambiarlo */}
          {modelUrl && viewMode === 'model' && !modelError ? (
            <div
              className="model-viewer-container"
              style={{
                width: "100%",
                height: "600px",
                background: "#181824",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
>
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <Stage environment="city" intensity={0.6}>
                    <Model modelUrl={modelUrl} onError={handleModelError} />
                  </Stage>
                  <OrbitControls 
                    autoRotate 
                    enableZoom 
                    enablePan 
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2}
                  />
                </Suspense>
              </Canvas>
            </div>
          ) : (
            <img
              src={asset.imagen || "/images/placeholder.png"}
              alt={asset.titulo}
              className="main-image"
              onError={(e) => {
                e.target.src = "/images/placeholder.png";
              }}
            />
          )}

          {/* Miniaturas para cambiar de vista */}
          <div className="thumbnail-row">
            <img
              src={asset.imagen || "/images/placeholder.png"}
              alt={asset.titulo}
              className={`thumbnail ${viewMode === 'image' ? 'active' : ''}`}
              onClick={() => setViewMode('image')}
              onError={(e) => {
                e.target.src = "/images/placeholder.png";
              }}
            />
            {modelUrl && !modelError && (
              <div
                className={`thumbnail model-thumbnail ${viewMode === 'model' ? 'active' : ''}`}
                onClick={() => setViewMode('model')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "#232329",
                  color: "#a78bfa",
                  borderRadius: "8px",
                  padding: "0 12px",
                  marginLeft: "8px",
                  fontWeight: "bold"
                }}
              >
                <span>Modelo 3D</span>
              </div>
            )}
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
                  src={a.imagen ? a.imagen : "/images/placeholder.png"}
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