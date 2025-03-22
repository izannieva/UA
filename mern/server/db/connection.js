import dotenv from "dotenv"; // Asegúrate de importar dotenv correctamente
import { MongoClient, ServerApiVersion } from "mongodb";
dotenv.config(); // Cargar variables de entorno

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("🚀 Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB", error);
  }
}
export { client, connectDB };
