import { Router } from "express";

import { getUserById, getAllUsers, updateUser } from "../controllers/user.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/:id", getUserById);
router.get("/", getAllUsers);
router.put("/:id", authMiddleware, updateUser);

export default router;