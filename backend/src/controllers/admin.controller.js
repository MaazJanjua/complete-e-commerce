import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { validateCreateProductData } from "../utils/validators/productValidator.js";
import { validateObjectId, validateResourceExists } from "../utils/validators/galobalValidator.js";
import { User } from "../models/user.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

// ------------------------------
//  USER MANAGEMENT (ADMIN)
// ------------------------------
const getAllUsers = asyncHandler(async (req, res) => {
    // TODO: fetch all users (pagination optional)
    // Request


    // Get Query Params    (page, limit, search, role, status, sort)

    const { page = 1, limit = 12, search, role, status, sort = "newest" } = req.query

    const pageNumbers = parseInt(page);
    const limitNumbers = parseInt(limit);

    // Validate Pagination
    if (pageNumbers <= 0 || limitNumbers <= 0 || limitNumbers > 100) {
        throw new apiError(400, 'invalid pagination')
    }

    // Build MongoDB Filter
    let matchUser = {
        isDeleted: false
    }

    if (role) {
        matchUser.role = role;
    }

    if (status === "blocked") {
        matchUser.isBlocked = true;
    }

    if (status === "active") {
        matchUser.isBlocked = false;
    }

    //Search user by username or email
    if (search?.trim()) {
        const keyword = search.trim();

        matchUser.$or = [
            {
                username: {
                    $regex: keyword,
                    $options: "i"//case insensetive search
                }
            },
            {
                email: {
                    $regex: keyword,
                    $options: "i"
                }
            }
        ]
    }


    // Build Sort Object

    let sortOption = {};
    switch (sort) {
        case "oldest":
            sortOption.createdAt = 1;
            break;

        case "username":
            sortOption.username = 1;
            break;

        case "email":
            sortOption.email = 1;
            break;

        default:
            sortOption.createdAt = -1
    }


    const skip = (pageNumbers - 1) * limitNumbers;

    // Build aggregation pipeline
    const aggregate = User.aggregate([
        //filter Users
        {
            $match: matchUser
        },

        {
            // Remove Sensitive Fields    (password, refreshToken)
            $project: {
                password: 0,
                refreshToken: 0
            }
        },
        {
            $sort: sortOption
        },

        //facet fpr totalCount
        {
            $facet: {
                users: [
                    // Fetch Users    (skip + limit)
                    {
                        $skip: skip
                    },
                    {
                        $limit: limitNumbers
                    }
                ],
                totalCount: [
                    {
                        $count: "count"
                    }
                ]
            }
        }
    ])

    const result = (await aggregate)[0] || {
        users: [],
        totalCount: []
    };

    const users = result.users;
    const totalUsers = result.totalCount[0]?.count || 0;
    // totalUsers = 57
    // limit = 12
    // 57 / 12 = 4.75
    // Math.ceil(4.75) = 5
    const totalPages = Math.ceil(totalUsers / limitNumbers);


    return res.status(200).json(
        new apiResponse(
            200,
            {
                users,
                pagination: {
                    currentPages: pageNumbers,
                    limit: limitNumbers,
                    totalUsers,
                    totalPages
                }
            }
            , 'all users fetched successsfully'
        )
    )
});

const getUserById = asyncHandler(async (req, res) => {
    // TODO: req.params.userId → find user

    const { userId } = req.params

    // Validate ObjectId
    validateObjectId(userId, 'User id')

    // Find user
    const user = await User.findOne({
        _id: userId,
        isDeleted: false
    }).select("-password -refreshToken");

    // Validate Exists
    validateResourceExists(user, "User")

    // Return Response
    return res.status(200).json(
        new apiResponse(200, user, "user fetched by id successfully")
    )
});

