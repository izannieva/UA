//manejar http request

import { createUser, getAllUsers } from "../models/userModel.js";

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

export const addUser = async (req, res) => {
    try {
        const { nombre, correo, pw } = req.body;

        if (!nombre || !correo || !pw) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const newUser = await createUser({ nombre, correo, pw }); // Guardar en la BD
        res.status(201).json({ message: "Usuario creado", id: newUser.insertedId });
    } catch (error) {
        res.status(400).json({ error: "Error al crear usuario" });
    }
};

