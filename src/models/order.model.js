import mongoose from "mongoose";

const OrderModel = new mongoose.Schema({
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            brand: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Brand",
                required: true,
            },
            categories: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
                required: true,
            },
            model: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            sku: {
                type: String,
                required: true,
            },
            imageUrl: {
                type: String,
                required: true,
            },
        },
    ],
    user: {
        name: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            required: false,
        },
        socialReason: {
            type: String,
            required: false,
        },
        ruc: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
        },
        tipoDocumento: {
            type: String,
            required: true,
        },
        numDoc: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        addressReference: {
            type: String,
            required: true,
        },
        telefono: {
            type: String,
            required: true,
        },
        department: {
            type: Number,
            required: true,
        },
        province: {
            type: Number,
            required: true,
        },
        district: {
            type: Number,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        orderNotes: {
            type: String,
        },
    }
}, {timestamps: true});

const Order = mongoose.model("Order", OrderModel);

export default Order;