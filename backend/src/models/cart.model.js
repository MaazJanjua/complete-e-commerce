import mongoose, { Schema, Types } from "mongoose";

const cartSchema = new Schema({
 
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1,
                max: 100
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema)
export {
    Cart
}