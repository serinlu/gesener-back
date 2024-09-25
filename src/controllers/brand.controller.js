import Brand from "../models/brand.model.js";

const createBrand = async (req, res) => {
    const brand = new Brand({
        name: req.body.name,
        description: req.body.description,
    });

    try {
        const newBrand = await brand.save();
        res.status(201).json(newBrand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        res.status(200).json(brand);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        brand.name = req.body.name;
        brand.description = req.body.description;

        const updatedBrand = await brand.save();
        res.status(200).json(updatedBrand);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        await brand.remove();
        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export { 
    createBrand, 
    getBrands, 
    getBrand, 
    updateBrand, 
    deleteBrand 
};