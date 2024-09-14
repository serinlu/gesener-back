import dotenv from "dotenv";
import express from "express";
import connectDB from "../config/db.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config();
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});