import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UploadAssetPage from "./pages/UploadAssetPage";
import Navbar from "./components/Navbar";
import ResultadoBusqueda from "./pages/ResultadoBusqueda";
import Perfil from "./pages/Perfil"; // <-- Importa la página de perfil

function App() {
  return (
    <>
      <Navbar /> {/* Navbar se renderiza aquí */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload-asset" element={<UploadAssetPage />} />
        <Route path="/busqueda" element={<ResultadoBusqueda />} />
        <Route path="/perfil" element={<Perfil />} /> {/* Agrega la ruta del perfil */}
      </Routes>
    </>
  );
}

export default App;
