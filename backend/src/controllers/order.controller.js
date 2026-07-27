import mongoose from "mongoose";

import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { validateObjectId, validateResourceExists } from "../utils/validators/galobalValidator.js";


// =====================================
// Create Order
// =====================================
const createOrder = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const { shippingAddress } = req.body;

    // Validate Shipping Address
    if (!shippingAddress ||
        !shippingAddress.name ||
        !shippingAddress.phoneNumber ||
        !shippingAddress.city ||
        !shippingAddress.email ||
        !shippingAddress.address
    ) {
        throw new apiError(400, "Shipping address required");
    }

    const session = await mongoose.startSession();

    try {

        await session.startTransaction();


        // Get User Cart
        const cart = await Cart.findOne({
            user: userId
        }).session(session);

        validateResourceExists(cart, "Cart");

        if (!cart.items.length) {
            throw new apiError(400, "Cart is empty");
        }



        // Fetch Products
        const products = await Product.find({
            _id: {
                $in: cart.items.map(item => item.product) //get product ids array
            }
        }).session(session);

        // Convert array into Map for O(1) lookup
        const productMap = new Map();

        products.forEach(product => {
            productMap.set(
                product._id.toString(),
                product
            );
        });


        const orderItems = [];
        let totalAmount = 0;


        // Validate Products & Prepare Snapshot
        for (const cartItem of cart.items) {

            const product = productMap.get(
                cartItem.product.toString()
            );

            validateResourceExists(product, "Product");

            if (!product.isActive) {
                throw new apiError(
                    400,
                    `${product.title} is currently unavailable`
                );
            }

            if (product.stock < cartItem.quantity) {
                throw new apiError(
                    400,
                    `${product.title} is out of stock`
                );
            }

            const price = product.discountPrice ?? product.price;

            orderItems.push({
                product: product._id,
                title: product.title,
                image: product.productImages?.[0]?.url || "",
                quantity: cartItem.quantity,
                price
            });

            totalAmount += price * cartItem.quantity;

            // Reduce Stock
            await Product.findByIdAndUpdate(
                product._id,
                {
                    $inc: {
                        stock: -cartItem.quantity
                    }
                },
                {
                    session
                }
            );
        }

        // Generate Order Number
        const counter = await Counter.findByIdAndUpdate(
            "order",
            {
                $inc: {
                    sequence: 1
                }
            },
            {
                new: true,
                upsert: true,
                session
            }
        );

        const orderNumber = `ORD-${counter.sequence
            .toString()
            .padStart(9, "0")}`;


        // Create Order
        const order = await Order.create(
            [
                {
                    user: userId,
                    orderNumber,
                    items: orderItems,
                    totalAmount,
                    shippingAddress
                }
            ],
            {
                session
            }
        );


        // Clear Cart
        cart.items = [];
        cart.totalPrice = 0;

        await cart.save({ session });


        // Commit Transaction
        await session.commitTransaction();

        return res.status(201).json(
            new apiResponse(
                201, order[0], "Order created successfully"
            )
        );

    } catch (error) {

        await session.abortTransaction();
        throw error;

    } finally {

        await session.endSession();

    }

});



// =====================================
// Get User Orders
// =====================================
const getUserOrders = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    // Find all user orders
    const orders = await Order.find({
        user: userId
    })

    if (!orders.length) {
        throw new apiError(
            404, "No orders found"
        );
    }

    return res.status(200).json(
        new apiResponse(
            200, orders, "Orders fetched successfully"
        )
    );
});



// =====================================
// Get Single Order
// =====================================
const getOrderById = asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    // Validate ObjectId
    validateObjectId(orderId, 'order id')

    // Find order
    const order = await Order.findOne({
        user: req.user._id,
        _id: orderId
    }).populate(
        "items.product",
        "title slug price productImages"
    );

    validateResourceExists(order, "Order")
    // Ensure order belongs to current user
    // OR user is admin

    return res.status(200).json(
        new apiResponse(
            200, { order }, "Order fetched successfully"
        )
    );
});

// =====================================
// Cancel Order
// =====================================
const cancelOrder = asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    const userId = req.user._id

    // Validate ObjectId
    validateObjectId(orderId, 'order id')



    const session = await mongoose.startSession()

    try {

        await session.startTransaction()

        // Find order
        const order = await Order.findOne({
            user: userId,
            _id: orderId
        }).session(session)

        validateResourceExists(order, "Order")

        //  Is status cancellable ?
        const nonCancelable = [
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (
            nonCancelable.includes(order.orderStatus)
        ) {
            throw new apiError(400, 'Order cannot be cancelled because it has already been shipped, delivered, or cancelled.')
        }

        for (const item of order.items) {
            // for (item)

            //Find Product & Increase Stock
            const updatedProduct = await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                },
                {
                    new: true,
                    session
                }

            )
            validateResourceExists(updatedProduct, "product");

        }


        // Update status to cancelled
        order.orderStatus = "cancelled";
        await order.save({ session });



        await session.commitTransaction()

        return res.status(200).json(
            new apiResponse(
                200, order, "Order cancelled successfully"
            )
        );

    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        await session.endSession()
    }
});








// =====================================
// Admin - Get All Orders
// =====================================
// const getAllOrders = asyncHandler(async (req, res) => {

//     // Pagination

//     // Filtering

//     // Sorting

//     return res.status(200).json(
//         new apiResponse(
//             200, {}, "Orders fetched successfully"
//         )
//     );
// });

// =====================================
// Admin - Update Order Status
// =====================================
// const updateOrderStatus = asyncHandler(async (req, res) => {

//     const { orderId } = req.params;

//     const { orderStatus } = req.body;

//     // Validate status

//     // Find order

//     // Update order status

//     return res.status(200).json(
//         new apiResponse(
//             200, {}, "Order status updated successfully")
//     );
// });


// =====================================
// Admin - Update Payment Status
// =====================================
// const updatePaymentStatus = asyncHandler(async (req, res) => {

//     const { orderId } = req.params;

//     const { paymentStatus } = req.body;

//     // Validate payment status

//     // Find order

//     // Update payment status

//     return res.status(200).json(
//         new apiResponse(
//             200, {}, "Payment status updated successfully")
//     );
// });


// =====================================
// Admin - Add Tracking Number
// =====================================
// const addTrackingNumber = asyncHandler(async (req, res) => {

//     const { orderId } = req.params;

//     const { trackingNumber } = req.body;

//     // Find order

//     // Save tracking number

//     return res.status(200).json(
//         new apiResponse(
//             200, {}, "Tracking number added successfully"
//         )
//     );
// });


export {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    // getAllOrders,
    // updateOrderStatus,
    // addTrackingNumber

    // updatePaymentStatus,
};