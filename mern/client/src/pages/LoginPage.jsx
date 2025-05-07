import LoginForm from "../components/LoginForm";
import '../styles/stylesRegistro.css';

function LoginPage({ setIsAuthenticated }) { // Recibe setIsAuthenticated como prop
  return (
    <div className="container">
      <LoginForm setIsAuthenticated={setIsAuthenticated} /> {/* Pasa setIsAuthenticated a LoginForm */}
    </div>
  );
}

export default LoginPage;