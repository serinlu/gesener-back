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
    ruc: {
        type: Number,
        required: false,
    },
    tipoDocumento: {
        type: String,
        required: false,
    },
    numDoc: {
        type: Number,
        required: false,
        unique: true,
        sparse: true,
    },
    department: {
        type: Number,
        required: false,
    },
    address: {
        type: String,
        required: false,
        default: "-",
    },
    province: {
        type: Number,
        required: false,
    },
    district: {
        type: Number,
        required: false,
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
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
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