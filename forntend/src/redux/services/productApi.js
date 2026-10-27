// // frontend/src/redux/services/productApi.js
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const productApi = createApi({
//     reducerPath: "productApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: 'http://localhost:5000/api/v1',// Verify Express Server Port
//         credentials: "include",// For cross-origin cookie session support 

//         //1.UPDATE:Authorization Header Injection for Admin/User Requests
//         prepareHeaders: (headers) => {
//             const token = localStorage.getItem("token");
//             if (token) {
//                 Headers.set("authorization", `Bearer ${token}`);
//             }
//             // IMPORTANT: Never manually set Content-Type for FormData!
//             return headers;
//         }
//     }),

//     //2: UPDATED : Tag Types defined for RTK Query Cache Invalidation & Auto Refetching 
//     tagTypes: ['Product', ' Category'],

//     endpoints: (builder) => ({
//         //Fetch all categories
//         getCategories: builder.query({
//             query: () => '/categories',
//             providesTags: ['Category']
//         }),
//         //Fetch all products with original filters
//         getProducts: builder.query({
//             query: (params) => ({
//                 url: "/product",
//                 params
//             }),
//             providesTags:['Product']
//         }),
//         providesTags: (result) => result ? [
//             ...result.data.products.map(({ _id }) => ({ type: "Product", id: _id })),
//         ]
//             : [{ type: "Product", id: "LIST" }],


//         //Fetch a single product detail by ID
//         getProductById: builder.query({
//             query: (id) => `/product/${id}`,
//             providesTags: (result, error, id) => [{ type: 'Product', id }],
//         }),

//         // 3. UPDATED: Create Product Mutation Endpoint Added
//         createProduct: builder.mutation({
//             query: (newProductFormData) => ({
//                 url: "/product", // Matches Express router POST route (/api/v1/product)
//                 method: "POST",
//                 body: newProductFormData,
//             }),
//             // Invalidates 'LIST' cache so getProducts automatically refetches new items on Home/Storefront
//             invalidatesTags: [{ type: 'Product', id: 'LIST' }],
//         }),

//     }),
// });

// export const {
//     useGetCategoriesQuery,
//     useGetProductsQuery,
//     useGetProductByIdQuery,
//     useCreateProductMutation, // <-- Added for Create Product Form
// } = productApi


// frontend/src/redux/services/productApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/v1', // Verify Express Server Port
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
    tagTypes: ['Product', 'Category'],

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
            query: (id) => `/product/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
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
    }),
});

export const {
    useGetCategoriesQuery,
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
} = productApi;