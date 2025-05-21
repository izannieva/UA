import fs from "fs";
import path from "path";
import { createAsset, deleteAsset, getAllAssets, getAssetById, updateAsset } from "../models/assetModel.js";

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
//borrra asset si es el autor
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

        // Eliminar archivos asociados si existen
        if (asset.imagen) {
            const imagePath = path.join("uploads", asset.imagen);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
        if (asset.modelo) {
            const modelPath = path.join("uploads", asset.modelo);
            if (fs.existsSync(modelPath)) fs.unlinkSync(modelPath);
        }

        // Eliminar el asset de la base de datos
        const result = await deleteAsset(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        res.json({ message: "Asset eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar asset" });
    }
};

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
      // Puede llegar como string o array
      let tags = req.body.tags;
      if (typeof tags === "string") {
        try { tags = JSON.parse(tags); } catch { tags = [tags]; }
      }
      updateData.tags = tags;
    }

    // Procesa archivos nuevos y elimina los antiguos si corresponde
    if (req.files?.imagen?.[0]) {
      // Elimina la imagen anterior si existe
      if (asset.imagen) {
        const oldImagePath = path.join("uploads", asset.imagen);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      updateData.imagen = req.files.imagen[0].filename;
    }
    if (req.files?.modelo?.[0]) {
      // Elimina el modelo anterior si existe
      if (asset.modelo) {
        const oldModelPath = path.join("uploads", asset.modelo);
        if (fs.existsSync(oldModelPath)) fs.unlinkSync(oldModelPath);
      }
      updateData.modelo = req.files.modelo[0].filename;
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