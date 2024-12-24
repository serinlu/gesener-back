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

const allowlist = [process.env.FRONTEND_URL]; // Agrega otros dominios si es necesario
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowlist.includes(origin)) { 
            // Permitir sin origin para herramientas como Postman
            callback(null, true);
        } else {
            console.error(`CORS blocked origin: ${origin}`); // Para depuración
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Permitir cookies y encabezados de autenticación
    optionsSuccessStatus: 200, // Para compatibilidad con navegadores antiguos
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
// app.use('/api/payment', paymentRoutes)
app.use('/api/search', search)
app.use('/api/recover-password', RecoverPassword)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});