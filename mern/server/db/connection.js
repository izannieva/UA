import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config(); // Cargar variables de entorno

const uri = process.env.ATLAS_URI; // Verifica que la variable exista en .env

if (!uri) {
  throw new Error("❌ No se encontró la variable ATLAS_URI en el archivo .env");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectDB() {
  try {
    await client.connect();
    console.log("🚀 Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB", error);
    process.exit(1); // Detener el servidor si falla la conexión
  }
}

export { client };
