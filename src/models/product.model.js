import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
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
        required: false,
    }],
    description: {
        type: String,
        required: false,
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
    maxItems: {
        type: Number,
        required: true,
        default: 5,
    },
    imageUrl: {
        type: String,
        required: false,
        default: "",
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
