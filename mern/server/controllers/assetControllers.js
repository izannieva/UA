import {
  createAsset,
  deleteAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  pushCommentToAsset,
  removeCommentFromAsset
} from "../models/assetModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Obtener todos los assets
export const getAssets = async (req, res) => {
  try {
    const assets = await getAllAssets();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener assets" });
  }
};

// Añadir nuevo asset
export const addAsset = async (req, res) => {
  try {
    const { titulo, descripcion, categoria, fechaSubida } = req.body;

    let tags = req.body.tags;
    if (Array.isArray(tags)) {
    } else if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [tags];
      }
    } else {
      tags = [];
    }

    let modeloUrl = null;
    let imagenUrl = null;

    if (req.files?.modelo?.[0]) {
      const modeloPath = req.files.modelo[0].path;
      const modeloUpload = await cloudinary.uploader.upload(modeloPath, {
        folder: "modelos"
      });
      modeloUrl = modeloUpload.secure_url;
      fs.unlinkSync(modeloPath);
    }

    if (req.files?.imagen?.[0]) {
      const imagenPath = req.files.imagen[0].path;
      const imagenUpload = await cloudinary.uploader.upload(imagenPath, {
        folder: "imagenes"
      });
      imagenUrl = imagenUpload.secure_url;
      fs.unlinkSync(imagenPath);
    }

    const newAsset = {
      titulo: titulo || null,
      descripcion: descripcion || null,
      categoria: categoria || null,
      fechaSubida: fechaSubida ? new Date(fechaSubida) : new Date(),
      imagen: imagenUrl,
      tags,
      modelo: modeloUrl,
      autorId: req.user?.id || null,
      comentarios: []
    };

    const result = await createAsset(newAsset);
    res.status(201).json({ message: "Asset creado exitosamente", id: result.insertedId });
  } catch (error) {
    console.error("❌ Error al crear el asset:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
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

// Eliminar asset
export const borrarAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const asset = await getAssetById(id);
    if (!asset) {
      return res.status(404).json({ error: "Asset no encontrado" });
    }

    if (asset.autorId !== userId) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este asset" });
    }

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
    const updateData = req.body;

    const asset = await getAssetById(id);
    if (!asset) {
      return res.status(404).json({ error: "Asset no encontrado" });
    }

    if (asset.autorId !== userId) {
      return res.status(403).json({ error: "No tienes permiso para editar este asset" });
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

// ✅ Añadir comentario
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    const autor = req.user?.id;

    if (!texto || !autor) {
      return res.status(400).json({ error: "Faltan datos para el comentario" });
    }

    const comentario = {
      id: new Date().getTime().toString(), // puedes usar uuid si prefieres
      autor,
      texto,
      fecha: new Date()
    };

    const result = await pushCommentToAsset(id, comentario);
    res.status(200).json({ message: "Comentario añadido", comentario });
  } catch (error) {
    res.status(500).json({ error: "Error al añadir comentario" });
  }
};

// ✅ Eliminar comentario
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const result = await removeCommentFromAsset(id, commentId);
    if (!result.modifiedCount) {
      return res.status(404).json({ error: "Comentario no encontrado o no eliminado" });
    }

    res.status(200).json({ message: "Comentario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
};
