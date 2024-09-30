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
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(404).json({ message: error.message });
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