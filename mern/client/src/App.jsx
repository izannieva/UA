import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Perfil from "./pages/Perfil"; // <-- Importa la página de perfil
import RegisterPage from "./pages/RegisterPage";
import ResultadoBusqueda from "./pages/ResultadoBusqueda";
import UploadAssetPage from "./pages/UploadAssetPage";

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