const updateUserRole = asyncHandler(async (req, res) => {
    // TODO: change user role (user → admin / admin → user)

    // Request

    // Get Params(userId)
    const { userId } = req.params

    // Get Body(role)
    const { role } = req.body

    // Validate ObjectId(userId)
    validateObjectId(userId, "User id")

    // Validate role
    const allowedRoles = [
        "user",
        "admin"
    ]
    if (!role || !allowedRoles.includes(role)) {
        throw new apiError(400, "Invalid role")
    }

    // Find User
    const user = await User.findById(userId);

    // User Exists ?
    validateResourceExists(user, "User");

    // Prevent assigning same role
    if (user.role === role) {
        throw new apiError(400, `User is already ${role}`)
    }

    if (user.isDeleted) {
        throw new apiError(400, "Cannot update role of deleted user");
    }
    // (Optional) Prevent changing Super Admin role //AFTER PROJECT COMPLETION IF REQUIRED
    // if (user.role === "superAdmin") {
    //     throw new apiError(
    //         403,
    //         "Super Admin role cannot be changed"
    //     );
    // }

    // Update user.role
    user.role = role

    // Save User
    await user.save();

    const updatedUser = await User.findById(userId)
        .select("-password -refreshToken");

    // Return Response
    return res.status(200).json(
        new apiResponse(
            200, updatedUser, "User role updated successfully"
        )
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    // TODO: remove user from DB
    // Request

    // Get userId
    const { userId } = req.params

    // Validate ObjectId
    validateObjectId(userId, "User Id")

    // Find User
    const user = await User.findById(userId)

    // User Exists ?
    validateResourceExists(user, "User")


    // Prevent Self Delete
    if (user._id.toString() === req.user._id.toString()) {
        throw new apiError(
            400, "You cannot delete your own account");
    }

    // Already Deleted ?
    if (user.isDeleted) {
        throw new apiError(
            400, "User Alreadt Deleted");
    }

    // user.isDeleted = true
    user.isDeleted = true
    user.isBlocked = true;

    // user.deletedAt = new Date()(optional)
    user.deletedAt = new Date()





    // Save User
    await user.save()

    const deletedUser = await User.findById(userId)
        .select("-password -refreshToken");

    // Return Success Response
    return res.status(200).json(new apiResponse(
        200, deletedUser, "user deleted successfully"
    ))
});

const blockUser = asyncHandler(async (req, res) => {
    //get userId
    const { userId } = req.params

    // validate ObjectId
    validateObjectId(userId, "User id")

    //find user
    const user = await User.findById(userId)

    //user exists
    validateResourceExists(user, "User")

    //prevent self block
    if (user._id.toString() === req.user._id.toString()) {
        throw new apiError(400, "You cannot block your own account")
    }
    //check already bloacked?
    if (user.isBlocked) {
        throw new apiError(400, "User is already blocked")
    }

    //deleted user cannot be blocked
    if (user.isDeleted) {
        throw new apiError(400, 'Cannot block a deleted user')
    }

    //isblocked=true
    user.isBlocked = true

    //save
    await user.save();

    const blockedUser = await User.findById(userId)
        .select('-password -refreshToken')

    //response
    return res.status(200).json(
        new apiResponse(
            200, blockedUser, "User blocked successfully"
        )
    );

});

const unblockUser = asyncHandler(async (req, res) => {
    // TODO: enable user account
    //get userId
    const { userId } = req.params

    // validate ObjectId
    validateObjectId(userId, "User id")

    //find user
    const user = await User.findById(userId)

    //user exists
    validateResourceExists(user, "User")

    //deleted user cannot be unblocked
    if (user.isDeleted) {
        throw new apiError(400, 'cannot unblock a deleted user')
    }

    //already active
    if (!user.isBlocked) {
        throw new apiError(400, 'user is already active/unblocked')
    }

    //unblock user
    user.isBlocked = false;

    await user.save();

    const unblockedUser = await User.findById(userId)
        .select("-password -refreshToken")

    return res.status(200).json(
        new apiResponse(
            200,
            unblockedUser,
            "User unblocked successfully"
        )
    );


});


// ------------------------------
//  PRODUCT MANAGEMENT (ADMIN)
// ------------------------------
const createProduct = asyncHandler(async (req, res) => {

    // TODO: add new product
    const { title, description, category, price, stock } = req.body

    validateObjectId(category, "Category");


    validateCreateProductData({
        title, description, category, price, stock
    })

    //check dublicate product

    const cleanTitle = title.trim();

    const slug = slugify(cleanTitle, {
        lower: true
    });



    const existingProduct = await Product.findOne({ slug, isDeleted: false });

    if (existingProduct) {
        throw new apiError(409, "Product already exists");
    }

    //category exist
    const categoryExists = await Category.exists({ _id: category });

    validateResourceExists(existingCategory, "Category");



    const productLocalPaths = req.files?.productImages?.map(file => file.path) || [];

    if (productLocalPaths.length === 0) {
        throw new apiError(400, 'product Image is required')
    }

    if (productLocalPaths.length > 5) {
        throw new apiError(
            400,
            "Maximum 5 images allowed"
        );
    }

    //upload file to cloudinary
    // const productImage = await uploadOnCloudinary(productLocalPaths)


    //store uploded images
    let uploadImages = [];

    try {

        uploadImages = await Promise.all(
            productLocalPaths.map(async (path) => {
                const image = await uploadOnCloudinary(path);

                if (!image) {
                    throw new apiError(500, "Failed to upload product image");
                }

                return {
                    url: image.secure_url,
                    public_id: image.public_id
                };
            })
        );

        // create product

        const product = await Product.create({
            title: cleanTitle,
            slug,
            description: description.trim(),
            productImages: uploadImages,
            price,
            category,
            stock,
            owner: req.user._id
        })

        const createdProduct =
            await Product.findById(product._id)
                .populate("category", "name slug")
                .populate("owner", "username email")

        return res.status(201).json(
            new apiResponse(201, createdProduct, 'product created successfully')
        )

    } catch (error) {

        try {
            if (uploadImages.length > 0) {
                await Promise.all(
                    uploadImages.map((img) =>
                        deleteFromCloudinary(img.public_id)
                    )
                );
            }
        } catch (cleanupError) {
            console.error(
                'Cloudinary cleanup failed:',
                cleanupError
            );
        }

        throw error;
    }

});

const getAllProductsAdmin = asyncHandler(async (req, res) => {
    // TODO: get all products (including inactive)
});

//ONLY DETAILS
const updateProduct = asyncHandler(async (req, res) => {

    // TODO: update product by id
    const { productId } = req.params

    validateObjectId(productId, 'product id')

    const { title, description, price, stock } = req.body

    if (!title?.trim() || !description?.trim() || price == null || isNaN(price) || stock == null || isNaN(stock)) {
        throw new apiError(400, 'all fields are required')
    }

    if (stock < 0 || price < 0) {
        throw new apiError(400, 'price connot be negative')
    }

    const product = await Product.findOneAndUpdate(
        {
            _id: productId,
            owner: req.user._id
        },
        {
            title: title.trim(),
            description: description.trim(),
            slug: slugify(title, {
                lower: true
            }),
            stock,
            price
        },
        {
            new: true,
            runValidators: true
        }
    )

    validateResourceExists(product, 'Product')

    return res.status(200).json(new apiResponse(
        200, product, 'product updated successfully'
    ))
});

const updateProductImages = (asyncHandler(async (req, res) => {
    // Request

    // Get productId
    const { productId } = req.params
    // Validate ObjectId
    validateObjectId(productId, "Product Id")

    // Find product
    const product = await Product.findOne({
        owner: req.user._id,
        _id: productId
    })
    // Product exists ?
    validateResourceExists(product, "Product")

    // Owner / Admin check
    // if (req.user?.toString() !== req.user._id?.toString()) {
    //     throw new apiError(404, 'you are not alloweded to this operation')
    // }

    // Receive new images
    const productImagesPath =
        req.files?.productImages?.map(files => files.path) || []

    if (productImagesPath.length === 0) {
        throw new apiError(400, 'images not found')
    }

    // Validate max images(5)
    if (productImagesPath.length > 5) {
        throw new apiError(400, 'only 5 images alloweded')
    }


    // Upload new images to Cloudinary
    let uploadedImages = [];

    try {

        uploadedImages = await Promise.all(
            productImagesPath.map(async (path) => {
                const image = await uploadOnCloudinary(path);
                if (!image) {
                    throw new apiError(400, 'product images upload failed')
                }

                return {
                    url: image.secure_url,
                    public_id: image.public_id
                }
            })
        )

        // Delete old images from Cloudinary
        await Promise.all(
            product.productImages.map(image =>
                deleteFromCloudinary(image.public_id)
            )
        );

        // Replace productImages
        product.productImages = uploadedImages;

        // Save product
        await product.save()

        // Return updated product
        return res.status(200).json(
            new apiResponse(
                200, uploadedImages, "images uploaded successfully"
            )
        )

    } catch (error) {
        if (uploadedImages.length) {

            try {
                await Promise.all(
                    uploadedImages.map(image =>
                        deleteFromCloudinary(image.public_id)
                    )
                );
            } catch (rollbackError) {
                console.error("Rollback failed:", rollbackError);
            }

        }
        throw error
    }
}))

const deleteProduct = asyncHandler(async (req, res) => {

    // TODO: delete product
    const { productId } = req.params

    validateObjectId(productId, 'product id')

    //Find Product
    const product = await Product.findOne({
        _id: productId,
        owner: req.user._id
    })
    //validate exists
    validateResourceExists(product, 'Product')

    //Delete Images From Cloudinary
    await Promise.all(
        product.productImages.map(image =>
            deleteFromCloudinary(image.public_id)
        )
    );

    //Delete Product from MongoDB
    await product.deleteOne();


    return res.status(200).json(
        new apiResponse(
            200,
            product,
            "Product deleted successfully"
        )
    )
});

//add new image if needs  || upload just just 1 image 
const addProductImages = (asyncHandler(async (req, res) => {

    const { productId } = req.params

    validateObjectId(productId, "Product Id")

    // Find Product
    const product = await Product.finsOne({
        _id: productId,
        owner: req.user._Id
    })

    validateResourceExists(product, "Product")

    const imagePath = req.files?.productImages?.[0]?.path || req.files?.path;

    if (!imagePath) {
        throw new apiError(400, "Image not found");
    }

    const oldImage = product.productImages

    let uplodedImages = null

    try {
        uploadedImage = await uploadOnCloudinary(imagePath)

        if (!uploadImages) {
            throw new apiError(400, 'Image upload failed')
        }

        product.productImages = {
            url: uploadedImage.secure._url,
            public_id: uploadedImages.public._id
        }
        await product.save();

        if (oldImage?.public_id) {
            try {
                await deleteFromCloudinary(oldImage.public._id)
            } catch (deleteError) {
                console.error("Failed to delete old image:", deleteError);
            }
        }

        return res.status(200).json(
            new apiResponse(
                200,
                product,
                "Product image replaced successfully"
            )
        );

    } catch (error) {
        if (uploadedImage?.public_id) {
            try {
                await deleteFromCloudinary(uploadedImage.public_id);
            } catch (rollbackError) {
                console.error("Rollback failed:", rollbackError);
            }
        }

        throw error;
    }
}))

//REMOVE ONLY ONE IMAGE
const removeProductImage = (asyncHandler(async (req, res) => {
    // Get productId
    const { productId } = req.params;

    validateObjectId(productId, "Product Id");
    // Get public_id
    const { public_id } = req.body;

    // Find product

    const product = await Product.findOne({
        _id: productId,
        owner: req.user._id
    });

    validateResourceExists(product, "Product");


    // Find image in  product.productImages
    const image = product.productImages.find(
        img => img.public_id === public_id
    )

    if (!image) {
        throw new apiError(404, "Image not found");
    }

    // Remove from productImages array

    product.productImages = product.productImages.filter(
        img => img.public_id !== public_id
    )

    // Save
    await product.save();

    try {
        await deleteFromCloudinary(image.public_id);
    } catch (err) {
        console.error("Cloudinary delete failed:", err);
    }
    //response
    return res.status(200).json(
        new apiResponse(
            200,
            product,
            "Image removed successfully"
        )
    );
}))

const toggleProductStatus = (asyncHandler(async (req, res) => {
    // Request
    const userId = req.user._id
    // Get productId
    const { productId } = req.params

    // Validate ObjectId
    validateObjectId(productId, "Product id")

    // Find Product (owner + productId)
    const product = await Product.findOne({
        owner: userId,
        _id: productId
    })

    // Product Exists?
    validateResourceExists(product, "Product")

    // Toggle Status
    product.isActive = !product.isActive

    // Save Product
    await product.save();

    // Return Updated Product
    return res.status(200).json(
        new apiResponse(
            200, product, "Product status updated successfully"
        )
    );
}))



// ------------------------------
//  ORDER MANAGEMENT (ADMIN)
// ------------------------------
const getAllOrders = asyncHandler(async (req, res) => {

    // TODO: fetch all orders
    const { orderId } = req.params

    await Order.findById(orderId)
        .populate("user", "username email")
        .populate("items.product", "title productImages");

    validateResourceExists(order, "Order")

    return res.status(200).json(
        new apiResponse(
            200, order, "all Orders fetched successfully"
        )
    )
});
const getOrderById = asyncHandler(async (req, res) => {

    // const userId = req.user._id

    const { orderId } = req.params

    validateObjectId(orderId, "Order id")

    const order = await Order.findOne({
        // user: userId,
        _id: orderId
    })

    validateResourceExists(order, "Order")

    return res.status(200).json(
        new apiResponse(200, order, "order fetched by order Id successfully")
    )
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    // TODO: pending → processing → shipped → delivered

    //get orderId
    const { orderId } = req.params

    validateObjectId(orderId, "Order id")

    const { orderStatus } = req.body

    const allowedStatus = [
        "confirmed",
        "shipped",
        "delivered"
    ]
    if (!allowedStatus.includes(orderStatus)) {
        throw new apiError(400, 'Invalid order status')
    }

    const order = await Order.findOne({
        _id: orderId
    })
    validateResourceExists(order, "Order")

    if (order.orderStatus === 'cancelled') {
        throw new apiError(400, 'order already cancelled')
    }
    if (order.orderStatus === 'delivered') {
        throw new apiError(400, 'order already delivered')
    }


    const validTransition = {
        pending: "confirmed",
        confirmed: "shipped",
        shipped: "delivered"
    }
    //check if requested status is th next valid status
    if (validTransition[order.orderStatus] !== orderStatus) {
        throw new apiError(400, `Order can only move from ${order.orderStatus} to ${validTransition[order.orderStatus]}`)
    }

    order.orderStatus = orderStatus;
    if (order.orderStatus === "delivered") {
        order.deliveredAt = new Date();
    }
    await order.save();

    return res.status(200).json(new apiResponse(
        200, order, "order status update successfully"
    ))

});

//in real ecommerce-stores it is not preferred to delete order instead i did this cancelOrder()
const softDeleteOrder = asyncHandler(async (req, res) => {
    // TODO: cancel/remove order
    //get orderId
    const { orderId } = req.params

    validateObjectId(orderId, "order Id")
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //find Order
        const order = await Order.findOne({
            _id: orderId
        }).session(session)

        validateResourceExists(order, "Order")
        //validations
        if (order.orderStatus === 'delivered') {
            throw new apiError(400, "Order already delivered")
        }
        if (order.orderStatus === 'cancelled') {
            throw new apiError(400, "Order already cancelled")
        }
        order.orderStatus = "cancelled"
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            ).session(session)
        }
        await order.save({ session });

        await session.commitTransaction();

        return res.status(200).json(
            new apiResponse(
                200, order, "Order cancelled successfully"
            )
        )

    } catch (error) {

        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
});


