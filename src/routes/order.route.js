import express from "express";
import {
    createOrder,
    failure,
    generatePreference,
    getAllOrders,
    getAllOrdersByUser,
    getLastOrderByUser,
    getOrderByUser,
    pending,
    sendEmailOrderByIdSuccessfully,
    updateShippingStatusOrderById,
    success,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/generate-preference/:orderId", generatePreference);

router.post("/success/:paymentId", success);
router.get("/failure", failure);
router.get("/pending", pending);
router.get("/getOrderByUser/:userId", getOrderByUser);
router.get("/getLastOrderByUser/:userId/", getLastOrderByUser);
router.get("/getAllOrdersByUser/:userId", getAllOrdersByUser);
router.get("/getAllOrders", getAllOrders);
router.post(
    "/sendEmailOrderByIdSuccessfully/:orderId",
    sendEmailOrderByIdSuccessfully
);
router.patch(
    "/updateShippingStatusOrderById/:orderId",
    updateShippingStatusOrderById
);

export default router;
