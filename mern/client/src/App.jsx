import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Perfil from "./pages/Perfil";
import RegisterPage from "./pages/RegisterPage";
import ResultadoBusqueda from "./pages/ResultadoBusqueda";
import UploadAssetPage from "./pages/UploadAssetPage";
import AssetPage from "./pages/AssetPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si el token existe en localStorage al cargar la app
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/upload-asset" element={<UploadAssetPage />} />
        <Route path="/busqueda" element={<ResultadoBusqueda />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/asset" element={<AssetPage />} />
      </Routes>
    </>
  );
}

export default App;