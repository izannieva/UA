import React, { useState } from "react";
import "../styles/styleUploadAsset.css";

function UploadAssetPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: [],
    categories: "",
    file: null,
    imagen: null,
  });
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Manejo de campos
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "file" || name === "imagen") {
      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else if (name === "categories") {
      setForm((prev) => ({
        ...prev,
        categories: value,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Añadir tags como array
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

    // Validación de campos obligatorios
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.categories.trim() ||
      !form.tags.length ||
      !form.file ||
      !form.imagen
    ) {
      setError("Por favor, rellena todos los campos obligatorios.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", form.title);
      formData.append("descripcion", form.description);
      formData.append("tipo", form.categories);
      formData.append("tags", JSON.stringify(form.tags));
      formData.append("fechaSubida", new Date().toISOString());
      formData.append("archivo", form.file);
      formData.append("imagen", form.imagen);
      formData.append("autorId", "USER_ID"); // Reemplaza por el ID real del usuario

      const res = await fetch("/api/assets", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al subir el asset.");
        return;
      }

      setSuccess("¡Asset subido correctamente!");
      setForm({
        title: "",
        description: "",
        tags: [],
        categories: "",
        file: null,
        imagen: null,
      });
      setTagsInput("");
    } catch (err) {
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
          {/* Columna 1: Archivos */}
          <div className="form-group">
            <h3 className="section-title">Archivos</h3>
            <label>Modelo <span style={{ color: "#a78bfa" }}>*</span></label>
            <div className="file-upload">
              <label htmlFor="file-upload-input">Examinar</label>
              <input
                id="file-upload-input"
                type="file"
                name="file"
                onChange={handleChange}
                required
              />
              <span>o arrastra tu archivo</span>
            </div>
            <label>Imagen <span style={{ color: "#a78bfa" }}>*</span></label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>
          {/* Columna 2: Información */}
          <div className="form-group-2">
            <h3 className="section-title">Información</h3>
            <label>Título <span style={{ color: "#a78bfa" }}>*</span></label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <label>Descripción <span style={{ color: "#a78bfa" }}>*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
            <label>Categorías <span style={{ color: "#a78bfa" }}>*</span></label>
            <input
              type="text"
              name="categories"
              value={form.categories}
              onChange={handleChange}
              required
            />
          </div>
          {/* Columna 3: Tags y Acción */}
          <div className="form-group form-actions-group">
            <h3 className="section-title">Etiquetas y Acción</h3>
            <label>Tags <span style={{ color: "#a78bfa" }}>*</span></label>
            <input
              type="text"
              name="tags"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="ej: 3D, animación, textura"
              required
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
