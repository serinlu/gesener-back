import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from 'dotenv';
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

dotenv.config();

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

export const createPaymentPreference = async (orderData) => {
    try {
        const products = await Product.find({ _id: { $in: orderData.products } });
        if (!products.length) {
            throw new Error('No se encontraron los productos especificados.');
        }

        const user = await User.findById(orderData.payer);
        if (!user) {
            throw new Error('No se encontró el usuario especificado.');
        }

        const preference = new Preference(mercadopago);
        const response = await preference.create({
            body: {
                items: products.map(product => ({
                    id: product._id.toString(),
                    title: product.name,
                    description: product.description || 'Sin descripción',
                    picture_url: product.imageUrl || '',
                    category_id: (product.categories.map(
                        category => {
                            (category._id.length == 1) ? category._id : category._id + ", ";
                        }
                    ).toString()),
                    quantity: 1,
                    currency_id: 'PEN',
                    unit_price: product.price
                })),
                payer: {
                    name: user.name,
                    surname: user.lastname || '',
                    email: user.email,
                },
                external_reference: orderData._id.toString(),
                back_urls: {
                    success: "http://localhost:3000/",
                    failure: "http://localhost:3000/",
                    pending: "http://localhost:3000/api/orders/pending"
                },
                notification_url: "https://webhook.site/90c5b036-430d-4d2a-af02-82ee2ce08cfa",
            }
        });

        return response;
    } catch (error) {
        console.error('Error al crear preferencia de MercadoPago:', error);
        throw error;
    }
};
