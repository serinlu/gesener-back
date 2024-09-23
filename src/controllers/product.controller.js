import Product from '../models/product.model.js';
import Category from '../models/category.model.js';

// Crear producto
const createProduct = async (req, res) => {
    try {
        const { categories, ...productData } = req.body;

        // Verificar si las categorías existen por nombre y obtener sus IDs
        const existingCategories = await Category.find({ '_id': { $in: categories } });

        if (existingCategories.length !== categories.length) {
            return res.status(400).json({
                message: 'Una o más categorías no existen',
                existingCategories: existingCategories.map(cat => cat.name),  // Categorías que sí existen
            });
        }

        // Extraer los IDs de las categorías
        const categoryIds = existingCategories.map(cat => cat._id);

        // Crear el nuevo producto con los IDs de las categorías
        const newProduct = new Product({
            ...productData,
            categories: categoryIds  // Asignar los IDs de las categorías
        });

        const savedProduct = await newProduct.save();

        // Devolver el producto guardado
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
};

// Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('categories', 'name'); // Popula el campo 'categories' con el 'name'
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};

const getProductsByCategoryId = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await Product.find({ categories: categoryId }); // Asumiendo que `categories` es un campo en tus productos
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by category', error: error.message });
    }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categories', 'name description');
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
};

// Actualizar producto
const updateProduct = async (req, res) => {
    try {
        const { categories, ...productData } = req.body;

        // Verificar si las categorías existen
        const existingCategories = await Category.find({ '_id': { $in: categories } });
        if (existingCategories.length !== categories.length) {
            return res.status(400).json({ message: 'Una o más categorías no existen' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...productData, categories },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
};

export {
    createProduct,
    getProducts,
    getProductsByCategoryId,
    getProductById,
    updateProduct,
    deleteProduct
};
