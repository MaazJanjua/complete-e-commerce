// forntend/src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { productApi } from "./services/productApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(productApi.middleware)
})