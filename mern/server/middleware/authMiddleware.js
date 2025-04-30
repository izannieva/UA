//middle ware para verificar el token JWT enviado en la cabecera Authorization

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Obtener el token de la cabecera

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
        req.user = decoded; // Guardar los datos del usuario en la solicitud
        next();
    } catch (error) {
        res.status(403).json({ error: "Token inválido" });
    }
};