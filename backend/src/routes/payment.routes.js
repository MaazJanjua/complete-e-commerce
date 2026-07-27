// Import Router from Express
import { Router } from "express";

// Import User Payment Controllers
import {
    createPayment,
    verifyPayment,
    paymentWebhook,
    getPaymentById,
    getPaymentByOrderId
    
} from "../controllers/payment.controller.js";

// Import Admin Controllers
import {
    getAllPayments,
    updatePaymentStatus,
    refundPayment
} from "../controllers/admin.controller.js";

// Middlewares
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// ---------------------------
// Public Route (Gateway)
// ---------------------------
router.route("/webhook").post(paymentWebhook);

// ---------------------------
// Protected Routes
// ---------------------------
router.use(verifyJWT);

// User Routes
router.route("/order/:orderId")
    .post(createPayment);

router.route("/verify")
    .post(verifyPayment);

router.route("/:paymentId")
    .get(getPaymentById);

router.route("/order/:orderId")
    .get(getPaymentByOrderId);

// ---------------------------
// Admin Routes
// ---------------------------
router.route("/admin/all")
    .get(isAdmin, getAllPayments);

router.route("/admin/:paymentId/status")
    .patch(isAdmin, updatePaymentStatus);

router.route("/admin/:paymentId/refund")
    .post(isAdmin, refundPayment);

export default router;