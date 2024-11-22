import express from "express";
import { createSuccess, getAllSuccess, getSuccessById, updateSuccess, deleteSuccess } from "../controllers/success.controller.js";

const router = express.Router();

router.post('/create', createSuccess);
router.get('/', getAllSuccess);
router.get('/:id', getSuccessById);
router.put('/:id', updateSuccess);
router.delete('/:id', deleteSuccess);

export default router;