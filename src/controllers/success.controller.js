import { Success } from "../models/success.model.js";

export const createSuccess = async (req, res) => {
    try {
        const { title, description, image, video } = req.body;

        const success = new Success({
            title, description, image, video,
            lastModified: new Date()
        });
        const savedSuccess = await success.save();

        res.status(201).json(savedSuccess);
    } catch (error) {
        res.status(500).json({ message: "Error creando la noticia", error });
    }
};

// Obtener todas las noticias
export const getAllSuccess = async (req, res) => {
    try {
        const success = await Success.find();
        res.json(success);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo las noticias", error });
    }
};

// Obtener noticia por ID
export const getSuccessById = async (req, res) => {
    try {
        const news = await Success.findById(req.params.id);
        if (news) {
            res.json(news);
        } else {
            res.status(404).json({ message: "Noticia no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo la noticia", error });
    }
};

// Actualizar noticia
export const updateSuccess = async (req, res) => {
    try {
        const { title, description, image, video } = req.body;

        const updatedSuccess = await Success.findByIdAndUpdate(
            req.params.id,
            {
                title, description, video, image,
                lastModified: new Date()
            },
            { success: true }
        );

        res.json(updatedSuccess);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando la noticia", error });
    }
};

// Eliminar noticia
export const deleteSuccess = async (req, res) => {
    try {
        await Success.findByIdAndDelete(req.params.id);
        res.json({ message: "Noticia eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando la noticia", error });
    }
};