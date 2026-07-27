import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";

//VALIDATE IMPORTS
import {
    validateObjectId,
    validateResourceExists
} from '../utils/validators/galobalValidator.js'



const getProductById = (asyncHandler(async (req, res) => {

    // Get product id from URL params
    const { productId } = req.params

    // Validate MongoDB ObjectId
    validateObjectId(productId, "Product id")

    // Find product by id
    const product = await Product.findById(productId)

    // Check product exists
    validateResourceExists(product, 'Product')

    // Send response
    return res
        .status(200)
        .json(
            new apiResponse(
                200, product, 'product fetched successfully'
            )
        )
}))

const getAllProducts1 = (asyncHandler(async (req, res) => {

    // Get filters and pagination values from query
    let {
        page = 1,
        limit = 12,
        search,
        category,
        minPrice,
        maxPrice,
        sort = "newest"
    } = req.query;


    // Validate pagination values
    page = Math.max(parseInt(page) || 1, 1);

    limit = Math.min(
        Math.max(parseInt(limit) || 12, 1),
        50
    );

    // Base filter for active products
    const matchStage = {
        isActive: true
    };

    // Search product by title or slug
    if (search?.trim()) {

        const keyword = search.trim();

        matchStage.$or = [
            {
                title: {
                    $regex: keyword,
                    $options: "i" // Case insensitive search
                }
            },
            {
                slug: {
                    $regex: keyword,
                    $options: "i"
                }
            }
        ];
    }

    // Apply price range filter
    if (minPrice || maxPrice) {

        matchStage.price = {};

        if (minPrice) {
            matchStage.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            matchStage.price.$lte = Number(maxPrice);
        }
    }



    // Sorting products
    let sortStage = {};

    switch (sort) {

        case "price-asc":
            sortStage = { price: 1 }; // Low to high
            break;

        case "price-desc":
            sortStage = { price: -1 }; // High to low
            break;

        case "rating":
            sortStage = { averageRating: -1 }; // Highest rated first
            break;

        case "oldest":
            sortStage = { createdAt: 1 };
            break;

        default:
            sortStage = { createdAt: -1 }; // Latest products first
    }



    // Build MongoDB aggregation pipeline
    const aggregate = Product.aggregate([

        // Filter products
        {
            $match: matchStage
        },

        // Join category data
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },

        // Convert category array into object
        {
            $unwind: "$category"
        },

        // Filter by category slug
        ...(category
            ? [
                {
                    $match: {
                        "category.slug": category.toLowerCase()
                    }
                }
            ]
            : []
        ),



        // Add calculated fields
        {
            $addFields: {

                // First product image as thumbnail
                thumbnail: {
                    $arrayElemAt: [
                        "$productImages",
                        0
                    ]
                },


                // Calculate discount percentage
                discountPercentage: {

                    $cond: [
                        {
                            $gt: [
                                "$discountPrice",
                                0
                            ]
                        },

                        {
                            $round: [
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                {
                                                    $subtract: [
                                                        "$price",
                                                        "$discountPrice"
                                                    ]
                                                },
                                                "$price"
                                            ]
                                        },
                                        100
                                    ]
                                },
                                0
                            ]
                        },

                        0
                    ]
                }
            }
        },


        // Select required fields only
        {
            $project: {

                title: 1,
                slug: 1,
                description: 1,
                price: 1,
                discountPrice: 1,
                discountPercentage: 1,
                stock: 1,
                averageRating: 1,
                numReviews: 1,
                thumbnail: 1,
                createdAt: 1,

                category: {
                    _id: "$category._id",
                    name: "$category.name",
                    slug: "$category.slug"
                }
            }
        },


        // Apply sorting
        {
            $sort: sortStage
        }
    ]);



    // Apply pagination
    const result = await Product.aggregatePaginate(
        aggregate,
        {
            page,
            limit
        }
    );



    // Send final response
    return res.status(200).json(
        new apiResponse(
            200,
            {
                products: result.docs,

                pagination: {
                    page: result.page,
                    limit: result.limit,
                    totalProducts: result.totalDocs,
                    totalPages: result.totalPages,
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage,
                    nextPage: result.nextPage,
                    prevPage: result.prevPage
                }
            },
            "Products fetched successfully"
        )
    );

}));

const filterProduct = (asyncHandler(async (req, res) => {

    // Get filter values from query
    const { category, maxPrice, minPrice } = req.query

    // Validate required category
    if (!category) {
        throw new apiError(404, 'field is required')
    }

    // Validate price
    if (minPrice < 0) {
        throw new apiError(401, 'price must be positive')
    }

    // Create filter object
    let filter = {};

    // Add category filter
    if (category) {
        filter.category = category;
    }

    // Add price range filter
    if (minPrice || maxPrice) {

        filter.price = {};

        if (minPrice)
            filter.price.$gte = Number(minPrice)

        if (maxPrice)
            filter.price.$lte = Number(maxPrice)
    }

    // Find matching products
    const products = await Product.find(filter)

    // Send response
    return res.status(200)
        .json(
            new apiResponse(
                200, { products }, 'Products filtered Successfully'
            )
        )

}))

const searchProduct = (asyncHandler(async (req, res) => {

    // Get search keyword from URL
    const { query } = req.params

    // Validate search keyword
    if (!query?.trim()) {
        throw new apiError(400, 'search query is required')
    }

    // Search product fields
    const products = await Product.find(
        {
            $or: [
                // Search in title
                {
                    title: {
                        $regex: query,
                        $options: "i"
                    }
                },
                // Search in description
                {
                    description: {
                        $regex: query,
                        $options: "i"
                    }
                },
                // Search in category
                {
                    category: {
                        $regex: query,
                        $options: "i"
                    }
                },
                // Search in slug
                {
                    slug: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        }
    )

    // Send search result
    return res
        .status(200)
        .json(
            new apiResponse(
                200, products, 'product searched successfully'
            )
        )
}))

export {
    getProductById,
    // getAllProducts,
    getAllProducts1,
    filterProduct,
    searchProduct,
}