import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styleUploadAsset.css";

function UploadAssetPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: [],
    categories: "",
    modelo: null, // Archivo del modelo
    imagen: null, // Imagen asociada
  });
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirigir al login si no hay token
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (files && files[0]) {
        console.log("Archivo seleccionado:", files[0]);
        setForm((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagsChange = (e) => {
    setTagsInput(e.target.value);
    setForm((prev) => ({
      ...prev,
      tags: e.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      // Crear el FormData para enviar archivos
      const formData = new FormData();
      if (form.title) formData.append("titulo", form.title);
      if (form.description) formData.append("descripcion", form.description);
      if (form.categories) formData.append("categoria", form.categories);
      if (form.tags.length) {
        form.tags.forEach((tag) => formData.append("tags[]", tag)); // Enviar cada tag como un elemento del array
      }
      if (form.modelo) formData.append("modelo", form.modelo); // Archivo del modelo
      if (form.imagen) formData.append("imagen", form.imagen); // Imagen asociada
      formData.append("fechaSubida", new Date().toISOString()); // Fecha actual

      // Enviar la solicitud al backend
      const res = await fetch("http://localhost:5050/asset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en la cabecera
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al subir el asset.");
        return;
      }

      const data = await res.json();
      console.log("Respuesta del servidor:", data); // Verificar la respuesta del servidor
      setSuccess("¡Asset subido correctamente!");
      setForm({
        title: "",
        description: "",
        tags: [],
        categories: "",
        modelo: null,
        imagen: null,
      });
      setTagsInput("");
    } catch (err) {
      console.error("Error al subir el asset:", err);
      setError("Error de conexión al subir el asset.");
    }
  };

  return (
    <div className="upload-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <h1>Publicar tu asset</h1>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <div className="form-row">
          <div className="form-group">
            <h3 className="section-title">Archivos</h3>
            <label>Modelo</label>
            <div className="file-upload">
              <label htmlFor="modelo-upload-input">Examinar</label>
              <input
                id="modelo-upload-input"
                type="file"
                name="modelo"
                accept=".glb"
                onChange={handleChange}
                required
              />
              <span>o arrastra tu archivo</span>
            </div>
            <label>Imagen</label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <div className="form-group-2">
            <h3 className="section-title">Información</h3>
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
            <label>Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            <label>Categorías</label>
            <input
              type="text"
              name="categories"
              value={form.categories}
              onChange={handleChange}
            />
          </div>
          <div className="form-group form-actions-group">
            <h3 className="section-title">Etiquetas</h3>
            <input
              type="text"
              name="tags"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="ej: 3D, animación, textura"
            />
            <small className="input-helper">Separados por coma</small>
            <div className="form-actions">
              <button type="submit" className="primary">Publicar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UploadAssetPage;