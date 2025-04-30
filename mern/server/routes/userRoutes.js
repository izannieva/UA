//definicion endpoints
import express from "express";
import { addUser, borrarUser, editUser, getUser, getUsers, loginUser } from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);  // get usuarios
router.post("/",verifyToken, addUser);  // post usuario
router.post("/login", loginUser); // inicio sesion
router.get("/:id",verifyToken, getUser); // Obtener usuario por ID
router.put("/:id",verifyToken, editUser); // Editar usuario
router.delete("/:id",verifyToken, borrarUser); // Eliminar usuario

export default router;
