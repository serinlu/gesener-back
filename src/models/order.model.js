import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                },
                picture_url: {
                    type: String,
                },
                category_id: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    required: true
                },
                currency_id: {
                    type: String,
                    required: true
                },
                unit_price: {
                    type: Number,
                    required: true
                }
            }
        ],
        payer: {
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
            phone: {
                area_code: {
                    type: String,
                },
                number: {
                    type: String,
                }
            },
            identification: {
                type: {
                    type: String,
                },
                number: {
                    type: String,
                }
            },
            address: {
                street_name: {
                    type: String,
                },
                street_number: {
                    type: Number,
                },
                zip_code: {
                    type: String,
                },
            }
        },
        preference_id: {
            type: String,
            required: true,
            default: '-'
        },
        payment_id: {
            type: String,
            required: true,
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