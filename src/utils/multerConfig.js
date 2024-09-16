import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtiene el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define la ruta para la carpeta static
const staticDir = path.resolve(__dirname, '..', 'public'); // Subir un nivel para apuntar a src

// Define las rutas para las carpetas necesarias dentro de 'static'
const uploadsDir = path.join(staticDir, 'uploads');
const profilesDir = path.join(staticDir, 'profiles');
const productsDir = path.join(staticDir, 'products');
const documentsDir = path.join(uploadsDir, 'documents');

// Función para asegurarse de que las carpetas existan
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Asegúrate de que las carpetas existan
ensureDirExists(profilesDir);
ensureDirExists(productsDir);
ensureDirExists(documentsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents';
    let destinationDir = uploadsDir;

    if (file.fieldname === 'profile-image') {
      folder = 'profiles';
      destinationDir = staticDir; // Guardar en staticDir para profile images
    } else if (file.fieldname === 'productImage') {
      folder = 'products';
      destinationDir = staticDir; // Guardar en staticDir para product images
    }

    // Define el destino del archivo
    cb(null, path.join(destinationDir, folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export default upload;
