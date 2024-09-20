import dotenv from "dotenv";
import express from "express";
import connectDB from "../config/db.js";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from './routes/category.route.js';
import productRoutes from './routes/product.route.js';

const app = express();
dotenv.config();
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});