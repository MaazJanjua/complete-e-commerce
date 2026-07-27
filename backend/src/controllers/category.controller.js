import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { validateObjectId, validateResourceExists } from "../utils/validators/galobalValidator.js";


// const createCategory = (asyncHandler(async (req, res) => { }))


// =====================================
// Get Category By Id
// =====================================
const getCategoryById = asyncHandler(async (req, res) => {

    // Get category id from URL
    const { categoryId } = req.params;

    // Validate category id
    validateObjectId(categoryId, "Category id");

    // Find category by id
    const category = await Category.findById(categoryId)
        .lean();

    // Check category exists
    validateResourceExists(category, "Category");

    // Send response
    return res.status(200).json(
        new apiResponse(
            200, category, "Category fetched successfully"
        )
    );
});


// =====================================
// Get All Categories
// =====================================
const getAllCategories = asyncHandler(async (req, res) => {

    // Fetch all categories
    const categories = await Category.find()
        .select("name slug createdAt")
        .sort({ createdAt: -1 })
        .lean();

    // Send response
    return res.status(200).json(
        new apiResponse(
            200, { categories }, "Categories fetched successfully"
        )
    );
});


// const updateCategory = (asyncHandler(async (req, res) => { }))
// const deleteCategory = (asyncHandler(async (req, res) => { }))
// const toggleCategoryStatus = (asyncHandler(async (req, res) => { }))

export {
    getCategoryById,
    getAllCategories,

    // createCategory,
    // updateCategory,
    // deleteCategory,
    // toggleCategoryStatus
}