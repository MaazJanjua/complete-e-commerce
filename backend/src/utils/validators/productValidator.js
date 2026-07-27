import { apiError } from "../apiError.js";


const validateCreateProductData = ({ title, description, price, category, stock }) => {

    if (!title?.trim() || !description?.trim() || !category?.trim() || price == null || stock == null || isNaN(price) || isNaN(stock)) {
        throw new apiError(400, "All fields (title, description, price, category, stock) are required");
    }
    if (stock < 0 || price < 0) {
        throw new apiError(400, "Price and stock cannot be negative");
    }

}

export {
    validateCreateProductData
}