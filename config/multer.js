import multer from 'multer';

// Configuración de multer para almacenamiento en memoria
const storage = multer.memoryStorage();

// Permitir la carga de múltiples archivos (10 en este caso)
const upload = multer({ storage }).array('files');

export { upload };
