import express from "express";
import { addUser, getUsers } from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", getUsers);  // Ahora usa el controller
router.post("/", addUser);  // Ahora usa el controller

export default router;
