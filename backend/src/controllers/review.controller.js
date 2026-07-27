import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Product } from '../models/product.model.js'
import {
    validateObjectId,
    validateResourceExists
} from '../utils/validators/galobalValidator.js'
import { Review } from "../models/review.model.js";


//helper function
const updateProductRating = async (productId, session) => {
    const stats = await Review.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(productId)
            }
        },
        {
            $group: {
                _id: null,
                averageRating: {
                    $avg: "$rating"
                },
                numReviews: {
                    $sum: 1
                }
            }
        }
    ]).session(session)

    // Update Product
    await Product.findByIdAndUpdate(
        productId, {
        averageRating: stats[0].averageRating,
        numReviews: stats[0].numReviews
    },
        {
            session
        }
    )
}



const createUserReview = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const { productId } = req.params

    const { rating, comment } = req.body

    // Validate ProductId
    validateObjectId(productId, "Product Id")


    // Validate rating
    if (!comment?.trim() || isNaN(rating) || rating == null || rating < 1 || rating > 5) {
        throw new apiError(400, 'Invalid rating. Please provide a rating between 1 and 5. Also, comment is required.')
    }

    // Find Product
    const product = await Product.findOne({
        _id: productId
    })


    // Product Exists ?
    validateResourceExists(product, 'Product')


    //Is Product Active ?
    if (!product.isActive) {
        throw new apiError(400, `${product.title} is currently unavilable`)
    }


    // Has user already reviewed ?
    const existingReview = await Review.findOne({
        user: userId,
        product: productId
    })
    if (existingReview) {
        throw new apiError(400, 'you have already reviewed this product')
    }


    const session = await mongoose.startSession();

    try {

        await session.startTransaction()

        // Create Review
        const [review] = await Review.create(
            [
                {

                    product: productId,
                    user: userId,
                    rating,
                    comment: comment.trim()
                }
            ],
            {
                session
            }
        )

        // validateResourceExists(review, 'Review')


        // Recalculate Product Rating
        await updateProductRating(productId, session)


        await session.commitTransaction()

        // Response
        return res
            .status(201)
            .json(new apiResponse(201, { review }, 'review added successfully'))

    } catch (error) {

        await session.abortTransaction()
        throw error

    } finally {

        await session.endSession()

    }
})

const getReviewById = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const { reviewId } = req.params

    validateObjectId(reviewId, "Review Id")

    const review = await Review.findOne({
        user: userId,
        _id: reviewId
    })

    validateResourceExists(review, "Review")

    return res.status(200).json(
        new apiResponse(200, review, "review fetched successfully")
    )


})
const getProductReviews = asyncHandler(async (req, res) => {


    const { productId } = req.params

    validateObjectId(productId, "Product Id")

    const reviews = await Review.find({
        product: productId,
        isApproved: true
    }).sort({ createdAt: -1 })

    validateResourceExists(reviews, 'reviews')

    return res.status(200).json(
        new apiResponse(200,
            {
                reviewsCount: reviews.length,
                reviews
            }, 'review fetched by productId successfully')
    )
})


const getUserReviews = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const reviews = await Review.find({
        user: userId
    }).sort({ createdAt: -1 })

    validateResourceExists(reviews, "Reviews")

    return res.status(200).json(
        new apiResponse(
            200, {
            reviewsCount: reviews.length,
            reviews
        }, 'User review fetched successfully'
        )
    )
})

const updateReview = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const { productId } = req.params

    validateObjectId(productId, "Product id")

    const { rating, comment } = req.body

    if (rating < 1 || rating > 5 || !comment?.trim() || isNaN(rating) || rating == null) {
        throw new apiError(400, 'Invalid rating. Please provide a rating between 1 and 5. Also, comment is required.')
    }

    const session = await mongoose.startSession();


    try {
        await session.startTransaction()

        const review = await Review.findOneAndUpdate(
            {
                user: userId,
                product: productId
            },
            {
                rating,
                comment: comment.trim()
            },
            {
                new: true
            }
        ).session(session)

        validateResourceExists(review, 'Review')

        await updateProductRating(productId, session)

        await session.commitTransaction()

        return res.status(200).json(
            new apiResponse(200, review, 'review updated successfully')
        )

    } catch (error) {

        await session.abortTransaction()
        throw error

    } finally {

        await session.endSession()

    }
})

export {
    createUserReview,
    updateReview,
    getReviewById,
    getProductReviews,
    getUserReviews

}