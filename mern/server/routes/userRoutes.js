
import express from "express";
import { client } from "../db/connection.js";
const router = express.Router();

//Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const db = client.db("UA-bdd");
    const user = await db.collection("User").find().toArray();
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: error.message });
  }
});


// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const db = client.db("UA-bdd");
    const result = await db.collection("User").insertOne(req.body);
    res.status(201).json({ message: "Usuario creado", id: result.insertedId });
  } catch (error) {
    res.status(400).json({ error: "Error al crear usuario" });
  }
});

export default router;