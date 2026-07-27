import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'PKR'
    },
    paymentMethod: {
        type: String,
        enum: [
            "COD",
            "CARD",
            'JAZZCASH',
            'EASYPAISA',
            'UPAISA',
            'NAYAPAY',
            'SADAPAY'
        ]
    },
    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "processing",
            'paid',
            'failed',
            'refunded',
            'cancelled'
        ],
        default: "pending"
    },
    transactionId: {
        type: String,
        sparse: true,
        unique: true
    },
    refundedAt: {
        type: Date
    },
    refundedReason: {
        type: String
    },
    paidAt: {
        type: Date
    },
    gatewayReference: {
        type: String,
        index: true,
        unique: true
    }
})
const Payment = mongoose.model("Payment", paymentSchema)
export { Payment }