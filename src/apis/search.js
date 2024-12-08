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

router.get("/products", async (req, res) => {
    // const { query } = req.query;

    // if (!query || query.trim() === "") {
    //     return res.status(400).json({ message: "La consulta de búsqueda no puede estar vacía." });
    // }

    // try {
    //     const searchRegex = new RegExp(query, "i");
    //     const products = await Product.find({ name: searchRegex }).select("name price imageUrl brand countInStock categories brand maxItems");
    //     res.json(products);
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: "Error al realizar la búsqueda." });
    // }
    try {
        const { query } = req.query; // Ejemplo: ?query=texto
        const products = await Product.find(
            { name: { $regex: query, $options: 'i' } }, // Filtrar por nombre
            { _id: 1 } // Proyección: solo incluye _id
        );

        res.json(products.map(product => product._id));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar productos' });
    }
});

router.get("/success", async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        return res.status(400).json({ message: "La consulta de búsqueda no puede estar vacía." });
    }

    try {
        const searchRegex = new RegExp(query, "i");
        const success = await Success.find({ title: searchRegex }).select("title description image");
        res.json(success);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al realizar la búsqueda." });
    }
});

router.get("/news", async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        return res.status(400).json({ message: "La consulta de búsqueda no puede estar vacía." });
    }

    try {
        const searchRegex = new RegExp(query, "i");
        const news = await New.find({ title: searchRegex }).select("title content image");
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al realizar la búsqueda." });
    }
});


export default router;
