import express from "express";
import { createNews, getAllNews, getNewsById, updateNews, deleteNews } from "../controllers/new.controller.js";

const router = express.Router();

router.post('/create', createNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

export default router;