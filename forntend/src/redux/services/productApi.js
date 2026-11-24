// frontend/src/redux/services/productApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL, //Express Server Port
        credentials: "include", // For cross-origin cookie session support 

        // 1. UPDATE: Authorization Header Injection for Admin/User Requests
        prepareHeaders: (headers) => { 
            const token = localStorage.getItem("token");
            if (token) {
                // Fixed: Lowercase headers.set
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),

    // 2. UPDATED: Tag Types defined for Cache Invalidation
    tagTypes: ['Product', 'Category', 'Cart', 'Wishlist', 'Order'],

    endpoints: (builder) => ({
        // Fetch all categories
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Category']
        }),

        // Fetch all products
        getProducts: builder.query({
            query: (params) => ({
                url: "/product",
                params
            }),
            providesTags: (result) =>
                result?.data?.products
                    ? [
                        ...result.data.products.map(({ _id }) => ({ type: "Product", id: _id })),
                        { type: "Product", id: "LIST" },
                    ]
                    : [{ type: "Product", id: "LIST" }],
        }),

        // Fetch a single product detail by ID
        getProductById: builder.query({
            query: (slugOrId) => `/product/${slugOrId}`,
            providesTags: (result, error, arg) => [{ type: 'Product', id: arg }],
        }),

        // 3. Create Product Mutation Endpoint
        createProduct: builder.mutation({
            query: (newProductFormData) => ({
                url: "/product",
                method: "POST",
                body: newProductFormData,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `/product/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Product", id: "LIST" }]
        }),

        updateProduct: builder.mutation({
            query: ({ productId, updatedData }) => ({
                url: `/product/${productId}`,
                method: "PATCH",
                body: updatedData,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),



        getAdminStats: builder.query({
            query: () => '/admin/stats',
            providesTags: ['Product', 'Category'],
        }),



        // Cart, Wishlist & Order Endpoints (add inside productApi endpoints)
        getCart: builder.query({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: ({ productId, quantity = 1 }) => ({
                url: `/cart/add/${productId}`,
                method: 'POST',
                body: { quantity },
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCartQuantity: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: `/cart/${productId}`,
                method: 'POST', // Matches your router.route('/:productId').post(updateCartItemQuantity)
                body: { quantity },
            }),
            invalidatesTags: ['Cart'],
        }),
        removeCartItem: builder.mutation({
            query: (productId) => ({
                url: `/cart/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),

        // Wishlist
        getWishlist: builder.query({
            query: () => '/wishlist',
            providesTags: ['Wishlist'],
        }),
        addToWishlist: builder.mutation({
            query: (productId) => ({
                url: `/wishlist/${productId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Wishlist'],
        }),
        removeFromWishlist: builder.mutation({
            query: (productId) => ({
                url: `/wishlist/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Wishlist'],
        }),

        // Orders & COD Payment
        createOrder: builder.mutation({
            query: (shippingAddress) => ({
                url: '/orders',
                method: 'POST',
                body: { shippingAddress },
            }),
            invalidatesTags: ['Cart', 'Order', 'Product'],
        }),
        createCodPayment: builder.mutation({
            query: (orderId) => ({
                url: '/payments', // Apne payment.routes.js ke exact path ke mutabiq check karein
                method: 'POST',
                body: { orderId, paymentMethod: 'COD' },
            }),
            invalidatesTags: ['Order'],
        }),
        getUserOrders: builder.query({
            query: () => '/orders/user-orders',
            providesTags: ['Order'],
        }),
        getOrderById: builder.query({
            query: (orderId) => `/orders/${orderId}`,
            providesTags: ['Order'],
        }),
        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `/orders/${orderId}/cancel`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order', 'Product'],
        }),


        // Admin Order Management Endpoints
        getAllAdminOrders: builder.query({
            query: () => '/orders/admin/all-orders',
            providesTags: ['Order'],
        }),
        updateAdminOrderStatus: builder.mutation({
            query: ({ orderId, orderStatus }) => ({
                url: `/orders/admin/${orderId}/status`,
                method: 'POST',
                body: { orderStatus },
            }),
            invalidatesTags: ['Order', 'Product'],
        }),
        addAdminOrderTracking: builder.mutation({
            query: ({ orderId, trackingNumber }) => ({
                url: `/orders/admin/${orderId}/tracking`,
                method: 'POST',
                body: { trackingNumber },
            }),
            invalidatesTags: ['Order'],
        }),



        // Category Mutations (Supports FormData with Image)
        createCategory: builder.mutation({
            query: (formData) => ({
                url: '/admin/categories',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ categoryId, formData }) => ({
                url: `/admin/categories/${categoryId}`,
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['Category'],
        }),

        deleteCategory: builder.mutation({
            query: (categoryId) => ({
                url: `/admin/categories/${categoryId}`, // <-- '/admin' add karein
                method: "DELETE",
            }),
            invalidatesTags: ['Category'],
        }),

    }),
});



export const {
    // Existing Product & Category & Admin Hooks
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetAdminStatsQuery,

    // Cart Hooks
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartQuantityMutation,
    useRemoveCartItemMutation,

    // Wishlist Hooks
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,

    // Order & COD Payment Hooks
    useCreateOrderMutation,
    useCreateCodPaymentMutation,
    useGetUserOrdersQuery,
    useGetOrderByIdQuery,
    useCancelOrderMutation,

    useGetAllAdminOrdersQuery,
    useUpdateAdminOrderStatusMutation,
    useAddAdminOrderTrackingMutation,

    //CATEGORY HOOKS
    // usecreateCategorymutation,
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation
} = productApi;