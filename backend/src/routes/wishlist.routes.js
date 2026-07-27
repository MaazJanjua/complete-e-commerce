// Import Router from Express
import { Router } from 'express'

// Import all cart controllers
import {
    getUserWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    clearWishlist
} from '../controllers/wishlist.controller.js'


// JWT authentication middleware
import { verifyJWT } from '../middlewares/auth.middleware.js'
// Create router instance
const router = Router();
router.use(verifyJWT);

router.route("/").get( getUserWishlist)

router.route("/:productId")
    .post( addProductToWishlist)
    .delete( removeProductFromWishlist)

router.route("/clear")
    .delete( clearWishlist)


export default router