import New from "../models/new.model.js";

export const createNews = async (req, res) => {
    try {
        const { title, content, image, video } = req.body;

        const news = new New({
            title, content, image, video,
            lastModified: new Date()
        });
        const savedNews = await news.save();

        res.status(201).json(savedNews);
    } catch (error) {
        res.status(500).json({ message: "Error creando la noticia", error });
    }
};

// Obtener todas las noticias
export const getAllNews = async (req, res) => {
    try {
        const news = await New.find();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo las noticias", error });
    }
};

// Obtener noticia por ID
export const getNewsById = async (req, res) => {
    try {
        const news = await New.findById(req.params.id);
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
export const updateNews = async (req, res) => {
    try {
        const { title, content, image, video } = req.body;

        const updatedNews = await New.findByIdAndUpdate(
            req.params.id,
            {
                title, content, video, image,
                lastModified: new Date()
            },
            { new: true }
        );

        res.json(updatedNews);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando la noticia", error });
    }
};

// Eliminar noticia
export const deleteNews = async (req, res) => {
    try {
        await New.findByIdAndDelete(req.params.id);
        res.json({ message: "Noticia eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando la noticia", error });
    }
};