import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                sku: {
                    type: Number,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                brand: {
                    _id: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    }
                },
                categories: [
                    {
                        _id: {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true
                        },
                        name: {
                            type: String,
                            required: true
                        }
                    }
                ],
                description: {
                    type: String
                },
                price: {
                    type: Number,
                    required: true
                },
                countInStock: {
                    type: Number,
                    required: true
                },
                imageUrl: {
                    type: String
                },
                model: {
                    type: String
                },
                quantity: {
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
            lastname: {
                type: String,
                required: true
            },
            invoice: {
                companyName: {
                    type: String
                },
                socialReason: {
                    type: String
                },
                ruc: {
                    type: String // Cambiado a String para asegurar flexibilidad
                }
            },
            tipoDocumento: {
                type: String,
                required: true
            },
            numDoc: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            department: {
                type: Number,
                required: true
            },
            province: {
                type: Number,
                required: true
            },
            district: {
                type: Number,
                required: true
            },
            postalCode: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
        },
        total: {
            type: Number,
            required: true
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