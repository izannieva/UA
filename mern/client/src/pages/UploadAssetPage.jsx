import React, { useState } from "react";
import "../styles/styleUploadAsset.css";

function UploadAssetPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    categories: "",
    visibility: "Todos", // Valor inicial del desplegable
    allowComments: true,
    ageRestriction: true,
    promotional: true,
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Asset enviado!");
  };

  return (
    <div className="upload-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <h1>Publicar tu asset</h1>
        <div className="form-row">
          <div className="form-group">
            <label>Modelo</label>
            <div className="file-upload">
              <label htmlFor="file-upload-input">Examinar</label>
              <input id="file-upload-input" type="file" name="file" onChange={handleChange} />
              <span>o arrastra tu imagen</span>
            </div>
            <label>Tags</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange} />
          </div>
          <div className="form-group-2">
            <label>Título</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} />
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
            <label>Categorías</label>
            <input type="text" name="categories" value={form.categories} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>¿Quién puede verlo?</label>
            <select
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className="dropdown"
            >
              <option value="Todos">Todos</option>
              <option value="Privado">Privado</option>
            </select>
            <div className="switch-group">
              <label>
                Permitir Comentarios
                <input
                  type="checkbox"
                  name="allowComments"
                  checked={form.allowComments}
                  onChange={handleChange}
                />
              </label>
              <label>
                Restricción de edad
                <input
                  type="checkbox"
                  name="ageRestriction"
                  checked={form.ageRestriction}
                  onChange={handleChange}
                />
              </label>
              <label>
                Contenido Promocional
                <input
                  type="checkbox"
                  name="promotional"
                  checked={form.promotional}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="secondary">Guardar</button>
              <button type="submit" className="primary">Publicar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UploadAssetPage;
