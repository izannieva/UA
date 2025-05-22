import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/connection.js"; // Asegúrate de que la ruta sea correcta
import assetRoutes from "./routes/assetRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config(); // Cargar variables de entorno

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
// Servir archivos estáticos de la carpeta uploads

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
