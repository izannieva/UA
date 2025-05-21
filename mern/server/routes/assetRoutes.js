import express from "express";
import upload from "../utils/multerCloudinary.js";

import { addAsset, borrarAsset, editAsset, getAsset, getAssets } from "../controllers/assetControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
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
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "modelo", maxCount: 1 },
    { name: "imagen", maxCount: 1 }
  ]),
  editAsset
);
export default router;