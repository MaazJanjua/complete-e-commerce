// Import Router from Express
import { Router } from 'express'

// Import all cart controllers
import {
    getUserCart,
    addToCart,
    updateCartItemQuantity, 
    removeCartItem,
    clearCart
} from '../controllers/cart.controller.js'

// JWT authentication middleware
import { verifyJWT } from '../middlewares/auth.middleware.js'
// Create router instance
const router = Router();
router.use(verifyJWT)

router.route("/").get(getUserCart)

router.route("/add/:productId").post(addToCart)

router.route('/clear').delete(clearCart)

router.route('/:productId')
    .post(updateCartItemQuantity)
    .delete(removeCartItem)

export default router
