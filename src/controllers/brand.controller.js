import Brand from "../models/brand.model.js";

const createBrand = async (req, res) => {
    const { name, description } = req.body;

    try {
        const brand = new Brand({ name, description });
        await brand.save();
        res.status(201).json(brand);
    } catch (error) {
        res.status(400).json({ message: 'Error creating brand', error: error.message });
    }
}

const getBrands = async (req, res) => {
    try {
        // Ordenar las marcas alfabéticamente por nombre (de A-Z)
        const brands = await Brand.find().sort({ name: 1 });
        res.status(200).json(brands);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getPaginatedBrands = async (req, res) => {
    try {
        const { page = 1 } = req.query; // Obtiene el número de página de la query string (por defecto, página 1)
        const limit = 12; // Número de elementos por página
        const skip = (page - 1) * limit; // Calcula el número de elementos a omitir

        // Obtén el total de elementos
        const totalItems = await Brand.countDocuments();

        // Consulta los elementos con paginación
        const brands = await Brand.find()
            .populate('name') // Relación con la colección `brand`, devolviendo solo el campo `name`
            .skip(skip) // Omite los elementos según la página actual
            .limit(limit); // Limita los resultados a 12 elementos

        res.status(200).json({
            brands, // Datos de los leasings
            totalItems, // Número total de elementos
            totalPages: Math.ceil(totalItems / limit), // Total de páginas
            currentPage: parseInt(page, 10), // Página actual (aseguramos que sea un número entero)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las marcas', error });
    }
}

const getBrand = async (req, res) => {
    const { id } = req.params

    try {
        const brand = await Brand.findById(id)
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

const updateBrand = async (req, res) => {
    const { id } = req.params
    const { name, description } = req.body;

    try {
        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(updatedBrand);

    } catch (error) {
        res.status(400).json({ message: 'Error updating brand', error: error.message });
    }
}

const deleteBrand = async (req, res) => {
    const { id } = req.params

    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);

        if (!deletedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand deleted' });

    } catch (error) {
        res.status(400).json({ message: 'Error deleting brand', error: error.message });
    }
}

export {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
};