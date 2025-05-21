import "../styles/styleAsset.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// Componente para cargar y renderizar el modelo 3D con manejo de errores
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
  const API_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modelError, setModelError] = useState(false);
  const [viewMode, setViewMode] = useState('image'); // 'image' o 'model'

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/asset/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAsset(data);
        setLoading(false);
        
        // Si hay modelo, verificar si la ruta tiene extensión
        if (data.modelo3D || data.modelo) {
          // Si hay modelo, prefiere empezar en modo modelo
          setViewMode('model');
        }
      })
      .catch((err) => {
        console.error("Error al cargar el asset:", err);
        setLoading(false);
      });
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

  if (loading) return <p>Cargando...</p>;
  if (!asset) return <p>No se pudo cargar el asset</p>;

  // Verificar si el asset tiene un modelo 3D
  const modelPath = asset.modelo3D || asset.modelo;
  // Asegurar que la ruta del modelo tenga extensión
  const modelUrl = modelPath ? 
    `${API_URL}/uploads/${modelPath}` : null;
  
  // Función para manejar el cambio entre imagen y modelo 3D
  const toggleViewMode = () => {
    setViewMode(viewMode === 'image' ? 'model' : 'image');
  };

  // Manejo de error en el modelo
  const handleModelError = () => {
    setModelError(true);
    setViewMode('image');
  };

  return (
    <div className="asset-page">
      <div className="asset-main">
        <div className="asset-image-section">
          {modelUrl && viewMode === 'model' && !modelError ? (
            <div className="model-viewer-container">
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
              src={`${API_URL}/uploads/${asset.imagen}`} 
              alt={asset.titulo} 
              className="main-image" 
              onError={(e) => {
                e.target.src = "/images/placeholder.png";
              }}
            /> 
          )}
          
          {/* Miniaturas con opción para cambiar de vista */}
          <div className="thumbnail-row">
            <img 
              src={`${API_URL}/uploads/${asset.imagen}`} 
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
            <span className="author-name">{asset.autorId}</span>
          </div>

          <div className="tags">
            {asset.tags?.map((tag, index) => (
              <span className="tag" key={index}>{tag}</span>
            ))}
          </div>


          <div className="details">
            <div className="rating">
              ⭐ 4.9 <span className="votes">(33)</span>
            </div>
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
              <span className="label">Licencia</span>
              <span className="value">Estándar</span>
            </div>
            <div className="detail-row">
              <span className="label">Categoria</span>
              <span className="value">{asset.categoria}</span>
            </div>
            <div className="detail-row">
              <span className="label">Permite IA</span>
              <span className="value">No</span>
            </div>
            <div className="detail-row">
              <span className="label">Generado con IA</span>
              <span className="value">No</span>
            </div>
          </div>

          <div className="buttons">
            <button className="primary">Descargar ahora</button>
            <button className="secondary">Guardar en "Assets"</button>
            <div className="inline-buttons">
              <button className="tertiary">Compartir</button>
              <button className="tertiary danger">Denunciar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="asset-description">
        <h2>Descripción del producto</h2>
        <p>
          {asset.descripcion}
        </p>
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

      {/* Sección de comentarios */}
      <div className="comments-section">
        <h3>COMENTARIOS (1)</h3>

        <div className="comment-input">
          <div className="user-icon">
            <i className="fa fa-user-circle" />
          </div>
          <input
            type="text"
            placeholder="Leave a comment, share your feedback. Don't be shy ;)"
          />
        </div>

        <div className="comment">
          <div className="user-icon">
            <i className="fa fa-user-circle" />
          </div>
          <div className="comment-content">
            <div className="username">
              <a href="#">3dg21</a> <span className="handle">@3dg21</span>
            </div>
            <div className="timestamp">a day ago</div>
            <div className="comment-text">
              nice, but there's a sharp edge near the bottom
            </div>
            <div className="reply">Reply</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AssetPage;
