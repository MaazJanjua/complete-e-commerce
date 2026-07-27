import mongoose from "mongoose";
import Stripe from "stripe";

import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import {
    validateObjectId,
    validateResourceExists
} from "../utils/validators/galobalValidator.js";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";


// ===============================
// Helper Functions
// ===============================
const markPaymentFailed = async (payment, order, session) => {
    payment.paymentStatus = 'failed'
    order.paymentStatus = 'failed'


    await payment.save({ session })
    await order.save({ session })

    // await session.commitTransaction()

}


const createPayment = asyncHandler(async (req, res) => {

    // Get request data
    const { orderId, paymentMethod } = req.body;
    const userId = req.user._id;

    // Validate order id
    validateObjectId(orderId, "Order id");

    // TODO: Move to payment.validator.js
    const allowedMethods = [
        "COD",
        "CARD",
        "JAZZCASH",
        "EASYPAISA",
        "UPAISA",
        "NAYAPAY",
        "SADAPAY"
    ];

    // Validate payment method
    if (!paymentMethod || !allowedMethods.includes(paymentMethod)) {
        throw new apiError(400, "Invalid payment method");
    }

    // Start transaction
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // Find order
        const order = await Order.findOne({
            _id: orderId,
            user: userId
        }).session(session);

        // Ensure order exists
        validateResourceExists(order, "Order");

        // Prevent payment for cancelled order
        if (order.orderStatus === "cancelled") {
            throw new apiError(400, "Cannot create payment for a cancelled order");
        }

        // Prevent payment for delivered order
        if (order.orderStatus === "delivered") {
            throw new apiError(400, "Order already delivered");
        }

        // Prevent duplicate payment
        if (order.paymentStatus === "paid") {
            throw new apiError(400, "Order is already paid");
        }

        // Validate order amount
        if (typeof order.totalAmount !== "number" || order.totalAmount <= 0) {
            throw new apiError(400, "Invalid order amount");
        }

        // Check existing payment
        const existingPayment = await Payment.findOne({
            user: userId,
            order: order._id
        }).session(session)

        if (existingPayment) {

            // Reset failed payment
            if (existingPayment.paymentStatus === "failed") {

                existingPayment.paymentMethod = paymentMethod;
                existingPayment.paymentStatus = "pending";
                existingPayment.transactionId = undefined;
                existingPayment.paidAt = undefined;
                existingPayment.refundedAt = undefined;
                existingPayment.refundReason = undefined;
                existingPayment.gatewayReference = crypto.randomUUID();

                // Save updated payment
                await existingPayment.save({ session });

                // Update order payment status
                order.paymentStatus = "pending";
                order.payment = existingPayment._id;

                await order.save({ session });

                // Commit transaction
                await session.commitTransaction();

                return res.status(200).json(
                    new apiResponse(
                        200, existingPayment, "Failed payment reset successfully. Retry initiated."
                    )
                );
            }

            // Payment already exists
            throw new apiError(400, "Payment already exists for this order");
        }

        // Create new payment
        const paymentDoc = await Payment.create(
            [{
                user: userId,
                order: order._id,
                amount: order.totalAmount,
                paymentMethod,
                paymentStatus: "pending",
                gatewayReference: crypto.randomUUID()
            }],
            { session }
        );

        // Extract payment document
        const payment = paymentDoc[0];

        // Link payment with order
        order.payment = payment._id;
        order.paymentStatus = "pending";

        // Save order
        await order.save({ session });

        // Commit transaction
        await session.commitTransaction();

        // Success response
        return res.status(201).json(
            new apiResponse(
                201, payment, "Payment created successfully"
            )
        );

    } catch (error) {

        // Rollback transaction
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;

    } finally {

        // End session
        await session.endSession();
    }
});


const verifyPayment = (asyncHandler(async (req, res) => {
    const userId = req.user._id
    // Input
    const { orderId } = req.params
    const { transactionId, gatewayStatus, gatewayAmount } = req.body
    // Validation
    validateObjectId(orderId, 'order id')
    if (
        !transactionId ||
        gatewayAmount <= 0 ||
        gatewayAmount == null
    ) {
        throw new apiError(404, "transactionId/gatewayAmount not avilable")
    }

    // Start Transaction
    const session = await mongoose.startSession()

    try {
        // Start Transaction
        await session.startTransaction()
        //     Fetch ResourcesFind Order (user + orderId)
        const order = await Order.findOne({
            _id: orderId,
            user: userId
        }).session(session)

        //Order Exists?
        validateResourceExists(order, "Order")
        // Find Payment(user + orderId)
        const payment = await Payment.findOne({
            user: userId,
            order: orderId
        }).session(session)

        //Payment Exists?
        validateResourceExists(payment, "Payment")

        //validate if payment already paid
        if (payment.paymentStatus !== "pending") {
            throw new apiError(
                400,
                `Payment cannot be verified because status is ${payment.paymentStatus}`
            );
        }
        if (gatewayAmount !== order.totalAmount) {

            // payment.paymentStatus = 'failed'
            // order.paymentStatus = 'failed'


            // await payment.save({ session })
            // await order.save({ session })

            // await session.commitTransaction()

            await markPaymentFailed(payment, order, session)

            await session.commitTransaction()

            return res.status(401).json(new apiResponse(
                401, null, 'payment mismatched'
            ))
        }
        if (gatewayStatus !== "success") {
            // payment.paymentStatus = 'failed'
            // order.paymentStatus = 'failed'

            // await payment.save({ session })
            // await order.save({ session })

            // await session.commitTransaction()

            await markPaymentFailed(payment, order, session)

            await session.commitTransaction()

            return res.status(400).json(new apiResponse(
                400, 'Payment verification failed.'
            ))
        }

        payment.paymentStatus = "paid"
        payment.transactionId = transactionId
        payment.paidAt = new Date()
        order.paymentStatus = "paid"
        order.orderStatus = "confirmed"
        await payment.save({ session })
        await order.save({ session })


        // Commit
        await session.commitTransaction()
        // Response
        return res.status(200).json(
            new apiResponse(
                200, payment, "payment verified successfully"
            )
        )

    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        await session.endSession()
    }
}))

const paymentWebhook = (asyncHandler(async (req, res) => {
    // Receive gateway payload
    const {
        transactionId,
        gatewayReference,
        status,
        amount
    } = req.body

    if (
        !transactionId ||
        !gatewayReference ||
        !status ||
        amount == null
    ) {
        throw new apiError(400, "transactionId, gatewayReference and amount are required")
    }


    const signature =
        req.headers["stripe-signature"];


    const session = await mongoose.startSession();


    try {
        await session.startTransaction()


        if (!signature) {
            throw new apiError(400, "Missing webhook signature");
        }
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        
        // Validate webhook signature
        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            endpointSecret
        );


        // Find payment bvy transactionId
        const payment = await Payment.findOne({
            gatewayReference
        }).session(session)

        // Payment exists ?
        validateResourceExists(payment, "Payment")

        const order = await Order.findOne({
            _id: payment.order
        }).session(session)

        validateResourceExists(order, "Order")


        // Already processed ?
        if (payment.paymentStatus === 'paid') {
            return res.status(200).json(
                new apiResponse(
                    200,
                    payment,
                    "Webhook already processed"
                )
            );
        }

        //AMOUNT MISMATCH VALIDATOR
        if (Number(amount) !== payment.amount) {

            await markPaymentFailed(payment, order, session)

            await session.commitTransaction()

            return res.status(400).json(
                new apiResponse(
                    400,
                    null,
                    "Payment amount mismatch"
                )
            );

        }

        // Gateway status ?
        const GATEWAY_STATUS = Object.freeze({
            SUCCESS: "SUCCESS",
            FAILED: "FAILED"
        });
        if (status !== GATEWAY_STATUS.SUCCESS) {

            // payment.paymentStatus = "failed";

            // order.paymentStatus = 'failed';

            // await payment.save({ session });
            // await order.save({ session });

            // //transaction commit
            // await session.commitTransaction()

            await markPaymentFailed(payment, order, session)

            await session.commitTransaction()

            return res.status(400).json(new apiResponse(
                400,
                payment,
                'Payment failed'
            ))
        }

        // Update Payment
        payment.paymentStatus = "paid";
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed'

        payment.transactionId = transactionId;
        payment.paidAt = new Date();

        await payment.save({ session });
        await order.save({ session });

        //transaction commit
        await session.commitTransaction()

        // Return 200
        return res.status(200).json(
            new apiResponse(200, payment, "Webhook processed successfully")
        )
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        await session.endSession()
    }
}))


const getPaymentById = (asyncHandler(async (req, res) => {

    const userId = req.user._id

    const { paymentId } = req.params

    // Validate paymentId
    validateObjectId(paymentId, 'Payment id')

    // Find Payment(user + paymentId)
    const payment = await Payment.findOne({
        user: userId,
        _id: paymentId
    })

    //  Validate Exists
    validateResourceExists(payment, 'Payment ')

    // Return Response
    return res.status(200).json(
        new apiResponse(
            200, payment, "Payment fetched successfully by payment ID"
        )
    )
}))


const getPaymentByOrderId = (asyncHandler(async (req, res) => {

    const userId = req.user._id

    const { OrderId } = req.params

    //  Validate orderId
    validateObjectId(OrderId, "order id")

    //  Find Payment(user + order)
    const payment = await Payment.findOne({
        user: userId,
        order: OrderId
    })

    //  Validate Exists
    validateResourceExists(payment, "payment")

    //  Return Response
    return res.status(200).json(
        new apiResponse(
            200, payment, "Payment fetched successfully by order ID"
        )
    )
}))






export {
    createPayment,
    getPaymentById,
    getPaymentByOrderId,
    verifyPayment,
    paymentWebhook
   

}