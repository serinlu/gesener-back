import dotenv from "dotenv";
import express from "express";
import connectDB from "../config/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import categoryRoutes from './routes/category.route.js';
import productRoutes from './routes/product.route.js';
import brandRoutes from './routes/brand.route.js';

import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();
connectDB();

// Middleware

const allowlist = [process.env.FRONTEND_URL];
const corsOptionsDelegate = {
    origin: function (origin, callback) {
        if (allowlist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});