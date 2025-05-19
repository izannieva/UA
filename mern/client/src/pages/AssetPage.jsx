import "../styles/styleAsset.css";
import assetImage from "../assets/asset-preview.jpg";

function AssetPage() {
    return (
        <div className="asset-page">
            <div className="asset-main">
                <div className="asset-image-section">
                    <img src={assetImage} alt="Asset preview" className="main-image" />
                    <div className="thumbnail-row">
                        <img src={assetImage} className="thumbnail" alt="thumb" />
                        <img src={assetImage} className="thumbnail" alt="thumb" />
                        <img src={assetImage} className="thumbnail" alt="thumb" />
                    </div>
                </div>

                <div className="asset-info-section">
                    <h1 className="asset-title">Asset3D - Nombre</h1>
                    <div className="author-section">
                        <i className="fa fa-user-circle author-icon" />
                        <span className="author-name">Stamiz</span>
                    </div>

                    <div className="tags">
                        <span className="tag">Modelo3D</span>
                        <span className="tag">WW - 3</span>
                        <span className="tag">Pack</span>
                    </div>

                    <div className="details">
                        <div className="rating">
                            ⭐ 4.9 <span className="votes">(33)</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Fecha</span>
                            <span className="value">1 de Mayo de 2012</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Licencia</span>
                            <span className="value">Estándar</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Edad media</span>
                            <span className="value">Madura</span>
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
                    Este paquete de assets recrea un mercado detallado del Medio Oriente antiguo, ideal para crear entornos inmersivos en juegos y simulaciones.
                    Incluye modelos artesanales, texturas realistas y una amplia variedad de props como alfombras, cerámica, frutas y puestos de mercado.
                    Optimizado para motores modernos y compatible con Unreal Engine.
                </p>
            </div>

            {/* Carrusel de otros assets */}
            <div className="related-assets-section">
                <h2>Más assets del creador</h2>
                <div className="carousel-container">
                    <div className="carousel-item">
                        <img src={assetImage} alt="Misión Minerva" />
                        <div className="item-info">
                            <div className="item-title">Misión en Minerva</div>
                            <div className="item-sub">KitBash3D · ⭐ 4.3 (64)</div>
                            <div className="item-price">From Free</div>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={assetImage} alt="Atlantis" />
                        <div className="item-info">
                            <div className="item-title">Atlantis</div>
                            <div className="item-sub">KitBash3D · ⭐ 4.9</div>
                            <div className="item-price">From $199.99</div>
                        </div>
                    </div>
                    {/* Repite más items si quieres */}
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
