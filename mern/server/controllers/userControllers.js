//manejar http request
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../models/userModel.js";

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

export const loginUser = async (req, res) => {
    try {
        const { correo, pw } = req.body;

        if (!correo || !pw) {
            return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
        }
        //busca por correo
        const user = await getAllUsers().then(users => users.find(u => u.correo === correo));
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        //compara contraseñas
        const isPasswordValid = await bcrypt.compare(pw, user.pw);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user._id, correo: user.correo }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};

// Obtener usuario por ID
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id); // Obtener usuario desde la base de datos
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(user); // Devolver los datos del usuario
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
};

// Actualizar usuario
export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const result = await updateUser(id, updatedData);
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

// Eliminar usuario
export const borrarUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteUser(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};