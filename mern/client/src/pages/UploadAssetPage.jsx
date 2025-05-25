import { useEffect, useState } from "react";
import { FiBox, FiCheck, FiImage, FiPackage, FiUser, FiX } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import "../styles/styleUploadAsset.css";

function UploadAssetPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: [],
    categories: "Personajes",
    modelo: null,
    imagen: null,
  });
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Categorías disponibles para el selector
  const availableCategories = [
    { id: "Personajes", name: "Personajes", icon: <FiUser /> },
    { id: "Objetos", name: "Objetos", icon: <FiBox /> },
    { id: "Texturas", name: "Texturas", icon: <FiImage /> },
    { id: "Paquetes", name: "Paquetes", icon: <FiPackage /> }
  ];

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (files && files[0]) {
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
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagsInput.trim()) return;
    
    // Dividir input por comas y filtrar duplicados
    const newTags = tagsInput.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !form.tags.includes(tag));
    
    if (newTags.length > 0) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, ...newTags]
      }));
      setTagsInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleCancel = () => {
    navigate("/"); // Volver al menú principal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones del lado del cliente
    if (!form.modelo) {
      setError("El modelo 3D es obligatorio");
      return;
    }

    if (!form.title || !form.description) {
      setError("El título y la descripción son obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      // Crear el FormData para enviar archivos
      const formData = new FormData();
      formData.append("titulo", form.title);
      formData.append("descripcion", form.description);
      formData.append("categoria", form.categories);
      
      // Simplificar cómo se envían los tags - convertir a JSON string
      formData.append("tags", JSON.stringify(form.tags));
      
      // Verificar tamaño del archivo (límite 10MB como ejemplo)
      if (form.modelo && form.modelo.size > 10 * 1024 * 1024) {
        setError("El modelo es demasiado grande. Máximo 10MB permitido.");
        return;
      }
      
      formData.append("modelo", form.modelo);
      if (form.imagen) formData.append("imagen", form.imagen);
      formData.append("fechaSubida", new Date().toISOString());

      // Enviar la solicitud al backend
      const API_URL = import.meta.env.VITE_API_URL;

      // Incluir timeout para evitar esperas largas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(`${API_URL}/asset`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Manejo de errores más detallado
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setError(data.error || `Error ${res.status}: Al subir el asset`);
        } else {
          // Respuesta no-JSON (probablemente HTML de error)
          const text = await res.text();
          console.error("Respuesta del servidor no es JSON:", text.substring(0, 150) + "...");
          setError(`Error ${res.status}: El servidor encontró un problema interno`);
        }
        return;
      }

      const data = await res.json();
      setSuccess("¡Asset subido correctamente!");
      setShowModal(true);
      
      // Resetear el formulario
      setForm({
        title: "",
        description: "",
        tags: [],
        categories: "Personajes",
        modelo: null,
        imagen: null,
      });
      setTagsInput("");
    } catch (err) {
      if (err.name === 'AbortError') {
        setError("La solicitud tardó demasiado tiempo. Verifica tu conexión o intenta con un archivo más pequeño.");
      } else {
        console.error("Error al subir el asset:", err);
        setError("Error de conexión al subir el asset: " + (err.message || "Detalles desconocidos"));
      }
    }
  };

  // Modificación del diseño del formulario para hacerlo horizontal
  return (
    <div className="asset-upload-container">
      {/* Modal de éxito */}
      {showModal && (
        <div className="asset-upload-modal-overlay">
          <div className="asset-upload-success-modal">
            <div className="asset-upload-modal-icon">
              <FiCheck size={40} />
            </div>
            <h2>¡Asset subido con éxito!</h2>
            <p>Tu asset ha sido publicado correctamente y ya está disponible en la plataforma.</p>
            <div className="asset-upload-modal-actions">
              <button 
                className="asset-upload-modal-button asset-upload-view-asset" 
                onClick={() => navigate("/")}
              >
                Ver en explorador
              </button>
              <button 
                className="asset-upload-modal-button asset-upload-upload-more" 
                onClick={() => setShowModal(false)}
              >
                Subir otro asset
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="asset-upload-form" onSubmit={handleSubmit}>
        {error && <div className="asset-upload-form-error">{error}</div>}
        
        <div className="asset-upload-form-row">
          {/* Columna 1: Archivos */}
          <div className="asset-upload-form-group">
            <h3 className="asset-upload-section-title">Archivos</h3>
            <label>Modelo 3D (requerido)</label>
            <div className="asset-upload-file-upload">
              <input
                id="modelo-upload-input"
                type="file"
                name="modelo"
                accept=".glb,.fbx,.obj,.gltf"
                onChange={handleChange}
              />
              <label htmlFor="modelo-upload-input">Examinar archivos</label>
              <span>o arrastra tu archivo aquí</span>
              {form.modelo && (
                <div className="asset-upload-file-name">
                  {form.modelo.name}
                </div>
              )}
            </div>
            
            <label>Imagen de vista previa</label>
            <div className="asset-upload-file-upload">
              <input
                id="imagen-upload-input"
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleChange}
              />
              <label htmlFor="imagen-upload-input">Seleccionar imagen</label>
              <span>Recomendado: formato PNG, 1024x1024px</span>
              {form.imagen && (
                <div className="asset-upload-image-preview-container">
                  <img 
                    src={URL.createObjectURL(form.imagen)} 
                    alt="Vista previa" 
                    className="asset-upload-image-preview" 
                  />
                </div>
              )}
            </div>
            
            <div className="asset-upload-tips-container">
              <div className="asset-upload-tips-title">Formatos soportados</div>
              <ul className="asset-upload-tips-list">
                <li>Modelos: .glb, .fbx, .obj, .gltf</li>
                <li>Imágenes: .png, .jpg, .webp</li>
              </ul>
            </div>
          </div>
          
          {/* Columna 2: Información */}
          <div className="asset-upload-form-group">
            <h3 className="asset-upload-section-title">Información</h3>
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Nombre descriptivo para tu asset"
              required
            />
            
            <label>Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe características, uso, materiales, escala y otras especificaciones relevantes..."
              required
            />
            
            <label>Categoría</label>
            <select
              name="categories"
              value={form.categories}
              onChange={handleChange}
              className="asset-upload-category-select"
              required
            >
              {availableCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <div className="asset-upload-tips-container">
              <div className="asset-upload-tips-title">Consejos para mejor visibilidad</div>
              <ul className="asset-upload-tips-list">
                <li>Usa un título descriptivo y específico</li>
                <li>Incluye detalles técnicos en la descripción</li>
                <li>Menciona el software utilizado para crear el asset</li>
              </ul>
            </div>
          </div>
          
          {/* Columna 3: Etiquetas y Acción */}
          <div className="asset-upload-form-group">
            <h3 className="asset-upload-section-title">Etiquetas</h3>
            <div className="asset-upload-tags-input-container">
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsChange}
                placeholder="medieval, low-poly, fantasy..."
                className="asset-upload-tags-input"
              />
              <button 
                type="button" 
                onClick={handleAddTag} 
                className="asset-upload-add-tag-button"
              >
                +
              </button>
            </div>
            <small className="asset-upload-input-helper">Añade palabras clave separadas por comas</small>
            
            <div className="asset-upload-tags-container">
              {form.tags.map((tag, index) => (
                <div key={index} className="asset-upload-tag-chip">
                  <span>{tag}</span>
                  <button
                    type="button"
                    className="asset-upload-tag-remove"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="asset-upload-tips-container">
              <div className="asset-upload-tips-title">Etiquetas sugeridas</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}>
                {['low-poly', 'PBR', 'game-ready', 'animated', 'medieval', 'sci-fi', 'fantasy', 'realistic', 'stylized'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border)',
                      borderRadius: '15px',
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                    onClick={() => {
                      if (!form.tags.includes(tag)) {
                        setForm(prev => ({
                          ...prev,
                          tags: [...prev.tags, tag]
                        }));
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="asset-upload-form-actions">
              <div className="asset-upload-button-group">
                <button type="button" onClick={handleCancel} className="asset-upload-secondary">Cancelar</button>
                <button type="submit" className="asset-upload-primary">Publicar</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UploadAssetPage;