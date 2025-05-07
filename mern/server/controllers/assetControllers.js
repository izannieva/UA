
import { createAsset, deleteAsset, getAllAssets, getAssetById } from "../models/assetModel.js";

export const getAssets = async (req, res) => {
    try {
        const assets = await getAllAssets();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener assets" });
    }
};


export const addAsset = async (req, res) => {
    try {
      const {
        titulo,
        descripcion,
        categoria,
        fechaSubida,
        imagen,
        tags,
        modelo,
        autorId,
      } = req.body;
  
      // Validar que tags sea un array
      const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");
  
      // Crear el nuevo asset
      const newAsset = {
        titulo: titulo || null,
        descripcion: descripcion || null,
        categoria: categoria || null,
        fechaSubida: fechaSubida ? new Date(fechaSubida) : new Date(),
        imagen: imagen || null,
        tags: tagsArray, // Guardar tags como array
        modelo: modelo || null,
        autorId: req.user?.id || null, // Obtener el autorId del token
      };
  
      const result = await createAsset(newAsset);
  
      res.status(201).json({ message: "Asset creado exitosamente", id: result.insertedId });
    } catch (error) {
      console.error("Error al crear el asset:", error); // Log para depuración
      res.status(500).json({ error: "Error al crear el asset" });
    }
  };

// Obtener usuario por ID
export const getAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await getAssetById(id);
        if (!asset) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener Asset" });
    }
};
//borrra asset si es el autor
export const borrarAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user; // ID del usuario autenticado desde el token

        // Verificar si el asset existe
        const asset = await getAssetById(id);
        if (!asset) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        // Verificar si el usuario autenticado es el autor del asset
        if (asset.autorId !== userId) {
            return res.status(403).json({ error: "No tienes permiso para eliminar este asset" });
        }

        // Eliminar el asset
        const result = await deleteAsset(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        res.json({ message: "Asset eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar asset" });
    }
};