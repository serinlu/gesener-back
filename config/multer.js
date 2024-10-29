import multer from 'multer';

// Configuración de multer para almacenamiento en memoria
const storage = multer.memoryStorage();

const upload = multer({ storage });

export { upload };
