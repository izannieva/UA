import "../styles/styles.css";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="search-bar">
          <input type="text" placeholder="Buscar assets..." />
          <button className="search-button">🔍</button>
        </div>
      </header>
      <main className="landing-main">
        <h1>¡Bienvenido a Nova Assets!</h1>
        <p>En esta página podrás encontrar infinidad de assets para todo tipo de videojuegos.</p>
        <div className="content-section">
          <div className="filters">
            <input type="text" placeholder="Filtrar por..." className="filter-input" />
            <ul className="filter-list">
              <li><Link to="/busqueda?filter=objetos">Objetos</Link></li>
              <li><Link to="/busqueda?filter=modelos3d">Modelos 3D</Link></li>
              <li><Link to="/busqueda?filter=packs">Packs</Link></li>
              <li><Link to="/busqueda?filter=personajes">Personajes</Link></li>
            </ul>
          </div>
          <div className="assets-preview">
            <h2>Modelos 3D <Link to="/busqueda?filter=modelos3d">→</Link></h2>
            <div className="assets-carousel">
              <div className="asset-item">
                <img src="/images/creeper.png" alt="Creeper" />
                <div className="tags">
                  <span>Minecraft</span>
                  <span>3D</span>
                  <span>Pack</span>
                  <span>Characters</span>
                </div>
              </div>
              <div className="asset-item">
                <img src="/images/dinosaur.png" alt="Dinosaur" />
                <div className="tags">
                  <span>3D</span>
                  <span>Animals</span>
                  <span>Creatures</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
