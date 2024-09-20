import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';

const router = express.Router();

// Rutas CRUD para categorías
router.post('/create', createCategory);             // Crear una categoría
router.get('/', getCategories);               // Obtener todas las categorías
router.get('/:id', getCategoryById);          // Obtener una categoría por ID
router.put('/:id', updateCategory);           // Actualizar una categoría por ID
router.delete('/:id', deleteCategory);        // Eliminar una categoría por ID

export default router;
