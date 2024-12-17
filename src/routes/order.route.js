import express from "express";
import { createOrder, failure, generatePreference, getAllOrdersByUser, getLastOrderByUser, getOrderByUser, pending, sendEmailOrderByIdSuccessfully, success } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/generate-preference/:orderId", generatePreference);

router.post("/success/:paymentId", success);
router.get("/failure", failure);
router.get("/pending", pending);
router.get("/getOrderByUser/:userId", getOrderByUser);
router.get("/getLastOrderByUser/:userId/", getLastOrderByUser);
router.get("/getAllOrdersByUser/:userId", getAllOrdersByUser);
router.post("/sendEmailOrderByIdSuccessfully/:orderId", sendEmailOrderByIdSuccessfully);

export default router;