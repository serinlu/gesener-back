// models/Image.js
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Image = mongoose.model('Image', ImageSchema);

export default Image
