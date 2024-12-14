import axios from 'axios';
import OrderModel from "../models/order.model.js";
import { createPaymentPreference } from "../service/MPService.js";

const createOrder = async (req, res, next) => {
    try {
        const { products, payer } = req.body;
        const order = new OrderModel({ products, payer });
        order.total_amount = products.map(product => product.unit_price * product.quantity).reduce((acc, curr) => acc + curr, 0);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const generatePreference = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const paymentUrl = await createPaymentPreference(order);

        order.preference_id = paymentUrl.id;

        await order.save();

        res.status(200).json({ paymentUrl });
    } catch (error) {
        next(error);
    }
};

const success = async (req, res) => {
    // res.json(req.query);

    // const paymentId = req.body;
    const paymentId = req.params.paymentId;

    try {
        const paymentDetails = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
            }
        });

        // console.log(paymentDetails.data);

        const { status, external_reference } = paymentDetails.data;

        if (status === 'approved') {
            const order = await OrderModel.findOne({ _id: external_reference });

            if (order) {
                // const payerId = paymentDetails.data.payer.id;
                order.status = 'SUCCESS';
                order.payment_id = paymentId;
                // if (payerId) {
                //     order.payer.id = payerId;
                // }
                await order.save();

                return res.json({ message: "Order updated successfully", order });
            } else {
                return res.status(404).json({ message: "Order not found" });
            }
        } else {
            return res.status(400).json({ message: `Payment status is ${status}` });
        }
        // }

        // return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const failure = (req, res) => {
    return res.json({ message: "Pago fallido" });
};

const pending = (req, res) => {
    return res.json({ message: "Pago pendiente" });
};

const getOrderByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        // const orders = await OrderModel.find({ 'payer.id': userId });
        const orders = await OrderModel.findOne({ 'payer.id': userId });
        console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

const getLastOrderByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const order = await OrderModel.findOne({ 'payer.id': userId }).sort({ createdAt: -1 });
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}

export { createOrder, failure, generatePreference, pending, success, getOrderByUser, getLastOrderByUser };
