import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from 'dotenv';

dotenv.config();

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

export const createPaymentPreference = async (order) => {
    try {
        const preference = new Preference(mercadopago);
        const response = await preference.create({
            body: {
                items: order.products.map(product => ({
                    title: product.title,
                    description: product.description,
                    picture_url: product.picture_url,
                    category_id: product.category_id,
                    quantity: product.quantity,
                    currency_id: product.currency_id,
                    unit_price: product.unit_price
                })),
                payer: {
                    name: order.payer.name,
                    surname: order.payer.surname,
                    email: order.payer.email,
                    phone: {
                        area_code: order.payer.phone.area_code,
                        number: order.payer.phone.number
                    },
                    identification: {
                        type: order.payer.identification.type,
                        number: order.payer.identification.number
                    },
                    address: {
                        street_name: order.payer.address.street_name,
                        street_number: order.payer.address.street_number,
                        zip_code: order.payer.address.zip_code
                    }
                },
                external_reference: order._id.toString(),
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
