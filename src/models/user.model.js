import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
        default: "-",
    },
    socialReason: {
        type: String,
        required: false,
        default: "-",
    },
    tipoDocumento: {
        type: String,
        required: true,
    },
    numDoc: {
        type: Number,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: false,
        default: "-",
    },
    address: {
        type: String,
        required: false,
        default: "-",
    },
    province: {
        type: String,
        required: false,
        default: "-",
    },
    district: {
        type: String,
        required: false,
        default: "-",
    },
    phone: {
        type: Number,
        required: false,
        default: "-",
    },
    postalCode: {
        type: Number,
        required: false,
        default: "-",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "user",
    },
});

const User = mongoose.model("User", userSchema);

export default User;