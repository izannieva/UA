import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { FiHeart, FiMessageSquare, FiSend, FiTrash2, FiRefreshCw, FiRotateCcw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  // Estado para el visor 3D
  const [modelError, setModelError] = useState(false);
  const [viewMode, setViewMode] = useState('image'); // 'image' o 'model'

  const API_URL = import.meta.env.VITE_API_URL;

  // Get current user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/user/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((userData) => {
          if (!userData.error) {
            setCurrentUser(userData);
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [API_URL]);

  // First, get asset data effect (keep your existing one)
  useEffect(() => {
    fetch(`${API_URL}/asset/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAsset(data);
        setComments(data.comments || []);
        setLikesCount(data.likes?.length || 0);
        if (currentUser && data.likes) {
          setIsLiked(data.likes.includes(currentUser.id));
        }
        
        if (data.autorId) {
          const token = localStorage.getItem("token");
          fetch(`${API_URL}/user/${data.autorId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then((res) => res.json())
            .then((userData) => setAuthor(userData))
            .catch((err) => console.error("Error al cargar el autor:", err));
        }
        // Si hay modelo, prefiere empezar en modo modelo
        if (data.modelo) setViewMode('model');
      })
      .catch((err) => console.error("Error al cargar el asset:", err));
  }, [id, currentUser, API_URL]);

  useEffect(() => {
    fetch(`${API_URL}/asset`)
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch(() => setAssets([]));
  }, [API_URL]);

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

  // Like/unlike functionality
  const handleLikeToggle = async () => {
    if (!currentUser) {
      setShowLoginPopup(true);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(`${API_URL}/asset/${id}/like`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${isLiked ? "quitando" : "añadiendo"} like`);
      }

      // Update UI
      setIsLiked(!isLiked);
      setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
    } catch (err) {
      console.error("Error al gestionar like:", err);
      alert(`Error al ${isLiked ? "quitar" : "dar"} like.`);
    }
  };

  // Comments functionality
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setShowLoginPopup(true);
      return;
    }

    if (!newComment.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/asset/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        throw new Error("Error al añadir comentario");
      }

      const data = await response.json();
      setComments([...comments, data.comment]);
      setNewComment(""); // Clear input
    } catch (err) {
      console.error("Error al añadir comentario:", err);
      alert("Error al añadir comentario.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/asset/${id}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar comentario");
      }

      // Update UI
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      alert("Error al eliminar comentario.");
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
    <div className="asset-view-page">
      <div className="asset-view-main">
        <div className="asset-view-image-section">
          {modelUrl && viewMode === 'model' && !modelError ? (
            <div className="asset-view-model-container">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }} shadows>
                <Suspense fallback={null}>
                  <color attach="background" args={['#1a1a1f']} />
                  <fog attach="fog" args={['#1a1a1f', 8, 30]} />
                  <ambientLight intensity={0.4} />
                  <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={0.8}
                    castShadow 
                    shadow-mapSize-width={1024} 
                    shadow-mapSize-height={1024}
                  />
                  <spotLight 
                    position={[-10, 10, 5]} 
                    angle={0.15} 
                    penumbra={1} 
                    intensity={0.5} 
                  />
                  <Stage 
                    environment="night" 
                    intensity={0.5}
                    contactShadow={{ opacity: 0.7, blur: 2 }}
                    preset="rembrandt"
                    adjustCamera={true}
                  >
                    <Model modelUrl={modelUrl} onError={handleModelError} />
                  </Stage>
                  <OrbitControls 
                    autoRotate 
                    autoRotateSpeed={1}
                    enableZoom 
                    enablePan 
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 1.5}
                    dampingFactor={0.05}
                    minDistance={3}
                    maxDistance={15}
                  />
                </Suspense>
              </Canvas>
              
              <div className="asset-view-model-controls">
                <button className="asset-view-model-button" onClick={() => { /* Implementar reset de cámara */ }}>
                  <FiRefreshCw size={16} />
                </button>
                <button className="asset-view-model-button" onClick={() => { /* Implementar toggle de rotación */ }}>
                  <FiRotateCcw size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="asset-view-image-container">
              <img
                src={asset.imagen || "/images/placeholder.png"}
                alt={asset.titulo}
                className="asset-view-main-image"
                onError={(e) => {
                  e.target.src = "/images/placeholder.png";
                }}
              />
              <div className="asset-view-image-loading"></div>
            </div>
          )}

          <div className="asset-view-thumbnail-row">
            <img
              src={asset.imagen || "/images/placeholder.png"}
              alt={asset.titulo}
              className={`asset-view-thumbnail ${viewMode === 'image' ? 'active' : ''}`}
              onClick={() => setViewMode('image')}
              onError={(e) => {
                e.target.src = "/images/placeholder.png";
              }}
            />
            {modelUrl && !modelError && (
              <div
                className={`asset-view-model-thumbnail ${viewMode === 'model' ? 'active' : ''}`}
                onClick={() => setViewMode('model')}
              >
                <span>3D</span>
              </div>
            )}
          </div>
        </div>

        <div className="asset-view-info-section">
          <h1 className="asset-view-title">{asset.titulo}</h1>
          <div className="asset-view-author-section">
            <i className="fa fa-user-circle asset-view-author-icon" />
            
            <span className="asset-view-author-name">
              Subido por:{author
                ? author.usuario || "Sin nombre"
                : "Cargando..."}
            </span>
          </div>

          <div className="asset-view-tags">
            {asset.tags?.map((tag, index) => (
              <span className="asset-view-tag" key={index}>
                {tag}
              </span>
            ))}
          </div>

          <div className="asset-view-details">
            <div className="asset-view-detail-row">
              <span className="asset-view-label">Fecha</span>
              <span className="asset-view-value">
                {new Date(asset.fechaSubida).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="asset-view-detail-row">
              <span className="asset-view-label">Categoria</span>
              <span className="asset-view-value">{asset.categoria}</span>
            </div>
            <div className="asset-view-detail-row">
              <span className="asset-view-label">Likes</span>
              <span className="asset-view-value">{likesCount}</span>
            </div>
          </div>

          <div className="asset-view-buttons">
            <button className="asset-view-primary" onClick={handleDownload}>
              Descargar ahora
            </button>
            <button 
              className={`asset-view-secondary ${isLiked ? 'asset-view-liked' : ''}`}
              onClick={handleLikeToggle}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                background: isLiked ? 'rgba(167, 139, 250, 0.2)' : '#292931',
                color: isLiked ? '#a78bfa' : 'white'
              }}
            >
              <FiHeart style={{ fill: isLiked ? '#a78bfa' : 'none' }} /> 
              {isLiked ? 'Te gusta' : 'Me gusta'}
            </button>
          </div>
        </div>
      </div>

      <div className="asset-view-description">
        <h2>Descripción del producto</h2>
        <p>{asset.descripcion}</p>
      </div>

      <div className="asset-view-comments">
        <h3>Comentarios ({comments.length})</h3>
        
        <form className="asset-view-comment-input" onSubmit={handleCommentSubmit}>
          <div className="asset-view-user-icon">
            <FiMessageSquare size={24} />
          </div>
          <input 
            type="text" 
            placeholder={currentUser ? "Añade un comentario..." : "Inicia sesión para comentar"} 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!currentUser}
          />
          <button 
            type="submit" 
            disabled={!currentUser || !newComment.trim()}
          >
            <FiSend color="#fff" size={16} />
          </button>
        </form>
        
        <div className="asset-view-comments-list">
          {comments.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          ) : (
            comments.map((comment) => (
              <div className="asset-view-comment" key={comment._id}>
                <div className="asset-view-user-icon">
                  <FiMessageSquare size={24} />
                </div>
                <div className="asset-view-comment-content">
                  <div>
                    <span className="asset-view-username">{comment.userName}</span>
                    <span className="asset-view-timestamp">
                      {new Date(comment.timestamp).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    
                    {currentUser && (currentUser.id === comment.userId || currentUser.id === asset.autorId) && (
                      <button 
                        onClick={() => handleDeleteComment(comment._id)}
                        style={{ 
                          background: 'none', 
                          border: 'none',
                          cursor: 'pointer',
                          color: '#e57373',
                          marginLeft: '10px',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="asset-view-comment-text">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="asset-view-related-section">
        <h2>
          Más assets
          {/* Aquí podrías agregar un botón "Ver todos" si lo deseas */}
        </h2>
        
        <div className="asset-view-carousel-wrapper">
          {/* Botones de navegación */}
          <button 
            className="asset-view-carousel-nav prev"
            onClick={() => {
              const carousel = document.querySelector('.asset-view-carousel');
              carousel.scrollBy({left: -600, behavior: 'smooth'});
            }}
          >
            <FiChevronLeft size={24} />
          </button>
          
          <button 
            className="asset-view-carousel-nav next"
            onClick={() => {
              const carousel = document.querySelector('.asset-view-carousel');
              carousel.scrollBy({left: 600, behavior: 'smooth'});
            }}
          >
            <FiChevronRight size={24} />
          </button>
          
          <div className="asset-view-carousel">
            {randomAssets.map((a, index) => {
              // Verificar si el asset es nuevo (menos de 7 días)
              const isNew = (Date.now() - new Date(a.fechaSubida || Date.now()).getTime()) < 7 * 24 * 60 * 60 * 1000;
              
              return (
                <Link
                  to={`/asset/${a._id}`}
                  key={a._id}
                  className="asset-view-card"
                >
                  {isNew && <span className="asset-view-card-badge">Nuevo</span>}
                  
                  <div className="asset-view-card-image-container">
                    <img
                      src={a.imagen ? a.imagen : "/images/placeholder.png"}
                      alt={a.titulo}
                      className="asset-view-card-image"
                      onError={(e) => {
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                    <div className="asset-view-card-image-overlay"></div>
                  </div>
                  
                  <div className="asset-view-card-info">
                    <div>
                      <h4 className="asset-view-card-title">{a.titulo}</h4>
                      
                      <div className="asset-view-card-tags">
                        {a.tags && a.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="asset-view-card-tag">{tag}</span>
                        ))}
                        {a.tags && a.tags.length > 2 && (
                          <span className="asset-view-card-tag-more">+{a.tags.length - 2}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="asset-view-card-footer">
                      <div className="asset-view-card-stat">
                        <FiHeart />
                        <span>{a.likes?.length || 0}</span>
                      </div>
                      <span className="asset-view-card-date">
                        {new Date(a.fechaSubida || Date.now()).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Indicadores de posición (opcional) */}
          <div className="asset-view-carousel-indicator">
            {[...Array(Math.min(5, randomAssets.length))].map((_, i) => (
              <div 
                key={i} 
                className={`asset-view-carousel-dot ${i === 0 ? 'active' : ''}`}
                onClick={() => {
                  const carousel = document.querySelector('.asset-view-carousel');
                  const cardWidth = carousel.querySelector('.asset-view-card').offsetWidth;
                  carousel.scrollTo({left: i * (cardWidth + 20), behavior: 'smooth'});
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      {showLoginPopup && (
        <div className="asset-view-modal-backdrop">
          <div className="asset-view-modal">
            <h3>Inicia sesión para continuar</h3>
            <p>Debes tener una cuenta para interactuar con este asset.</p>
            <Link to="/login">
              <button className="asset-view_primary">Ir a iniciar sesión</button>
            </Link>
            <button
              className="asset-view-secondary"
              onClick={() => setShowLoginPopup(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetPage;