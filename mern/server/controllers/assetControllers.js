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
    // Los campos de texto llegan en req.body, los archivos en req.files
    const {
      titulo,
      descripcion,
      categoria,
      fechaSubida
    } = req.body;

    // Tags puede llegar como array o string
    let tags = req.body.tags;
    if (Array.isArray(tags)) {
      // Si es array, está bien
    } else if (typeof tags === "string") {
      // Si es string, puede ser un solo tag o varios (por ejemplo, tags[]=a&tags[]=b o tags=a)
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [tags];
      }
    } else {
      tags = [];
    }

    // Archivos subidos
    const modelo = req.files?.modelo?.[0]?.filename || null;
    const imagen = req.files?.imagen?.[0]?.filename || null;

    const newAsset = {
      titulo: titulo || null,
      descripcion: descripcion || null,
      categoria: categoria || null,
      fechaSubida: fechaSubida ? new Date(fechaSubida) : new Date(),
      imagen,
      tags,
      modelo,
      autorId: req.user?.id || null,
    };

    const result = await createAsset(newAsset);

    res.status(201).json({ message: "Asset creado exitosamente", id: result.insertedId });
  } catch (error) {
    console.error("Error al crear el asset:", error);
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