// Import Router from Express
import { Router } from 'express'

// Import all cart controllers
import {
    // createCategory,
    getCategoryById,
    getAllCategories,
    // updateCategory,
    // deleteCategory,
    // toggleCategoryStatus
} from '../controllers/category.controller.js'

import {
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus
} from '../controllers/admin.controller.js'

// JWT authentication middleware
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js';
// Create router instance
const router = Router();

router.route("/")
    .post(verifyJWT, isAdmin, createCategory)
    .get(getAllCategories)

router.route("/:categoryId")
    .get(getCategoryById)
    .patch(
        verifyJWT,
        isAdmin,
        updateCategory
    )
    .delete(
        verifyJWT,
        isAdmin,
        deleteCategory
    )

router.route("/:categoryId/toggle")
    .patch(
        verifyJWT,
        isAdmin,
        toggleCategoryStatus
    )

export default router