import { useEffect, useState } from "react";
import SidebarPerfil from "../components/SidebarPerfil";
import "../styles/StylePerfil.css";

function Perfil() {
    const API_URL = import.meta.env.VITE_API_URL;

  const [userData, setUserData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    usuario: "",
    pais: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/user/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data);
          setFormData({
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            correo: data.correo || "",
            usuario: data.usuario || "",
            pais: data.pais || "",
          });
        } else {
          console.error("Error cargando perfil:", data.error);
        }
      } catch (err) {
        console.error("Error conexión perfil:", err);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) return <p style={{ color: "white" }}>Cargando perfil...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autorizado");
      setLoading(false);
      return;
    }
    try {
      const cleanFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v != null && v !== "")
      );

      const res = await fetch(`${API_URL}/user/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        
        setError(data.error || "Error actualizando perfil");
        setLoading(false);
        return;
      }else{
        console.log("Perfil actualizado correctamente",data);
      }

      setUserData(formData);
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="perfil-container">
      <SidebarPerfil userEmail={userData.correo} />
      <main className="perfil-main">
        <section className="perfil-info">
          <h2>Información Personal</h2>
          <button className="edit-button" onClick={() => setModalOpen(true)}>Editar Perfil</button>
          <div className="info-grid">
            {["nombre", "apellido", "correo", "usuario", "pais"].map(field => (
              <div key={field} className="info-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <p>{userData[field]}</p>
              </div>
            ))}
          </div>
        </section>

        {modalOpen && (
  <div className="modal-overlay" onClick={() => setModalOpen(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Editar Perfil</h2>
              <form onSubmit={handleSubmit} className="modal-form">
                {["nombre", "apellido", "correo", "usuario", "pais"].map(field => (
                  <div key={field} className="form-row">
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type={field === "correo" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                {error && <p className="error">{error}</p>}
                <div className="modal-buttons">
                  <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
                  <button type="button" onClick={() => setModalOpen(false)} disabled={loading}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Perfil;
