import dotenv from "dotenv";
import express from "express";
import connectDB from "../config/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import categoryRoutes from './routes/category.route.js';
import productRoutes from './routes/product.route.js';
import brandRoutes from './routes/brand.route.js';
import imageRoutes from './routes/image.route.js'
import orderRoutes from './routes/order.route.js';
// import paymentRoutes from './routes/payment.route.js';
import newRoute from './routes/new.route.js';
import successRoute from './routes/success.route.js'
import leasingRoute from './routes/leasing.route.js'
import RecoverPassword from './apis/recover-password.js'

import search from './apis/search.js'

import cors from 'cors';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
dotenv.config();
connectDB();

// Middleware
// const corsOptions = {
//     origin: (origin, callback) => {
//         const allowlist = 'https://gesener.pe'; // Agrega más dominios si es necesario
//         if (!origin || allowlist.includes(origin)) {
//             callback(null, true);
//         } else {
//             console.error(`CORS blocked origin: ${origin}`); // Para depuración
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, // Permitir cookies y encabezados de autenticación
//     optionsSuccessStatus: 200, // Para navegadores antiguos como IE11
// };
// app.use(cors(corsOptions));

const allowlist = ['https://www.gesener.pe', 'https://gesener.pe', 'http://localhost:5173'];

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir solicitudes sin origen (como desde Postman)
        if (!origin || allowlist.includes(origin)) {
            callback(null, true); // Permitir el origen
        } else {
            callback(new Error('Not allowed by CORS')); // Bloquear el origen
        }
    },
    credentials: true, // Permitir envío de cookies y encabezados de autenticación
};

app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use('/api/images', imageRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/news', newRoute)
app.use('/api/success', successRoute)
app.use('/api/leasings', leasingRoute);
// app.use('/api/payment', paymentRoutes)
app.use('/api/search', search)
app.use('/api/recover-password', RecoverPassword)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});