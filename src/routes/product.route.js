import express from 'express';
import {
  createProduct,
  getProducts,
  getProductsByCategoryId,
  getProductById,
  getProductsWithPaginations,
  updateProduct,
  deleteProduct,
  upload,
  createProductsFromExcel
} from '../controllers/product.controller.js';
import checkRole from '../../middlewares/checkRole.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas CRUD de productos
router.post('/create', authMiddleware, checkRole(["admin"]), createProduct);          // Crear producto
router.post("/upload/excel", upload.single("file"), createProductsFromExcel);
router.get('/', getProducts);             // Obtener todos los productos
router.get('/category/:categoryId', getProductsByCategoryId);
router.get('/:id', getProductById);       // Obtener un producto por ID
router.get('/list/paginated', getProductsWithPaginations)
router.put('/:id', authMiddleware, checkRole(["admin"]), updateProduct);        // Actualizar producto
router.delete('/:id', authMiddleware, checkRole(["admin"]), deleteProduct);     // Eliminar producto

export default router;
