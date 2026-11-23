import mongoose from "mongoose";
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from "../utils/apiResponse.js";
import { validateResourceExists, validateObjectId } from '../utils/validators/galobalValidator.js';
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js"; // <-- Missing import added

// =====================================
// 1. Get User Cart
// =====================================
const getUserCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.product",
            select: "title slug price stock productImages category isActive"
        });

    // Agar naya user hai aur cart abhi nahi bana, to empty cart return karein (404 error nahi)
    if (!cart) {
        return res.status(200).json(
            new apiResponse(200, { items: [], totalPrice: 0 }, "Cart is empty")
        );
    }

    // Deleted ya inactive products ko filter out karke fresh total calculate karein
    cart.items = cart.items.filter(item => item.product && item.product.isActive !== false);
    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);

    await cart.save();

    return res.status(200).json(
        new apiResponse(200, cart, "Cart fetched successfully")
    );
});

// =====================================
// 2. Add Product To Cart
// =====================================
const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const quantity = Number(req.body.quantity) || 1;

    validateObjectId(productId, "Product ID");

    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new apiError(400, "Quantity must be at least 1");
    }

    // Check product exists & active
    const product = await Product.findById(productId);
    validateResourceExists(product, "Product");

    if (!product.isActive) {
        throw new apiError(400, "This product is currently unavailable");
    }

    // Get existing cart
    let cart = await Cart.findOne({ user: userId });

    let existingQuantity = 0;
    if (cart) {
        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );
        if (existingItem) {
            existingQuantity = existingItem.quantity;
        }
    }

    // Stock validation
    if (existingQuantity + quantity > product.stock) {
        throw new apiError(
            400,
            `Only ${product.stock} item(s) available in stock`
        );
    }

    if (!cart) {
        // Create new cart if doesn't exist
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity }],
            totalPrice: product.price * quantity
        });
    } else {
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Increase quantity if already in cart
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Push new product
            cart.items.push({ product: productId, quantity });
        }

        await cart.populate({
            path: "items.product",
            select: "title slug price stock productImages"
        });

        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        await cart.save();
    }

    // Re-populate before returning response
    await cart.populate({
        path: "items.product",
        select: "title slug price stock productImages"
    });

    return res.status(200).json(
        new apiResponse(200, cart, "Product added to cart successfully")
    );
});

// =====================================
// 3. Update Item Quantity
// =====================================
const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const quantity = Number(req.body.quantity);

    validateObjectId(productId, "Product ID");

    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new apiError(400, "Quantity must be at least 1");
    }

    const product = await Product.findById(productId);
    validateResourceExists(product, "Product");

    if (quantity > product.stock) {
        throw new apiError(400, `Only ${product.stock} item(s) available in stock`);
    }

    const cart = await Cart.findOne({ user: userId });
    validateResourceExists(cart, "Cart");

    const existingItem = cart.items.find(
        item => item.product.toString() === productId
    );

    if (!existingItem) {
        throw new apiError(404, "Item not found in cart");
    }

    existingItem.quantity = quantity;

    await cart.populate({
        path: "items.product",
        select: "title slug price stock productImages"
    });

    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);

    await cart.save();

    return res.status(200).json(
        new apiResponse(200, cart, "Cart item updated successfully")
    );
});

// =====================================
// 4. Remove Item From Cart
// =====================================
const removeCartItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    validateObjectId(productId, "Product ID");

    const cart = await Cart.findOne({ user: userId });
    validateResourceExists(cart, "Cart");

    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
        throw new apiError(404, "Product not found in cart");
    }

    cart.items.splice(itemIndex, 1);

    await cart.populate({
        path: "items.product",
        select: "title slug price stock productImages"
    });

    // Fixed: totalPrice & item.product.price
    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);

    await cart.save();

    return res.status(200).json(
        new apiResponse(200, cart, "Item removed from cart successfully")
    );
});

// =====================================
// 5. Clear Entire Cart
// =====================================
const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOneAndUpdate(
        { user: userId },
        {
            $set: {
                items: [],     // Fixed typo: 'items' instead of 'item'
                totalPrice: 0  // Fixed field name: 'totalPrice'
            }
        },
        { new: true }
    );

    validateResourceExists(cart, "Cart");

    return res.status(200).json(
        new apiResponse(200, cart, "Cart cleared successfully")
    );
});

export {
    getUserCart,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
};