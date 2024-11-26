import OrderModel from "../models/order.model.js";
import { createPaymentPreference } from "../service/MPService.js";
import axios from 'axios';

const createOrder = async (req, res, next) => {
    try {
        const { products, payer } = req.body;
        const order = new OrderModel({ products, payer });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const generatePayment = async (req, res, next) => {
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

const success = (req, res) => {
    res.json(req.query);
};

const failure = (req, res) => {
    return res.json({ message: "Pago fallido" });
};

const pending = (req, res) => {
    return res.json({ message: "Pago pendiente" });
};

const receiveWebhook = async (req, res) => {
    const payment = req.body;

    try {
        if (payment.action === 'payment.created') {
            const paymentId = payment.data.id;


            const paymentDetails = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
                }
            });

            console.log(paymentDetails.data);

            const { status, external_reference } = paymentDetails.data;

            if (status === 'approved') {
                const order = await OrderModel.findOne({ _id: external_reference });

                if (order) {
                    order.status = 'SUCCESS';
                    order.payment_id = paymentId;
                    await order.save();

                    return res.json({ message: "Order updated successfully", order });
                } else {
                    return res.status(404).json({ message: "Order not found" });
                }
            } else {
                return res.status(400).json({ message: `Payment status is ${status}` });
            }
        }

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export { createOrder, generatePayment, success, failure, pending, receiveWebhook };