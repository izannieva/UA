//manejar http request
import bcrypt from "bcryptjs";

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
        const { nombre, correo, pw, apellido, usuario, pais } = req.body;

        if (!nombre || !correo || !pw || !apellido || !usuario || !pais) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pw, salt);
        
        const newUser = await createUser({
            nombre,
            correo,
            pw: hashedPassword,
            apellido,
            usuario, 
            pais
        });
            
        res.status(201).json({ message: "Usuario creado", id: newUser.insertedId });
    } catch (error) {
        res.status(400).json({ error: "Error al crear usuario" });
    }
};

