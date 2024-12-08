import express from "express";
import { createOrder, generatePreference, success, failure, pending, receiveWebhook } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/generate-preference/:orderId", generatePreference);

router.get("/success", success);
router.get("/failure", failure);
router.get("/pending", pending);
router.post("/webhook", receiveWebhook);

export default router;