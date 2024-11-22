import mongoose from "mongoose";

const successSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default: '',
    },
    video: {
        type: String,
        required: false,
        default: '',
    },
    created: {
        type: Date,
        default: Date.now,
    },
    lastModified: {
        type: Date,
        default: Date.now,
    }
})

export const Success = mongoose.model('Success', successSchema)

