import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configuración de Cloudinary (asegúrate de tener las variables en tu .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage para imágenes y modelos (resource_type: 'auto' permite cualquier tipo)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "assets";
    let resource_type = "auto"; // Permite imágenes, modelos, audio, etc.
    return {
      folder,
      resource_type,
      // Puedes limitar allowed_formats si quieres
    };
  },
});

const upload = multer({ storage });

export default upload;