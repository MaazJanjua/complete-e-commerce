// Import Router from Express
import { Router } from 'express'

// Import all cart controllers
import {
    getProductById,
    // getAllProducts,
    getAllProducts1,
    filterProduct,
    searchProduct,
    // createProduct,
    // updateProduct,
    // deleteProduct, 
    // toggleProductStatus,
    // updateProductImages
} from '../controllers/product.controller.js'

import {
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    updateProductImages,
    getAllProductsAdmin,
} from '../controllers/admin.controller.js'

// JWT authentication middleware
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

// Create router instance
const router = Router();

router.route('/')
    // .get(getAllProducts)
    .get(getAllProducts1)
    .post(verifyJWT, isAdmin, upload.array("productImages", 5), createProduct)

router.route("/search").get(searchProduct)

router.route("/category/:categoryId").get(filterProduct)

router.route("/:productId")
    .get(getProductById)
    .patch(verifyJWT, isAdmin, updateProduct)
    .delete(verifyJWT, isAdmin, deleteProduct)
router.route('/:productId/images')
    .patch(
        verifyJWT,
        isAdmin,
        upload.array("productImages", 5),
        updateProductImages
    )

router.route("/:productId/status")
    .patch(
        verifyJWT,
        isAdmin,
        toggleProductStatus
    )




export default router