const addTrackingNumber = asyncHandler(async (req, res) => {

    const { orderId } = req.params;
    validateObjectId(orderId, "Order id")
    const { trackingNumber } = req.body;

    if (!trackingNumber?.trim()) {
        throw new apiError(400, "Tracking number is required");
    }

    // Find order
    const order = await Order.findOne({
        _id: orderId
    })
    validateResourceExists(order, "Order")

    const cleanTrackingNumber = trackingNumber.trim();

    const existing = await Order.findOne({
        trackingNumber: cleanTrackingNumber
    });

    if (existing) {
        throw new apiError(409, "Tracking number already exists");
    }


    if (order.orderStatus === "cancelled") {
        throw new apiError(400, "Cannot add tracking number to cancelled order");
    }
    if (order.orderStatus === "delivered") {
        throw new apiError(400, "Order already delivered");
    }
    if (order.orderStatus !== "confirmed") {
        throw new apiError(400, "Tracking number can only be added to confirmed orders");
    }
    if (order.trackingNumber) {
        throw new apiError(400, "Tracking number already assigned");
    }

    // Save tracking number
    order.trackingNumber = cleanTrackingNumber;

    await order.save();
    return res.status(200).json(
        new apiResponse(
            200, order, "Tracking number added successfully"
        )
    );
});


