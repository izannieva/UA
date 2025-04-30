import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UploadAssetPage from "./pages/UploadAssetPage"; // <-- Agrega esta línea
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar /> {/* Navbar se renderiza aquí */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload-asset" element={<UploadAssetPage />} />
      </Routes>
    </>
  );
}

export default App;
