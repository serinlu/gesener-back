import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Brand from '../models/brand.model.js';
import multer from 'multer'
import xlsx from 'xlsx';
import mongoose from 'mongoose';

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

export const getFilteredProducts = async (req, res) => {
    const { 
        category, 
        brand, 
        minPrice, 
        maxPrice, 
        search, 
        page = 1, 
        limit = 12, 
        sortBy = 'name', // Criterio de ordenamiento por defecto
        order = 'asc' // Orden ascendente por defecto
    } = req.query;

    try {
        // Construir el filtro dinámicamente
        const filter = {};

        // Filtro de búsqueda (por nombre)
        if (search) {
            filter.name = { $regex: search, $options: 'i' }; // Insensible a mayúsculas/minúsculas
        }

        // Filtro por categoría (si se proporciona)
        if (category) {
            const categoryIds = category.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
            filter.categories = { $in: categoryIds }; // Buscar en el array de ObjectIds
        }

        // Filtro por marca (si se proporciona)
        if (brand) {
            const brandIds = brand.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
            filter.brand = { $in: brandIds }; // Buscar en el array de ObjectIds
        }

        // Filtro por rango de precio
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice); // Mínimo
            if (maxPrice) filter.price.$lte = Number(maxPrice); // Máximo
        }

        // Calcular la paginación
        const skip = (page - 1) * limit;

        // Definir el criterio de ordenamiento
        const sortCriteria = {
            [sortBy]: order === 'asc' ? 1 : -1, // 1 para ascendente, -1 para descendente
        };

        // Consultar productos con filtros, paginación y ordenamiento
        const products = await Product.find(filter)
            .populate('categories', 'name')
            .populate('brand', 'name')
            .sort(sortCriteria) // Aplicar el ordenamiento
            .skip(skip)
            .limit(Number(limit));

        // Calcular el total de productos para la paginación
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        // Responder con los datos
        res.status(200).json({
            products,
            totalPages,
            currentPage: Number(page),
            totalProducts,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos filtrados',
            error: error.message,
        });
    }
};


//crear porducto mediante archivo excel
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const createProductsFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Debe seleccionar un archivo Excel' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({ message: "El archivo Excel está vacío" });
        }

        const products = [];
        for (const row of data) {
            const {
                sku,
                name,
                brand,
                model,
                categories = "",
                description = "",
                price,
                countInStock,
                maxItems,
                imageUrl = "",
            } = row;

            // Validaciones obligatorias
            if (!sku || !name || !brand || !price || !countInStock || !maxItems) {
                return res.status(400).json({
                    message: "Faltan campos obligatorios en el archivo Excel",
                });
            }

            // Obtener la marca por nombre
            const existingBrand = await Brand.findOne({ name: brand });
            if (!existingBrand) {
                return res.status(400).json({ message: `La marca '${brand}' no existe` });
            }

            // Manejar categorías opcionales
            let categoryIds = [];
            if (categories) {
                const categoryNames = categories.split(",").map((cat) => cat.trim());
                const existingCategories = await Category.find({ name: { $in: categoryNames } });

                if (existingCategories.length !== categoryNames.length) {
                    return res.status(400).json({
                        message: "Una o más categorías no existen",
                        invalidCategories: categoryNames.filter(
                            (cat) => !existingCategories.some((existCat) => existCat.name === cat)
                        ),
                    });
                }

                categoryIds = existingCategories.map((cat) => cat._id);
            }

            // Preparar el producto para ser guardado
            products.push({
                sku,
                name,
                brand: existingBrand._id,
                model: model || null,
                categories: categoryIds,
                description,
                price,
                countInStock,
                maxItems,
                imageUrl,
            });
        }

        // Guardar todos los productos en la base de datos
        const createdProducts = await Product.insertMany(products);

        // Responder con los productos creados
        res.status(201).json({
            message: "Productos creados exitosamente",
            createdProducts,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al procesar el archivo Excel",
            error: error.message,
        });
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

export const getProductsWithPaginations = async (req, res) => {
    const { page = 1, limit = 12 } = req.query;

    try {
        const products = await Product.find()
            .populate('categories', 'name')
            .populate('brand', 'name')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.countDocuments();
        res.status(200).json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
}

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