// ------------------------------
//  REVIEW (ADMIN)
// ------------------------------
const deleteReview = asyncHandler(async (req, res) => {
    // Request

    // Get reviewId
    const { reviewId } = req.params

    // Validate ObjectId
    validateObjectId(reviewId, "Review Id")

    const session = await mongoose.startSession();
    try {
        await session.startTransaction();


        // Find Review
        const review = await Review.findOne({
            _id: reviewId
        }).session(session);

        // Review Exists ?
        validateResourceExists(review, "Review")

        // (Optional) Find Product
        const product = await Product.findById(review.product);

        validateResourceExists(product, "Product");



        //delete review and update product averageRating and numReviews
        await review.deleteOne({ session });

        const stats = await Review.aggregate([
            {
                $match: {
                    product: product._id,
                    isApproved: true

                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    },
                    numReviews: {
                        $sum: 1
                    }
                }
            }
        ]).session(session);

        product.averageRating = stats[0]?.averageRating || 0;

        product.numReviews = stats[0]?.numReviews || 0;


        await product.save({ session });

        await session.commitTransaction();


        // Return Success
        return res.status(200).json(
            new apiResponse(
                200, review, "Review deleted successfully"
            )
        )

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
})

const toggleReviewApproval = asyncHandler(async (req, res) => {
    // Request
    // Get reviewId

    const { reviewId } = req.params
    // Validate ObjectId
    validateObjectId(reviewId, "Review Id")

    const session = await mongoose.startSession();
    try {

        await session.startTransaction();
        // Find Review
        const review = await Review.findById(reviewId).session(session);


        // Exists?
        validateResourceExists(review, "Review")

        // review.isApproved = !review.isApproved
        review.isApproved = !review.isApproved

        // Save
        await review.save({ session });

        const product = await Product.findById(review.product).session(session);

        validateResourceExists(product, "Product");
        // update product averageRating and numReviews

        const stats = await Review.aggregate([
            {
                $match: {
                    product: product._id,
                    isApproved: true
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    },
                    numReviews: {
                        $sum: 1
                    }
                }
            }
        ]).session(session);

        product.averageRating = stats[0]?.averageRating || 0;
        product.numReviews = stats[0]?.numReviews || 0;


        await product.save({ session });
        await session.commitTransaction();


        // Return Response
        return res.status(200).json(
            new apiResponse(
                200, review, "Review approval status toggled successfully"
            )
        )
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
})


