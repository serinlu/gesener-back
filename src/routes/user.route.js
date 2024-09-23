import { Router } from "express";

import { getUserById, getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.get("/:id", getUserById);
router.get("/", getAllUsers);

export default router;