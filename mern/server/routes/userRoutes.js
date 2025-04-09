//definicion endpoints
import express from "express";
import { addUser, borrarUser, editUser, getUser, getUsers, loginUser } from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", getUsers);  // get usuarios
router.post("/", addUser);  // post usuario
router.post("/login", loginUser); // inicio sesion
router.get("/:id", getUser); // Obtener usuario por ID
router.put("/:id", editUser); // Editar usuario
router.delete("/:id", borrarUser); // Eliminar usuario

export default router;
