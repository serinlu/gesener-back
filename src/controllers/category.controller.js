import Category from '../models/category.model.js';

const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Error creating category', error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true } // Retorna la categoría actualizada
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error updating category', error: error.message });
    }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};


export {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};