import mongoose from "mongoose";

const leasingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    manual: {
        type: String,
        required: false
    },
    sheet: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
}, { timestamps: true })

const Leasing = mongoose.model('Leasing', leasingSchema)

export default Leasing;