import mongoose, { mongo } from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                image_url: {
                    type: String,
                    required: true
                },
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String
                },
                category_id: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Category',
                    required: true
                }],
                unit_price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        payer: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            surname: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            identification: {
                type: {
                    type: String,
                    required: true
                },
                number: {
                    type: String,
                    required: true
                },
            },
            address: {
                street_name: {
                    type: String,
                    required: true
                },
                street_number: {
                    type: Number,
                    // required: true
                },
                zip_code: {
                    type: Number,
                    required: true
                }
            }
        },
        order_number: {
            type: Number,
        },
        total_amount: {
            type: Number,
            required: true
        },
        preference_id: {
            type: String,
            default: '-'
        },
        payment_id: {
            type: String,
            default: '-'
        },
        status: {
            type: String,
            enum: ['PENDING', 'SUCCESS', 'DENIED'],
            default: 'PENDING'
        },
        creation_date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;