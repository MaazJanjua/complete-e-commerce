import { Router } from "express";

import {
    // User Management
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    blockUser,
    unblockUser,

    // Product Management
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    updateProductImages,
    getAllProductsAdmin,

    // Order Management
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    addTrackingNumber,

    // Review Management
    toggleReviewApproval,
    deleteReview,

    // Category Management
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,

    // Payment Management
    getAllPayments,
    getPaymentById,
    updatePaymentStatus,
    refundPayment,

    // Dashboard
    getAdminStats

} from "../controllers/admin.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT, verifyAdmin);


// ====================================
// Dashboard
// ===================================
router.route("/stats")
    .get(getAdminStats);


// ====================================
// User Management
// ====================================
router.route("/users")
    .get(getAllUsers);

router.route("/users/:userId")
    .get(getUserById)
    .delete(deleteUser);

router.route("/users/:userId/role")
    .patch(updateUserRole);

router.route("/users/:userId/block")
    .patch(blockUser);

router.route("/users/:userId/unblock")
    .patch(unblockUser);


// ====================================
// Product Management
// ====================================
router.route("/products")
    .post(createProduct)
    .get(getAllProductsAdmin);

router.route("/products/:productId")
    .patch(updateProduct)
    .delete(deleteProduct);

router.route("/products/:productId/status")
    .patch(toggleProductStatus);

router.route("/products/:productId/images")
    .patch(
        upload.array("images", 5),
        updateProductImages
    );


// ====================================
// Category Management
// ====================================
router.route("/categories")
    .post(createCategory);

router.route("/categories/:categoryId")
    .patch(updateCategory)
    .delete(deleteCategory);

router.route("/categories/:categoryId/status")
    .patch(toggleCategoryStatus);


// ====================================
// Order Management
// ====================================
router.route("/orders")
    .get(getAllOrders);

router.route("/orders/:orderId")
    .delete(deleteOrder)
    .get(getOrderById)

router.route("/orders/:orderId/status")
    .patch(updateOrderStatus);

router.route("/orders/:orderId/tracking")
    .patch(addTrackingNumber);


// ====================================
// Payment Management
// ====================================
router.route("/payments")
    .get(getAllPayments);

router.route("/payments/:paymentId/status")
    .patch(updatePaymentStatus);

router.route("/payments/:paymentId/refund")
    .patch(refundPayment);

router.route("/payments/:paymentId")
    .get(getPaymentById)


// ====================================
// Review Management
// ====================================
router.route("/reviews/:reviewId")
    .delete(deleteReview);

router.route("/reviews/:reviewId/approval")
    .patch(toggleReviewApproval);


export default router;