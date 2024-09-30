import { Router } from "express";
import {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
 } from "../controllers/brand.controller.js";

const router = Router();

router.post("/create", createBrand);
router.get("/", getBrands);
router.get("/:id", getBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;