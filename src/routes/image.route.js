// routes/imageRoutes.js
import express from 'express';
import { uploadImage, listImages, getImage, listAllImages, deleteImage } from '../controllers/image.controller.js'; // Importar el controlador de imágenes
import { upload } from '../../config/multer.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadImage);
router.get('/', listImages);
router.get('/list/all', listAllImages);
router.get('/:imageName', getImage);
router.delete('/:imageName', deleteImage);
// router.get('/signed-url/:fileName', getSignedUrl);

export default router;
