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
        const { id: userId } = req.user; // ID del asset autenticado desde el token

        // Verificar si el asset existe
        const asset = await getAssetById(id);
        if (!asset) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        // Verificar si el asset autenticado es el autor del asset
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

export const editAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        const updateData = req.body;

        // Verifica si el asset existe
        const asset = await getAssetById(id);
        if (!asset) {
            return res.status(404).json({ error: "Asset no encontrado" });
        }

        // Solo el autor puede editar
        if (asset.autorId !== userId) {
            return res.status(403).json({ error: "No tienes permiso para editar este asset" });
        }

        // Actualiza el asset
        const result = await updateAsset(id, updateData);
        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: "No se pudo actualizar el asset" });
        }

        res.json({ message: "Asset actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al editar asset" });
    }
};

import path from "path";
import { fileURLToPath } from "url";

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadAssetFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename);

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  res.download(filePath, filename, err => {
    if (err) {
      console.error("❌ Error al descargar archivo:", err);
      res.status(500).send("Error al descargar el archivo.");
    }
  });
};

import express from "express";
import { downloadAssetFile } from "../controllers/assetControllers.js";

