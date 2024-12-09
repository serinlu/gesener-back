import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from 'dotenv';
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

dotenv.config();

// const mercadopago = new MercadoPagoConfig({
//     accessToken: process.env.MP_ACCESS_TOKEN
// });
const mercadopago = new MercadoPagoConfig({
    accessToken: "TEST-1755908042061552-101100-09dd3764501fdd6ebfe1859a76cbd831-1762277778"
});

export const createPaymentPreference = async (orderData) => {
    try {
        // // Validar que `orderData.products` tenga datos
        // if (!orderData.products || !Array.isArray(orderData.products) || !orderData.products.length) {
        //     throw new Error('La lista de productos está vacía o no es válida.');
        // }

        // // Obtener productos
        // console.log("IDs de productos recibidos:", orderData.products);
        // const products = await Product.find({ _id: { $in: orderData.products } });
        // console.log("Productos encontrados:", products);

        // if (!products || !products.length) {
        //     throw new Error('No se encontraron los productos especificados.');
        // }

        // // Obtener usuario
        // console.log("ID de usuario recibido:", orderData.payer);
        // const user = await User.findById(orderData.payer);
        // console.log("Usuario encontrado:", user);

        // if (!user) {
        //     throw new Error('No se encontró el usuario especificado.');
        // }

        // console.log("Datos de la orden:", orderData);

        // Crear preferencia en Mercado Pago
        const preference = new Preference(mercadopago);
        const response = await preference.create({
            body: {
                payment_methods: {
                    excluded_payment_methods: [
                        {
                            id: "amex"
                        },
                        {
                            id: "pagoefectivo_atm"
                        }
                    ],
                    excluded_payment_types: [],
                    installments: 1
                },
                items: orderData.products.map((product) => ({
                    id: product._id.toString(),
                    // category_id: product.category_id.toString(),
                    title: product.title,
                    description: product.description,
                    quantity: product.quantity,
                    unit_price: product.unit_price,
                    currency_id: 'USD', // O la moneda que estés usando
                })),
                payer: {
                    name: orderData.payer.name,
                    surname: orderData.payer.surname,
                    email: orderData.payer.email,
                    identification: {
                        type: orderData.payer.type,
                        number: orderData.payer.number,
                    },
                    address: {
                        street_name: orderData.payer.street_name,
                        street_number: orderData.payer.street_number,
                        zip_code: orderData.payer.zip_code,
                    },
                },
                total_amount: orderData.total_amount,
                external_reference: orderData._id?.toString() || '',
                back_urls: {
                    success: "http://localhost:3000/",
                    failure: "http://localhost:3000/",
                    pending: "http://localhost:3000/api/orders/pending"
                },
                auto_return: "approved",
                notification_url: "https://webhook.site/2a48a27d-5d54-4585-b451-e92a7c1e2a1f",
            }
        });

        // console.log("Preferencia creada:", response);

        return response;
    } catch (error) {
        console.error('Error al crear preferencia de MercadoPago:', error);
        throw error;
    }
};

