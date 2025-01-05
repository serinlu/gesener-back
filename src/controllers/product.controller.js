import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Brand from '../models/brand.model.js';

// Crear producto
const createProduct = async (req, res) => {
    try {
        const { categories, brand, ...productData } = req.body;

        // Verificar si las categorías y la marca están presentes
        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ message: 'Las categorías son requeridas y deben ser un arreglo' });
        }

        if (!brand) {
            return res.status(400).json({ message: 'La marca es requerida' });
        }

        // Verificar si las categorías existen por nombre y obtener sus IDs
        const existingCategories = await Category.find({ '_id': { $in: categories } });
        const existingBrand = await Brand.findById(brand);

        if (existingCategories.length !== categories.length) {
            return res.status(400).json({
                message: 'Una o más categorías no existen',
                existingCategories: existingCategories.map(cat => cat.name),  // Categorías que sí existen
            });
        }

        if (!existingBrand) {
            return res.status(400).json({
                message: 'La marca no existe',
                existingBrand: brand,  // Marca que no existe
            });
        }

        // Crear el nuevo producto con los IDs de las categorías y la marca
        const newProduct = new Product({
            ...productData,
            categories: existingCategories.map(cat => cat._id),  // Asignar los IDs de las categorías
            brand: existingBrand._id  // Asignar el ID de la marca
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
        const products = await Product.find().populate('categories', 'name').populate('brand', 'name'); // Popula los campos 'categories' y 'brand' con el 'name'
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

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('categories', 'name') // Solo poblar el campo 'categories' con el 'name'
            .populate('brand', 'name'); // Solo poblar el campo 'brand' con el 'name'

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
        const { categories, brand, ...productData } = req.body;

        let updateFields = { ...productData };

        // Verificar si se proporcionaron categorías
        if (categories) {
            // Verificar si las categorías existen
            const existingCategories = await Category.find({ '_id': { $in: categories } });

            if (existingCategories.length !== categories.length) {
                return res.status(400).json({ message: 'Una o más categorías no existen' });
            }

            // Asignar los IDs de las categorías existentes
            updateFields.categories = existingCategories.map(cat => cat._id);
        }

        // Verificar si se proporcionó la marca
        if (brand) {
            const existingBrand = await Brand.findById(brand);

            if (!existingBrand) {
                return res.status(400).json({ message: 'La marca no existe' });
            }

            // Asignar el ID de la marca existente
            updateFields.brand = existingBrand._id;
        }

        // Actualizar el producto
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true } // Devuelve el documento actualizado
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
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
