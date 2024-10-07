import express from 'express';
import {
  createProduct,
  getProducts,
  getProductsByCategoryId,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import checkRole from '../../middlewares/checkRole.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas CRUD de productos
router.post('/create', authMiddleware, checkRole(["admin"]), createProduct);          // Crear producto
router.get('/', getProducts);             // Obtener todos los productos
router.get('/category/:categoryId', getProductsByCategoryId);
router.get('/:id', getProductById);       // Obtener un producto por ID
router.put('/:id', authMiddleware, checkRole(["admin"]), updateProduct);        // Actualizar producto
router.delete('/:id', authMiddleware, checkRole(["admin"]), deleteProduct);     // Eliminar producto

export default router;
