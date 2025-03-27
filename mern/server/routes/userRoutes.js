//definicion endpoints
import express from "express";
import { addUser, getUsers, loginUser } from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", getUsers);  // get usuarios
router.post("/", addUser);  // post usuario
router.post("/login", loginUser); // inicio sesion

export default router;
