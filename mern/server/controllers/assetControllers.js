import {
    addComment as addCommentModel,
    createAsset,
    deleteAsset,
    deleteComment as deleteCommentModel,
    getAllAssets,
    getAssetById,
    incrementViews,
    likeAsset as likeAssetModel,
    unlikeAsset as unlikeAssetModel,
    updateAsset,
} from "../models/assetModel.js";

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
      views: 0, // Initialize views to 0
      likes: [], // Initialize likes as an empty array
      comments: [] // Initialize comments as an empty array
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

// Like an asset
export const likeAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Verify if the asset exists
        const asset = await getAssetById(id);
        if (!asset) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        // Add the like - now using the correctly named model function
        await likeAssetModel(id, userId);
        
        res.json({ message: "Like añadido correctamente" });
    } catch (error) {
        console.error("Error in likeAsset controller:", error);
        res.status(500).json({ error: "Error al dar like al asset" });
    }
};

// Unlike an asset
export const unlikeAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Verify if the asset exists
        const asset = await getAssetById(id);
        if (!asset) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        // Remove the like - now using the correctly named model function
        await unlikeAssetModel(id, userId);
        
        res.json({ message: "Like eliminado correctamente" });
    } catch (error) {
        console.error("Error in unlikeAsset controller:", error);
        res.status(500).json({ error: "Error al quitar like del asset" });
    }
};

// Add a comment to an asset
export const addComment = async (req, res) => {
    try {
        const { id } = req.params; // ID del asset
        const { text } = req.body; // Texto del comentario
        const userId = req.user.id; // ID del usuario autenticado
        const userCorreo = req.user.correo; // Correo del usuario autenticado

        if (!text) {
            return res.status(400).json({ error: "El comentario no puede estar vacío" });
        }

        // Verificar si el asset existe
        const asset = await getAssetById(id);
        if (!asset) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        // Crear el objeto del comentario
        const comment = {
            userId,
            userCorreo, // Agregar el correo del usuario
            text,
            timestamp: new Date(),
        };

        // Agregar el comentario al asset
        await addCommentModel(id, comment);

        res.status(201).json({
            message: "Comentario añadido correctamente",
            comment,
        });
    } catch (error) {
        console.error("Error al añadir comentario:", error);
        res.status(500).json({ error: "Error al añadir comentario" });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const userId = req.user.id;

        // Verify if the asset exists
        const asset = await getAssetById(id);
        if (!asset) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        // Find the comment
        const comment = asset.comments?.find(c => c._id.toString() === commentId);
        
        if (!comment) {
            return res.status(404).json({ error: "Comentario no encontrado" });
        }

        // Check if the user is authorized to delete the comment
        if (comment.userId !== userId && asset.autorId !== userId) {
            return res.status(403).json({ error: "No tienes permiso para eliminar este comentario" });
        }

        // Delete the comment - now using the correctly named model function
        await deleteCommentModel(id, commentId);
        
        res.json({ message: "Comentario eliminado correctamente" });
    } catch (error) {
        console.error("Error in deleteComment controller:", error);
        res.status(500).json({ error: "Error al eliminar comentario" });
    }
};

// Track asset view
export const viewAsset = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📊 Tracking view for asset ID: ${id}`);
        
        // First, check if the asset exists
        const asset = await getAssetById(id);
        if (!asset) {
            console.log(`❌ Asset not found for ID: ${id}`);
            return res.status(404).json({ error: "Asset no encontrado" });
        }
        
        // Increment view count
        const result = await incrementViews(id);
        console.log(`📊 View increment result:`, result);
        
        res.json({ 
            message: "View counted",
            success: true,
            viewCount: (asset.views || 0) + 1
        });
    } catch (error) {
        console.error("❌ Error tracking view:", error);
        res.status(500).json({ error: "Error al registrar visualización" });
    }
};