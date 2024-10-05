import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    sku: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
    },
    model: {
        type: String,
        required: false,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Asegúrate de que el nombre del modelo coincida con el import
        required: true,
    }],
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    imageUrl: {
        type: String,
        required: false,
        default: "",
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
