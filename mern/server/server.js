import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/connection.js"; // Asegúrate de que la ruta sea correcta
import assetRoutes from "./routes/assetRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config(); // Cargar variables de entorno

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Tu frontend local
  credentials: true // Solo si estás usando cookies o headers como Authorization
}));
app.use(express.json());

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
}, express.static('uploads'));


//rutas
app.use("/user", userRoutes);
app.use("/asset", assetRoutes);

// Conectar a la base de datos y luego iniciar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ Error al iniciar el servidor:", err);
});
