import "../styles/styleAsset.css";
import assetImage from "../assets/asset-preview.jpg"; // usa tu imagen aquí

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
                <h2>Product Description</h2>
                <p>
                    This asset pack brings to life a detailed ancient Middle Eastern market, ideal for creating immersive environments in games and simulations.
                    Featuring handcrafted models, realistic textures, and a wide variety of props such as carpets, pottery, fruits, and market stalls, it's perfect for
                    historical or fantasy settings. Optimized for modern engines and compatible with Unreal Engine.
                </p>
            </div>
        </div>
    );
}

export default AssetPage;
