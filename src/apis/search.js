import express from "express";
import Product from "../models/product.model.js"; // Asegúrate de que las rutas sean correctas
import New from "../models/new.model.js";
import { Success } from "../models/success.model.js";

const router = express.Router();

// Endpoint para buscar en los tres modelos
router.get("/", async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        return res.status(400).json({ message: "La consulta de búsqueda no puede estar vacía." });
    }

    try {
        // Usar una búsqueda insensible a mayúsculas y minúsculas
        const searchRegex = new RegExp(query, "i");

        // Realizar consultas en paralelo
        const [products, news, successCases] = await Promise.all([
            Product.find({ name: searchRegex }).select("name price imageUrl brand"),
            New.find({ title: searchRegex }).select("title created image"),
            Success.find({ title: searchRegex }).select("title description image"),
        ]);

        res.json({
            products,
            news,
            successCases,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al realizar la búsqueda." });
    }
});

export default router;
