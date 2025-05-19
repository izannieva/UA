// src/pages/MisAssets.jsx
import { useEffect, useState } from "react";
import SidebarPerfil from "../components/SidebarPerfil";
import "../styles/StylePerfil.css";

function MisAssets() {
  const [userData, setUserData] = useState(null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const resUser = await fetch("http://localhost:5050/user/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await resUser.json();
      if (!resUser.ok) return;

      setUserData(user);

      const resAssets = await fetch("http://localhost:5050/asset", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allAssets = await resAssets.json();
      const userAssets = allAssets.filter(
        (asset) => asset.autorId === user.id || asset.autorId === user._id
      );

      setAssets(userAssets);
    };

    fetchData();
  }, []);

  if (!userData) return <p style={{ color: "white" }}>Cargando assets...</p>;

  return (
    <div className="perfil-container">
      <SidebarPerfil userEmail={userData.correo} />
      <main className="perfil-main">
        <section className="perfil-info">
          <h2>Mis Assets</h2>
          {assets.length === 0 ? (
            <p>No has subido ningún asset aún.</p>
          ) : (
            <ul>
              {assets.map((asset) => (
                <li key={asset._id}>
                  <strong>{asset.titulo}</strong> - {asset.fechaSubida}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default MisAssets;
