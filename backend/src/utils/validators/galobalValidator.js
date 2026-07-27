import mongoose from "mongoose";
import { apiError } from '../apiError.js'


const validateObjectId = (id, fieldName = "Resource") => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new apiError(400, `Invalid ${fieldName}`);
    }
}

const validateResourceExists = (resource, resourcename = "Resource") => {
    if (!resource) {
        throw new apiError(404, `${resourcename} not found`)
    }
}

export {
    validateObjectId,
    validateResourceExists
};



//usage

// import {
//     validateObjectId,
//     validateResourceExists
// } from "../utils/validators.js";

// validateObjectId(productId, "Product ID");

// const product = await Product.findById(productId);

// validateResourceExists(product, "Product");