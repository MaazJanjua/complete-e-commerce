import mongoose from "mongoose"
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js';
import { apiResponse } from "../utils/apiResponse.js";


import {
    validateResourceExists,
    validateObjectId
} from '../utils/validators/galobalValidator.js'
import { Cart } from "../models/cart.model.js";


// =====================================
// Get User Cart
// =====================================
const getUserCart = (asyncHandler(async (req, res) => {

    const userId = req.user._id;

    // Find cart
    const cart = await Cart.findOne({
        user: userId
    }).populate({
        path: "user",
        select: "fullName username email"
    })
        .populate({
            path: "items.product",
            select: "title slug price stock images category"
        });

    validateResourceExists(cart, 'Cart')

    return res.status(200).json(
        new apiResponse(
            200, {}, "Cart fetched successfully"
        )
    );
}))

// =====================================
// Add Product To Cart
// =====================================
const addToCart = (asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const { productId } = req.params

    const { quantity = 1 } = req.body;

    // Validate productId
    validateObjectId(productId, "product id")

    // Validate quantity  ||  It checks whether the quantity is an integer (whole number) or not. 
    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new apiError(400, "Quantity must be at least 1");
    }

    // Check product exists 
    const product = await Product.findById(productId);

    validateResourceExists(product, "Product");

    //get user existing cart
    const existingCart = await Cart.findOne({ user: userId })

    //find existing quantity || default = 0
    let existingQuantity = 0

    //if cart exists
    if (existingCart) {

        //check if product exists in cart or not
        const existingItem = existingCart.items.find(

            item => item.product.toString() === productId
        )
        if (existingItem) {

            //save existing quntity
            existingQuantity = existingItem.quantity
        }
    }

    //  stock Check
    if (existingQuantity + quantity > product.stock) {
        throw new apiError(
            400,
            `Only ${product.stock} item(s) available in stock`
        );
    }

    // Find cart
    // if Product already exists?
    //increse quntity
    const cart = await Cart.findOneAndUpdate(
        {
            user: userId,
            // Cart ke items array mein product search karna
            "items.product": productId
        },
        {// Increase quantity
            $inc: {
                "items.$.quantity": quantity
            }
        },
        {
            new: true
        },
        'quantity increased successfully'
    )

    //if not exists
    if (!cart) {
        cart = await Cart.findOneAndUpdate(
            {
                user: userId
            },
            {
                //push new items in items array
                $push: {
                    items: {
                        product: productId,
                        quantity: quantity,
                        addedAt: new Date()

                    }
                },
                //if crt exists then update and if cart doesnot exists then create new one
                $setOnInsert: {
                    totalPrice: 0
                },
            },
            {
                new: true,
                upsert: true
            }
        )
    }
    // Populate  products || get product detailed
    await cart.populate({
        path: "items.product",
        select: "title slug price stock images",
    });

    // Recalculate total price
    // reduce() is an array method used to convert all array elements into a single value.cart.items.reduce()EXAMPLE([1,2,3]=>sum = 6)
    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);

    await cart.save();



    return res.status(200).json(
        new apiResponse(
            200,
            cart,
            "Product added to cart successfully"
        )
    );
}))

// =====================================
// Update Item Quantity
// =====================================
const updateCartItemQuantity = (asyncHandler(async (req, res) => {
    
    const userId = req.user._id;

    const { productId } = req.params;

    const { quantity } = req.body;

    // Validate quantity
    if (quantity <= 0) {
        throw new apiError(400, 'quantity must be positive')
    }

    // Find cart
    const cart = await Cart.findOne({ user: userId })

    validateResourceExists(cart, "Cart")

    // Find cart item
    const existingItem = cart.items.find(
        item => item.product.toString() === productId
    )

    if (!existingItem) {
        throw new apiError(404, "Item not found in cart")
    }

    // Update quantity
    existingItem.quantity = quantity;

    await cart.populate({
        path: "items.product",
        select: "price"
    })


    // Recalculate total
    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.product.price * item.quantity
    }, 0)

    // Save cart
    await cart.save();


    return res.status(200).json(
        new apiResponse(
            200, cart, "Cart item updated successfully"
        )
    );
}))


// =====================================
// Remove Item From Cart
// =====================================
const removeCartItem = (asyncHandler(async (req, res) => {

    // Get logged-in user id
    const userId = req.user._id;

    // Get product id from URL
    const { productId } = req.params;

    // Validate product id
    validateObjectId(productId, "Product id");

    // Find user's cart
    const cart = await Cart.findOne({
        user: userId
    });

    // Check cart exists
    validateResourceExists(cart, "Cart");


    // Find product index in cart
    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId,
    )

    //check product Exists in cart
    if (itemIndex === -1) {
        throw new apiError(404, 'product not found')
    }

    // Remove Product From Cart
    cart.items.splice(itemIndex, 1)

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
    }, 0)

    // Save cart
    await cart.save()

    return res.status(200).json(
        new apiResponse(
            200, { cart }, "Item removed from cart successfully"
        )
    );
}))


// =====================================
// Clear Entire Cart
// =====================================
const clearCart = (asyncHandler(async (req, res) => {

    // Get logged-in user id
    const userId = req.user._id;

    // Find user's cart
    const cart = await Cart.findOneAndUpdate(
        {
            user: userId
        },
        {
            $set: {
                item: [],
                totalAmount: 0
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    validateResourceExists(cart, "Cart")

    // Send response
    return res.status(200).json(
        new apiResponse(
            200, cart, "Cart cleared successfully"
        )
    );

}));



export {
    getUserCart,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
}