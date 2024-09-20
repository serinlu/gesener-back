import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

// Rutas CRUD de productos
router.post('/create', createProduct);          // Crear producto
router.get('/', getProducts);             // Obtener todos los productos
router.get('/:id', getProductById);       // Obtener un producto por ID
router.put('/:id', updateProduct);        // Actualizar producto
router.delete('/:id', deleteProduct);     // Eliminar producto

export default router;
