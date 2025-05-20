// src/pages/MisAssets.jsx
import { useEffect, useState } from "react";
import SidebarPerfil from "../components/SidebarPerfil";
import "../styles/StylePerfil.css";

function MisAssets() {
  const [userData, setUserData] = useState(null);
  const [assets, setAssets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [editForm, setEditForm] = useState({
    titulo: "",
    categoria: "",
    descripcion: "",
    tags: "",
    imagen: null,
    modelo: null,
});

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

  // Eliminar asset
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este asset?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5050/asset/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a._id !== id));
    } else {
      alert("Error al eliminar el asset");
    }
  };

  // Abrir modal de edición
  const handleEdit = (asset) => {
  setEditAsset(asset);
  setEditForm({
    titulo: asset.titulo || "",
    categoria: asset.categoria || "",
    descripcion: asset.descripcion || "",
    tags: Array.isArray(asset.tags) ? asset.tags.join(", ") : (asset.tags || ""),
    imagen: null,
    modelo: null,
  });
  setShowModal(true);
};

  // Guardar cambios
  const handleSaveEdit = async () => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("titulo", editForm.titulo);
  formData.append("categoria", editForm.categoria);
  formData.append("descripcion", editForm.descripcion);
  formData.append("tags", JSON.stringify(editForm.tags.split(",").map(t => t.trim()).filter(Boolean)));
  if (editForm.imagen) formData.append("imagen", editForm.imagen);
  if (editForm.modelo) formData.append("modelo", editForm.modelo);

  const res = await fetch(`http://localhost:5050/asset/${editAsset._id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (res.ok) {
    const data = await res.json();
    console.log(data.message);
    // Actualiza el asset en el estado local
    setAssets(prev =>
      prev.map(a =>
        a._id === editAsset._id
          ? {
              ...a,
              titulo: editForm.titulo,
              categoria: editForm.categoria,
              descripcion: editForm.descripcion,
              tags: editForm.tags.split(",").map(t => t.trim()).filter(Boolean),
              // Si has subido nueva imagen/modelo, deberías actualizar aquí también
              imagen: editForm.imagen ? editForm.imagen.name : a.imagen,
              modelo: editForm.modelo ? editForm.modelo.name : a.modelo,
            }
          : a
      )
    );
    setShowModal(false);
    setEditAsset(null);
  } else {
    alert("Error al editar el asset");
  }
};

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
            <div className="assets-grid">
              {assets.map((asset) => (
                <div className="asset-card2" key={asset._id}>
                  <img
                    src={
                      asset.imagen
                        ? `http://localhost:5050/uploads/${asset.imagen}`
                        : "/images/placeholder.png"
                    }
                    alt={asset.titulo}
                    className="asset-image"
                  />
                  <h4 className="asset-title">{asset.titulo}</h4>
                  <p className="asset-category">{asset.categoria}</p>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(asset)}
                      style={{ background: "#a78bfa", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer" }}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(asset._id)}
                      style={{ background: "#e57373", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer" }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal de edición */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#232329",
              padding: "32px",
              borderRadius: "12px",
              minWidth: "320px",
              color: "#fff",
              boxShadow: "0 4px 32px rgba(0,0,0,0.3)"
            }}
          >
            <h3>Editar Asset</h3>
            <label>Título</label>
            <input
              type="text"
              value={editForm.titulo}
              onChange={e => setEditForm(f => ({ ...f, titulo: e.target.value }))}
              style={{ width: "100%", marginBottom: "12px", padding: "8px", borderRadius: "6px", border: "1px solid #333", background: "#18181b", color: "#fff" }}
            />
            <label>Categoría</label>
            <input
              type="text"
              value={editForm.categoria}
              onChange={e => setEditForm(f => ({ ...f, categoria: e.target.value }))}
              style={{ width: "100%", marginBottom: "12px", padding: "8px", borderRadius: "6px", border: "1px solid #333", background: "#18181b", color: "#fff" }}
            />
            <label>Descripción</label>
            <textarea
              value={editForm.descripcion}
              onChange={e => setEditForm(f => ({ ...f, descripcion: e.target.value }))}
              style={{ width: "100%", marginBottom: "12px", padding: "8px", borderRadius: "6px", border: "1px solid #333", background: "#18181b", color: "#fff" }}
            />

            <label>Tags (separados por coma)</label>
            <input
              type="text"
              value={editForm.tags}
              onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))}
              style={{ width: "100%", marginBottom: "12px", padding: "8px", borderRadius: "6px", border: "1px solid #333", background: "#18181b", color: "#fff" }}
            />

            <label>Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setEditForm(f => ({ ...f, imagen: e.target.files[0] }))}
              style={{ marginBottom: "12px" }}
            />

            <label>Modelo</label>
            <input
              type="file"
              accept=".glb,.obj,.fbx"
              onChange={e => setEditForm(f => ({ ...f, modelo: e.target.files[0] }))}
              style={{ marginBottom: "12px" }}
            />
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button
                onClick={handleSaveEdit}
                style={{ background: "#a78bfa", color: "#18181b", border: "none", borderRadius: "6px", padding: "8px 18px", fontWeight: "bold", cursor: "pointer" }}
              >
                Guardar
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "#333", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 18px", cursor: "pointer" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisAssets;