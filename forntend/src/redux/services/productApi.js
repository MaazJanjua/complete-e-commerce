// frontend/src/redux/services/productApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/v1',// Verify Express Server Port
        credentials: "include"
    }),

    endpoints: (builder) => ({
        //Fetch all categories
        getCategories : builder.query({
            query: () => '/categories'
        }),
        //Fetch all products with original filters
        getProducts: builder.query({
            query: (params) => ({
                url: "/product",
                params
            })
        }),
        //Fetch a single product detail by ID
        getProductById: builder.query({
            query: (id) => `/product/${id}`,
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetProductsQuery,
    useGetProductByIdQuery
} = productApi