import { Router } from "express";

import { getUserById, getAllUsers, updateUser, changeRole } from "../controllers/user.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/:id", getUserById);
router.get("/", getAllUsers);
router.put("/:id", authMiddleware, updateUser);
router.post('/change-role/:id', authMiddleware, changeRole)

export default router;