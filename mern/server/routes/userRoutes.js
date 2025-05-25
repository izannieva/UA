//definicion endpoints
import express from "express";
import { addUser, borrarUser, changePassword, editUser, getPublicUser, getUser, getUsers, loginUser } from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);  // get usuarios
router.post("/", addUser);  // post usuario
router.post("/login", loginUser); // inicio sesion
router.get("/:id",verifyToken, getUser); // Obtener usuario por ID
router.put("/:id",verifyToken, editUser); // Editar usuario
router.delete("/:id",verifyToken, borrarUser); // Eliminar usuario
router.get("/perfil",verifyToken, getUser); // Obtener perfil de usuario
router.post("/change-password", verifyToken, changePassword);
router.get("/public/:id", getPublicUser); 

export default router;