// ------------------------------
//  category (ADMIN)
// ------------------------------
const createCategory = (asyncHandler(async (req, res) => {

}))
const updateCategory = (asyncHandler(async (req, res) => {

}))
const deleteCategory = (asyncHandler(async (req, res) => {

}))
const toggleCategoryStatus = (asyncHandler(async (req, res) => {

}))


// ------------------------------
//  PAYMENT (ADMIN)
// ------------------------------
const getAllPayments = (asyncHandler(async (req, res) => {

}))

const getPaymentById = (asyncHandler(async (req, res) => {

}))

const updatePaymentStatus = (asyncHandler(async (req, res) => {

}))
const refundPayment = (asyncHandler(async (req, res) => {

}))


// ------------------------------
//  DASHBOARD (ADMIN)
// ------------------------------
// {
//   "users": 250,
//   "products": 120,
//   "orders": 480,
//   "payments": 450,
//   "revenue": 1850000,
//   "pendingOrders": 14,
//   "lowStockProducts": 8,
//   "recentOrders": [...]
// }
const getAdminStats = asyncHandler(async (req, res) => {
    // dashboard data
    // TODO:
    // total users
    // total orders
    // total revenue
    // total products
});


export {
    //user Management
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    blockUser,
    unblockUser,

    //Product Management
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    updateProductImages,
    getAllProductsAdmin,

    //order Management
    getAllOrders,
    updateOrderStatus,
    softDeleteOrder,
    addTrackingNumber,
    getOrderById,

    //review Management
    toggleReviewApproval,
    deleteReview,

    //category Management
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,

    //payment Management
    getAllPayments,
    getPaymentById,
    updatePaymentStatus,
    refundPayment,

    //Dashboard
    getAdminStats,

    //total 26 admin controller
};