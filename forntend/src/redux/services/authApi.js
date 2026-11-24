// forntend/src/redux/services/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL, // Verify port 5000 is matching your Express server
        credentials: 'include', // Handles HTTP-Only cookies for JWT
    }),
    tagTypes: ['User'],

    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => '/users/get-user-detail',
            providesTags: ['User'],
        }),

        registerUser: builder.mutation({
            query: (userData) => ({
                url: '/users/register',
                method: 'POST',
                body: userData,
            }),
        }),

        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/users/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'], // Automatically refreshes getCurrentUser on login
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: '/users/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'], // Automatically refreshes getCurrentUser on logout
        }),

        updateProfile: builder.mutation({
            query: (updateData) => ({
                url: '/users/update-account-detail',
                method: 'PATCH',
                body: updateData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetCurrentUserQuery,
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useUpdateProfileMutation,
} = authApi;