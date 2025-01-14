import express from 'express';
import {
    createLeasing,
    getLeasingById,
    getLeasings,
    getAllLeasings,
    updateLeasing,
    deleteLeasing,
    uploadManual,
    listPaginatedManuals,
    listAllManuals,
    deleteManual,
    uploadSheet,
    listPaginatedSheets,
    listAllSheets,
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
router.get('/all/get', getAllLeasings);
router.get('/:id', getLeasingById);
router.put('/:id', authMiddleware, checkRole(['admin']), updateLeasing);
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteLeasing);

// Rutas específicas para PDFs (manuales y fichas técnicas)
router.post('/manuals/uploadManual', authMiddleware, checkRole(['admin']), upload.single('file'), uploadManual);
router.get('/manuals/listManuals', authMiddleware, checkRole(['admin']), listPaginatedManuals);
router.get('/manuals/listAllManuals', authMiddleware, checkRole(['admin']), listAllManuals);
router.delete('/manuals/deleteManual/:manualName', authMiddleware, checkRole(['admin']), deleteManual);

router.post('/sheets/uploadSheet', authMiddleware, checkRole(['admin']), upload.single('file'), uploadSheet);
router.get('/sheets/listSheets', authMiddleware, checkRole(['admin']), listPaginatedSheets);
router.get('/sheets/listAllSheets', authMiddleware, checkRole(['admin']), listAllSheets);
router.delete('/sheets/deleteSheet/:sheetName', authMiddleware, checkRole(['admin']), deleteSheet);

export default router;
