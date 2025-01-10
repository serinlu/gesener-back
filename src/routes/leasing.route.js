import express from 'express';
import {
    createLeasing,
    getLeasingById,
    getLeasings,
    updateLeasing,
    deleteLeasing,
    uploadManual,
    listManuals,
    deleteManual,
    uploadSheet,
    listSheets,
    deleteSheet
} from '../controllers/leasing.controller.js';
import checkRole from '../../middlewares/checkRole.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import multer from 'multer';

// Configuración de multer
const storage = multer.memoryStorage(); // Usar almacenamiento en memoria
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limitar tamaño a 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Solo se permiten archivos PDF'), false);
        }
        cb(null, true);
    }
});

const router = express.Router();

// Rutas para gestionar leasing
router.post('/create', authMiddleware, checkRole(['admin']), createLeasing);
router.get('/', getLeasings);
router.get('/:id', getLeasingById);
router.put('/:id', authMiddleware, checkRole(['admin']), updateLeasing);
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteLeasing);

// Rutas específicas para PDFs (manuales y fichas técnicas)
router.post('/manuals/uploadManual', authMiddleware, checkRole(['admin']), upload.single('file'), uploadManual);
router.get('/manuals/listManuals', authMiddleware, checkRole(['admin']), listManuals);
router.delete('/manuals/deleteManual/:name', authMiddleware, checkRole(['admin']), deleteManual);

router.post('/sheets/uploadSheet', authMiddleware, checkRole(['admin']), upload.single('file'), uploadSheet);
router.get('/sheets/listSheets', authMiddleware, checkRole(['admin']), listSheets);
router.delete('/sheets/deleteSheet/:name', authMiddleware, checkRole(['admin']), deleteSheet);

export default router;
