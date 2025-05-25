import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { FiHeart, FiMessageSquare, FiSend, FiTrash2 } from "react-icons/fi"; // Import icons
import { Link, useParams } from "react-router-dom";
import "../styles/styleAsset.css";

// Componente para cargar y renderizar el modelo 3D
function Model({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} />;
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
        // Set comments if they exist
        setComments(data.comments || []);
        // Set likes count
        setLikesCount(data.likes?.length || 0);
        // Check if current user has liked this asset
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
      
      // Update UI with new comment
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
          {/* Vista 3D o imagen hay que cambiarlo yowers */}
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
              Subido por:{author
                ? author.usuario || "Sin nombre"
                : "Cargando..."}
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
            <div className="detail-row">
              <span className="label">Likes</span>
              <span className="value">{likesCount}</span>
            </div>
          </div>

          <div className="buttons">
            <button className="primary" onClick={handleDownload}>
              Descargar ahora
            </button>
            <button 
              className={`secondary ${isLiked ? 'liked' : ''}`}
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

      <div className="asset-description">
        <h2>Descripción del producto</h2>
        <p>{asset.descripcion}</p>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comentarios ({comments.length})</h3>
        
        {/* Comment input */}
        <form className="comment-input" onSubmit={handleCommentSubmit}>
          <div className="user-icon">
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
            style={{ 
              background: '#8e6dfd', 
              border: 'none', 
              borderRadius: '50%', 
              padding: '10px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            disabled={!currentUser || !newComment.trim()}
          >
            <FiSend color="#fff" size={16} />
          </button>
        </form>
        
        {/* Comments list */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          ) : (
            comments.map((comment) => (
              <div className="comment" key={comment._id}>
                <div className="user-icon">
                  <FiMessageSquare size={24} />
                </div>
                <div className="comment-content">
                  <div>
                    <span className="username">{comment.userName}</span>
                    <span className="timestamp">
                      {new Date(comment.timestamp).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    
                    {/* Delete button (only visible for comment owner or asset owner) */}
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
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Carrusel de otros assets */}
      <div className="related-assets-section">
        <h2>Más assets</h2>
        <div className="carousel-container">
          {randomAssets.map((a) => (
            <Link
              to={`/asset/${a._id}`}
              key={a._id}
              className="nova-asset-card"
            >
              <div className="nova-asset-image-container">
                <img
                  src={a.imagen ? a.imagen : "/images/placeholder.png"}
                  alt={a.titulo}
                  className="nova-asset-image"
                  onError={(e) => {
                    e.target.src = "/images/placeholder.png";
                  }}
                />
              </div>
              <div className="nova-asset-info">
                <h4 className="nova-asset-title">{a.titulo}</h4>
                
                <div className="nova-asset-tags">
                  {a.tags && a.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="nova-asset-tag">{tag}</span>
                  ))}
                  {a.tags && a.tags.length > 2 && (
                    <span className="nova-asset-tag-more">+{a.tags.length - 2}</span>
                  )}
                </div>
                
                <div className="nova-asset-footer">
                  <div className="nova-asset-stat">
                    <FiHeart className="nova-stat-icon" />
                    <span>{a.likes?.length || 0}</span>
                  </div>
                  <span className="nova-asset-date">
                    {new Date(a.fechaSubida || Date.now()).toLocaleDateString("es-ES", {
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
      </div>
      {showLoginPopup && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Inicia sesión para continuar</h3>
            <p>Debes tener una cuenta para interactuar con este asset.</p>
            <Link to="/login">
              <button className="primary">Ir a iniciar sesión</button>
            </Link>
            <button
              className="secondary"
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