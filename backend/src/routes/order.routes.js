// Import Router from Express
import { Router } from 'express'

// Import all cart controllers
import {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    // getAllOrders,
    // updateOrderStatus,
    // updatePaymentStatus,
    // addTrackingNumber
} from '../controllers/order.controller.js'

import {
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    addTrackingNumber,
} from '../controllers/admin.controller.js'

// JWT authentication middleware
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'
// Create router instance
const router = Router();
router.use(verifyJWT)

router.route("/").post(createOrder)

router.route('/user-orders').get(getUserOrders)

router.route("/:orderId").get(getOrderById)

router.route("/:orderId/cancel").delete(cancelOrder)

router.use(isAdmin)

router.route("/admin/all-orders").get(getAllOrders)

router.route("/admin/:orderId/status").post(updateOrderStatus)

router.route('/admin/:orderId/tracking').post(addTrackingNumber)

export default router