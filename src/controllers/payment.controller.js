// import Order from "../models/order.model.js";
// import { Preference, MercadoPagoConfig } from "mercadopago";

// const client = new MercadoPagoConfig({
//     // accessToken: 'TEST-5046206238162646-103014-7b954a24f40504c26c464a63b8f28d2d-567054198' // Sergio
//     accessToken: 'TEST-1755908042061552-101100-09dd3764501fdd6ebfe1859a76cbd831-1762277778' // Luis
// });

// export const createPreference = async (req, res) => {
//     try {
//         const { cart, user, total } = req.body;

//         // Configura los items a partir del carrito
//         const items = cart.map(product => ({
//             title: product.name,
//             quantity: parseInt(product.quantity),
//             unit_price: parseInt(product.price),
//             currency_id: 'USD',
//             picture_url: product.imageUrl,
//             category_id: product.categories[0]?.name || '',  // Asegura que `category_id` esté correcto
//             id: product._id,
//         }));

//         const preferenceData  = {
//             payer: {
//                 name: user.name,
//                 surname: user.lastname,
//                 email: user.email,
//                 phone: {
//                     number: parseInt(user.phone), // Extrae el número
//                 },
//                 identification: {
//                     type: user.tipoDocumento,
//                     number: parseInt(user.numDoc),
//                 },
//                 address: {
//                     zip_code: parseInt(user.postalCode),
//                     street_name: user.address,
//                 }
//             },
//             items: items,
//             back_urls: {
//                 success: 'http://localhost:3000/payment/success',
//                 failure: 'http://localhost:3000/payment/failure',
//                 pending: 'http://localhost:3000/payment/pending'
//             },
//             auto_return: 'approved',
//             external_reference: `order-${new Date().getTime()}`, // Referencia externa que puede ser el ID del usuario
//             notification_url: 'https://webhook.site/tu-url-webhook', // Reemplaza por tu URL de webhook
//             statement_descriptor: "Tu Empresa",
//             additional_info: user.orderNotes || ''
//         };

//         const preference = new Preference(client);
//         const result = await preference.create({ body: preferenceData });

//         // Devuelve el JSON completo de la respuesta de Mercado Pago
//         return res.json(result.body);
//     } catch (error) {
//         console.error('Error al crear la preferencia:', error);
//         return res.status(500).json({ error: 'Error al crear la preferencia' });
//     }
// };
