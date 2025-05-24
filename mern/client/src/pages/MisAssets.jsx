import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const resUser = await fetch(`${API_URL}/user/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await resUser.json();
      if (!resUser.ok) return;

      setUserData(user);

      const resAssets = await fetch(`${API_URL}/asset`, {
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
    const res = await fetch(`${API_URL}/asset/${id}`, {
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

    const res = await fetch(`${API_URL}/asset/${editAsset._id}`, {
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
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {assets.map((asset) => (
                <li
                  key={asset._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #333",
                  }}
                >
                  {/* Título como enlace */}
                  <Link
                    to={`/asset/${asset._id}`}
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                      minWidth: 0,
                      flex: 1,
                      textDecoration: "none",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Titulo: {asset.titulo}
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginLeft: "24px"
                    }}
                  >
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(asset)}
                      style={{
                        background: "#a78bfa",
                        color: "#18181b",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(asset._id)}
                      style={{
                        background: "#e57373",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Modal de edición */}
      {showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <h2>Editar Asset</h2>
      <form
        className="modal-form"
        onSubmit={e => {
          e.preventDefault();
          handleSaveEdit();
        }}
      >
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={editForm.titulo}
          onChange={e => setEditForm(f => ({ ...f, titulo: e.target.value }))}
        />

        <label htmlFor="categoria">Categoría</label>
        <input
          id="categoria"
          type="text"
          value={editForm.categoria}
          onChange={e => setEditForm(f => ({ ...f, categoria: e.target.value }))}
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={editForm.descripcion}
          onChange={e => setEditForm(f => ({ ...f, descripcion: e.target.value }))}
          rows={3}
        />

        <label htmlFor="tags">Tags (separados por coma)</label>
        <input
          id="tags"
          type="text"
          value={editForm.tags}
          onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))}
        />

        <label htmlFor="imagen">Imagen</label>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={e => setEditForm(f => ({ ...f, imagen: e.target.files[0] }))}
        />

        <label htmlFor="modelo">Modelo</label>
        <input
          id="modelo"
          type="file"
          accept=".glb,.obj,.fbx"
          onChange={e => setEditForm(f => ({ ...f, modelo: e.target.files[0] }))}
        />

        <div className="modal-buttons">
          <button type="submit" className="edit-button">Guardar</button>
          <button type="button" className="edit-button" style={{ background: "#333", color: "#fff" }} onClick={() => setShowModal(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default MisAssets;