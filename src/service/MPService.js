import dotenv from 'dotenv';
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

export const createPaymentPreference = async (orderData) => {
    try {
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
                    image_url: product.image_url,
                    title: product.title,
                    description: product.description || "Sin descripción",
                    category_id: product.category_id[0]?._id.toString() || "others", // Usar la primera categoría válida o 'others'
                    quantity: product.quantity,
                    unit_price: product.unit_price,
                    currency_id: 'USD', // O la moneda que estés usando
                })),
                payer: {
                    id: orderData.payer._id,
                    name: orderData.payer.name,
                    surname: orderData.payer.surname,
                    email: orderData.payer.email,
                    identification: {
                        type: orderData.payer.type,
                        number: orderData.payer.number,
                    },
                    address: {
                        street_name: orderData.payer.street_name,
                        // street_number: orderData.payer.street_number,
                        zip_code: orderData.payer.zip_code,
                    },
                },
                total_amount: orderData.total_amount,
                external_reference: orderData._id?.toString() || '',
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/checkout/confirmation`,
                    failure: `${process.env.FRONTEND_URL}/`,
                    pending: `${process.env.FRONTEND_URL}/api/orders/pending`
                },
                metadata: {
                    shipping_method: orderData.shipping_method,
                    delivery_address: orderData.delivery_address,
                    store_pickup_location: orderData.store_pickup_location,
                },
                auto_return: "approved",
                notification_url: "https://webhook.site/53721604-ac7a-49ae-9947-6827deca6a16",
            }
        });

        return response;
    } catch (error) {
        console.error('Error al crear preferencia de MercadoPago:', error);
        throw error;
    }
};

