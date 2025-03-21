import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/connection.js"; // Asegúrate de que la ruta sea correcta

dotenv.config(); // Cargar variables de entorno

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Conectar a la base de datos y luego iniciar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ Error al iniciar el servidor:", err);
});
