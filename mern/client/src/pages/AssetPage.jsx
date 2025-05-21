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



  useEffect(() => {
    fetch(`http://localhost:5050/asset/${id}`)
      .then((res) => res.json())
      .then((data) => setAsset(data))
      .catch((err) => console.error("Error al cargar el asset:", err));
  }, [id]);

  useEffect(() => {
    fetch("http://localhost:5050/asset")
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
      alert("Debes estar logueado para descargar este asset.");
      return;
    }

    let userId = null;

    try {
      const decoded = jwtDecode(token);
      userId = decoded.id; // o decoded.userId dependiendo de tu token
    } catch (err) {
      console.error("Token inválido:", err);
      alert("Token inválido. Por favor, inicia sesión de nuevo.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/asset/download/filename.glb`, {
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
      link.download = asset.modelo;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al descargar el asset.");
    }
  };

//   const handleDownload = () => {
//     const userStr = localStorage.getItem("token");
//     const user = userStr ? JSON.parse(userStr) : null;
  
//     if (user && user._id) {
//       // Usuario autenticado: descargar
//       if (asset.modelo) {
//         const downloadUrl = `http://localhost:5050/uploads/${asset.modelo}`;
//         const link = document.createElement("a");
//         link.href = downloadUrl;
//         link.download = asset.modelo;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       } else {
//         alert("Este asset no tiene un modelo para descargar.");
//       }
//     } else {
//       // Usuario no autenticado: mostrar popup
//       setShowLoginPopup(true);
//     }
//   };
  
  
  

  if (!asset) return <p>Cargando...</p>;

    return (
        <div className="asset-page">
            <div className="asset-main">
                <div className="asset-image-section">
                    <img src={`http://localhost:5050/uploads/${asset.imagen}`} alt={asset.titulo} className="main-image" /> 
                    <div className="thumbnail-row">
                        <img src={`http://localhost:5050/uploads/${asset.imagen}`} alt={asset.titulo} className="thumbnail"/>
                        <img src={`http://localhost:5050/uploads/${asset.imagen}`} alt={asset.titulo} className="thumbnail"/>
                        <img src={`http://localhost:5050/uploads/${asset.imagen}`} alt={asset.titulo} className="thumbnail"/>
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
                        <button className="primary" onClick={handleDownload}>
                        Descargar ahora
                        </button>
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
                                ? `http://localhost:5050/uploads/${a.imagen}`
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
            {showLoginPopup && (
                <div className="modal-backdrop">
                    <div className="modal">
                    <h3>Inicia sesión para descargar</h3>
                    <p>Debes tener una cuenta para descargar este asset.</p>
                    <Link to="/login">
                        <button className="primary">Ir a iniciar sesión</button>
                    </Link>
                    <button className="secondary" onClick={() => setShowLoginPopup(false)}>
                        Cancelar
                    </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AssetPage;
