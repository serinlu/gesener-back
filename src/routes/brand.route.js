import { Router } from "express";
import * as brandController from "../controllers/brand.controller.js";

const router = Router();

router.post("/create", brandController.createBrand);
router.get("/", brandController.getBrands);
router.get("/:id", brandController.getBrand);
router.put("/:id", brandController.updateBrand);
router.delete("/:id", brandController.deleteBrand);

export default router;