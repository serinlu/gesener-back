import axios from "axios";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import OrderModel from "../models/order.model.js";
import { createPaymentPreference } from "../service/MPService.js";

const createOrder = async (req, res, next) => {
    try {
        const { products, payer } = req.body;
        const order = new OrderModel({ products, payer });
        order.total_amount = products
            .map((product) => product.unit_price * product.quantity)
            .reduce((acc, curr) => acc + curr, 0);
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
            return res.status(404).json({ message: "Order not found" });
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
        const paymentDetails = await axios.get(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                },
            }
        );

        console.log(paymentDetails.data);

        const { status, external_reference } = paymentDetails.data;

        if (status === "approved") {
            const order = await OrderModel.findOne({ _id: external_reference });

            if (order) {
                // const payerId = paymentDetails.data.payer.id;
                order.status = "SUCCESS";
                order.payment_id = paymentId;
                order.order_number = paymentDetails.data.order.id;
                // if (payerId) {
                //     order.payer.id = payerId;
                // }
                await order.save();

                return res.json({
                    message: "Order updated successfully",
                    order,
                });
            } else {
                return res.status(404).json({ message: "Order not found" });
            }
        } else {
            return res
                .status(400)
                .json({ message: `Payment status is ${status}` });
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
        const orders = await OrderModel.findOne({ "payer.id": userId });
        console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

const getLastOrderByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const order = await OrderModel.findOne({ "payer.id": userId }).sort({
            createdAt: -1,
        });
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

const getAllOrdersByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await OrderModel.find({ "payer.id": userId });
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

const sendEmailOrderByIdSuccessfully = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Send email
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );
        oAuth2Client.setCredentials({
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        });

        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const productList = order.products
            .map(
                (product) => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${product.title}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">$${(product.unit_price * product.quantity).toFixed(2)}</td>
                </tr>`
            )
            .join("");

        const mailOptions = {
            from: `Orden de compra <${process.env.GMAIL_USER}>`,
            to: order.payer.email,
            subject: "Orden de compra",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; color: #007bff;">¡Gracias por tu compra!</h1>
                        <p style="margin: 10px 0 0;">Tu orden ha sido procesada exitosamente.</p>
                    </div>
                    <div style="padding: 20px;">
                        <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Detalles de la Orden</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Orden:</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${order.order_number}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Monto Total:</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">$${order.total_amount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Estado:</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${order.status === "SUCCESS" ? "Recibido" : order.status}</td>
                            </tr>
                        </table>
                        <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Productos Comprados</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <thead>
                                <tr>
                                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f4f4f4;">Producto</th>
                                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f4f4f4;">Cantidad</th>
                                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f4f4f4;">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productList}
                            </tbody>
                        </table>
                        <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Datos del Comprador</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Nombre:</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${order.payer.name} ${order.payer.surname}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${order.payer.email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Dirección:</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${order.payer.address?.street_name || "No especificada"}</td>
                            </tr>
                        </table>
                        <p style="margin: 20px 0;">Si tienes alguna pregunta o necesitas ayuda, por favor contáctanos.</p>
                        <a href="https://tusitio.com" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px;">Ir a mis pedidos</a>
                    </div>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 14px; color: #666;">
                        <p style="margin: 0;">© 2024 Gesener. Todos los derechos reservados.</p>
                    </div>
                </div>
            `,
        };

        await transport.sendMail(mailOptions);

        res.status(200).json({ message: "Email sent" });
    } catch (error) {
        next(error);
    }
};


export {
    createOrder,
    failure,
    generatePreference,
    getAllOrdersByUser,
    getLastOrderByUser,
    getOrderByUser,
    pending,
    sendEmailOrderByIdSuccessfully,
    success,
};
