import express from "express";
import { createOrder, failure, generatePreference, getLastOrderByUser, getOrderByUser, pending, success } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/generate-preference/:orderId", generatePreference);

router.post("/success/:paymentId", success);
router.get("/failure", failure);
router.get("/pending", pending);
router.get("/getOrderByUser/:userId", getOrderByUser);
router.get("/getLastOrderByUser/:userId/", getLastOrderByUser);

export default router;