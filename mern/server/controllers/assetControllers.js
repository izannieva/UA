import { createAsset, getAllAssets, getAssetById } from "../models/assetModel";

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
            tipo,
            fechaSubida,
            imagen,
            archivo,
            autorId,
            likes = 0,
            descargas = 0,
            comentarios = []
        } = req.body;

        // Validar campos obligatorios
        if (!titulo || !descripcion || !tipo || !fechaSubida || !imagen || !archivo || !autorId) {
            return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados" });
        }

        // Crear el nuevo asset
        const newAsset = {
            titulo,
            descripcion,
            tipo,
            fechaSubida: new Date(fechaSubida), // Asegurarse de que sea un objeto Date
            imagen,
            archivo,
            autorId,
            likes,
            descargas,
            comentarios
        };

        const result = await createAsset(newAsset);

        res.status(201).json({ message: "Asset creado exitosamente", id: result.insertedId });
    } catch (error) {
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