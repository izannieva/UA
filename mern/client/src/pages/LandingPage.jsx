import { Link } from "react-router-dom";
import "../styles/styles.css";

function LandingPage() {
  return (
    <div className="container">
      <h1>¡Bienvenido a Nova Assests!</h1>
      <Link to="/register" className="button">Registrarse</Link>
    </div>
  );
}

export default LandingPage;
