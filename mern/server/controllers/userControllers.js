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
        // Si el ID viene del token (usuario autenticado)
        const userId = req.user?.id || req.params.id; // Prioriza el ID del token, pero permite usar req.params.id si está presente

        if (!userId) {
            return res.status(400).json({ error: "ID de usuario no proporcionado" });
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(user);
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
        // Verifica que el usuario autenticado es el mismo
        if (req.user && req.user.id !== id) {
            return res.status(403).json({ error: "No tienes permiso para editar este usuario" });
        }
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

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPw, newPw } = req.body;
    if (!oldPw || !newPw) {
      return res.status(400).json({ error: "Debes indicar ambas contraseñas" });
    }
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(oldPw, user.pw);
    if (!valid) return res.status(401).json({ error: "Contraseña actual incorrecta" });

    const hashed = await bcrypt.hash(newPw, 10);
    await updateUser(userId, { pw: hashed });

    res.json({ message: "Contraseña cambiada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
};