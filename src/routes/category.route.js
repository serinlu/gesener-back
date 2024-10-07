import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import checkRole from '../../middlewares/checkRole.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas CRUD para categorías
router.post('/create', authMiddleware, checkRole(["admin"]), createCategory);             // Crear una categoría
router.get('/', getCategories);               // Obtener todas las categorías
router.get('/:id', getCategoryById);          // Obtener una categoría por ID
router.put('/:id', authMiddleware, checkRole(["admin"]), updateCategory);           // Actualizar una categoría por ID
router.delete('/:id', authMiddleware, checkRole(["admin"]), deleteCategory);        // Eliminar una categoría por ID

export default router;
