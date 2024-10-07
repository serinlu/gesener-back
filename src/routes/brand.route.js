import { Router } from "express";
import {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
 } from "../controllers/brand.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import checkRole from "../../middlewares/checkRole.js";

const router = Router();

router.post("/create", authMiddleware, checkRole(["admin"]), createBrand);
router.get("/", getBrands);
router.get("/:id", getBrand);
router.put("/:id", authMiddleware, checkRole(["admin"]), updateBrand);
router.delete("/:id", authMiddleware, checkRole(["admin"]), deleteBrand);

export default router;