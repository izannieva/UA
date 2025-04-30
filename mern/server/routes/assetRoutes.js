import express from "express";
import { addAsset, borrarAsset, getAsset, getAssets } from "../controllers/assetControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAssets);  // get assets
router.post("/",verifyToken, addAsset);  // post asset
router.get("/:id", getAsset); // Obtener asset por ID
router.delete("/:id", verifyToken, borrarAsset); // Proteger para que solo el autor pueda eliminar su asset

export default router;