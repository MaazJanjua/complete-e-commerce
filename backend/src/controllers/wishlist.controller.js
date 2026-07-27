import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { validateObjectId, validateResourceExists } from "../utils/validators/galobalValidator.js";
import { Product } from "../models/product.model.js";
import { Wishlist } from "../models/wishlist.model.js";

const getUserWishlist = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const wishlist = await Wishlist.findOne({
        user: userId
    }).populate("products")

    validateResourceExists(wishlist, 'Wishlist')

    return res.status(200).json(
        new apiResponse(200, wishlist, 'wishlist fetched successfully')
    )
})


const addProductToWishlist = asyncHandler(async (req, res) => {

    // Get userId
    const userId = req.user._id

    // Get productId
    const { productId } = req.params

    // Validate ObjectId
    validateObjectId(productId, "Product id")

    // Find Product
    const product = await Product.findById(productId)

    // Ensure Product Exists
    validateResourceExists(product, "Product")

    // Ensure Product Active
    if (!product.isActive) {
        throw new apiError(400, `${product.title} is currently unavilable`)
    }

    // Create wishlist if not exists,
    // otherwise add product without duplicates
    const wishlist = await Wishlist.findOneAndUpdate(
        {
            user: userId
        },
        {
            $addToSet: {
                products: productId
            }
        },
        {
            new: true,
            upsert: true
        }
    )

    // Return Response
    return res.status(200).json(
        new apiResponse(
            200, wishlist, 'Product added to wishlist successfully'
        )
    )
})

const removeProductFromWishlist = asyncHandler(async (req, res) => {

    // Get userId
    const userId = req.user._id
    // Get productId
    const { productId } = req.params

    // Validate ObjectId
    validateObjectId(productId, "Product id")


    // Product wishlist me hai ?
    const wishlist = await Wishlist.findOneAndUpdate(
        {
            user: userId,
            product: productId
        },
        // Remove Product
        {
            $pull: { products: productId }
        },
        // Save
        {
            new: true
        }
    )

    validateResourceExists(
        wishlist,
        "Product not found in wishlist"
    );

    // Return Response
    return res.status(200).json(
        new apiResponse(
            200, wishlist, "product removed from wishlist"
        )
    )
})


const clearWishlist = asyncHandler(async (req, res) => {
    // Get userId
    const userId = req.user._id
    // Find Wishlist
    const wishlist = await Wishlist.findOneAndUpdate(
        {
            user: userId
        },
        // products = []
        {
            $set: { products: [] }
        },
        // Save
        {
            new: true
        }
    )
    // Ensure Wishlist Exists
    validateResourceExists(wishlist, "Wishlist")

    // Return Response
    return res.status(200).json(
        new apiResponse(
            200, wishlist, 'wishlist cleared successfully'
        )
    )
})

export {
    getUserWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    clearWishlist
}