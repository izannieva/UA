import express from "express";
import multer from "multer";
import { addAsset, borrarAsset, editAsset, getAsset, getAssets } from "../controllers/assetControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Carpeta donde se guardan los archivos

router.get("/", getAssets);
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "modelo", maxCount: 1 },
    { name: "imagen", maxCount: 1 }
  ]),
  addAsset
);
router.get("/:id", getAsset);
router.delete("/:id", verifyToken, borrarAsset);
router.put("/:id", verifyToken, editAsset); 

import { downloadAssetFile } from "../controllers/assetControllers.js";

// Nueva ruta
router.get("/download/:filename", downloadAssetFile);


export default router;