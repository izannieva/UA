import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AssetPage from "./pages/AssetPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MisAssets from "./pages/MisAssets";
import Perfil from "./pages/Perfil";
import RegisterPage from "./pages/RegisterPage";
import ResultadoBusqueda from "./pages/ResultadoBusqueda";
import UploadAssetPage from "./pages/UploadAssetPage";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Comprobar si el token existe al cargar la app
  useEffect(() => {
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
        <Route path="/asset/:id" element={<AssetPage />} />
        <Route path="/mis-assets" element={<MisAssets />} />
      </Routes>
    </>
  );
}

export default App;