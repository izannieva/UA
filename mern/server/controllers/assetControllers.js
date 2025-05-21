import { createAsset, deleteAsset, getAllAssets, getAssetById, updateAsset } from "../models/assetModel.js";

// Obtener todos los assets
export const getAssets = async (req, res) => {
    try {
        const assets = await getAllAssets();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener assets" });
    }
};

// Crear un asset
export const addAsset = async (req, res) => {
  try {
    const { titulo, descripcion, categoria, fechaSubida } = req.body;

    // Tags puede llegar como array o string
    let tags = req.body.tags;
    if (Array.isArray(tags)) {
      // ok
    } else if (typeof tags === "string") {
      try { tags = JSON.parse(tags); } catch { tags = [tags]; }
    } else {
      tags = [];
    }

    // Archivos subidos a Cloudinary (URL pública en .path)
    const modelo = req.files?.modelo?.[0]?.path || null;
    const imagen = req.files?.imagen?.[0]?.path || null;

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

// Obtener asset por ID
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

// Borrar asset si es el autor
export const borrarAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;

        // Verificar si el asset existe
        const asset = await getAssetById(id);
        if (!asset) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        // Verificar si el usuario es el autor
        if (asset.autorId !== userId) {
            return res.status(403).json({ error: "No tienes permiso para eliminar este asset" });
        }

        // No necesitas eliminar archivos locales, solo elimina el asset de la base de datos
        const result = await deleteAsset(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        res.json({ message: "Asset eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar asset" });
    }
};

// Editar asset
export const editAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    // Verifica si el asset existe
    const asset = await getAssetById(id);
    if (!asset) {
      return res.status(404).json({ error: "Asset no encontrado" });
    }
    if (asset.autorId !== userId) {
      return res.status(403).json({ error: "No tienes permiso para editar este asset" });
    }

    // Procesa los campos editables
    const updateData = {};
    if (req.body.titulo) updateData.titulo = req.body.titulo;
    if (req.body.descripcion) updateData.descripcion = req.body.descripcion;
    if (req.body.categoria) updateData.categoria = req.body.categoria;
    if (req.body.tags) {
      let tags = req.body.tags;
      if (typeof tags === "string") {
        try { tags = JSON.parse(tags); } catch { tags = [tags]; }
      }
      updateData.tags = tags;
    }

    // Procesa archivos nuevos (Cloudinary)
    if (req.files?.imagen?.[0]) {
      updateData.imagen = req.files.imagen[0].path;
    }
    if (req.files?.modelo?.[0]) {
      updateData.modelo = req.files.modelo[0].path;
    }

    const result = await updateAsset(id, updateData);
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "No se pudo actualizar el asset" });
    }

    res.json({ message: "Asset actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al editar asset" });
  }
};