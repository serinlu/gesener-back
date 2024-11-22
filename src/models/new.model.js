import mongoose from 'mongoose';

const newSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    content: {
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

const New = mongoose.model('New', newSchema);

export default New;