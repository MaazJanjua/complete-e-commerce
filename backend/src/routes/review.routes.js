// Import Router from Express
import { Router } from 'express'

// Import all cart controllers
import {
    createUserReview,
    updateReview,
    getReviewById,
    getProductReviews,
    getUserReviews,
    // toggleReviewApproval,
    // deleteReview
} from '../controllers/review.controller.js'

import {
    toggleReviewApproval,
    deleteReview,
} from '../controllers/admin.controller.js'

// JWT authentication middleware
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'
// Create router instance
const router = Router();
router.use(verifyJWT)

router.route("/").post(createUserReview)

router.route("/user").get(getUserReviews)

router.route("/product/:productId").get(getProductReviews)

router.route("/:reviewId").get(getReviewById)

router.route("/:reviewid").patch(updateReview)

router.route("/:reviewId")
    .delete(deleteReview)

router.route("/admin/:reviewId/approval")
    .patch(isAdmin, toggleReviewApproval)


export default router