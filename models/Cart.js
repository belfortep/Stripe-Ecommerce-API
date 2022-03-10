const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [ //es de tipo array, conteniendo tanto productId como quantity
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ]


    },
    { timestamps: true }
)

module.exports = mongoose.model('Cart', CartSchema)