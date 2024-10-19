import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    lastname: {
        type: String,
        required: false,
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
    city: {
        type: String,
        required: false,
        default: "-",
    },
    phone: {
        type: Number,
        required: false,
    },
    postalCode: {
        type: Number,
        required: false,
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
        enum: ["admin", "user"],
        default: "user",
    },
});

const User = mongoose.model("User", userSchema);

export default User;