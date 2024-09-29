import dotenv from "dotenv";
import express from "express";
import connectDB from "../config/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import categoryRoutes from './routes/category.route.js';
import productRoutes from './routes/product.route.js';
import brandRoutes from './routes/brand.route.js';

import cors from 'cors';

const app = express();
dotenv.config();
connectDB();

// Middleware
app.use(express.json());

// const allowlist = process.env.FRONTEND_URL;
// const corsOptionsDelegate = function (req, callback) {
//     let corsOptions;
//     if (allowlist.indexOf(req.header('Origin')) !== -1) {
//         corsOptions = { origin: true }
//     } else {
//         corsOptions = { origin: false }
//     }
//     callback(null, corsOptions)
// }

// app.use(cors(corsOptionsDelegate));

const allowedDomains = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedDomains.indexOf(origin) !== -1 || !origin) {
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