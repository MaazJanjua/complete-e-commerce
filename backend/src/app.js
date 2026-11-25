import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js'


const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://complete-e-commerce-iota.vercel.app",
    config.CORS_ORIGIN,
    process.env.CORS_ORIGIN,
]
    .filter(Boolean)
    .map((url) => url.replace(/\/$/, "")); // Trailing slash remove karega

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
                callback(null, true);
            } else {
                callback(new Error(`CORS blocked for origin: ${origin}`));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);



app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes imports
import userRouter from './routes/user.routes.js'
import cartRouter from './routes/cart.routes.js'
import categoryRouter from './routes/category.routes.js'
import orderRouter from './routes/order.routes.js'
import paymentRouter from './routes/payment.routes.js'
import productRouter from './routes/product.routes.js'
import reviewRouter from './routes/review.routes.js'
import adminRouter from './routes/admin.routes.js'
import wishlist from './routes/wishlist.routes.js'
import wishlistRouter from "./routes/wishlist.routes.js";
// import orderRouter from "./routes/order.routes.js";

//ROUTES SETUP
app.use("/api/v1/users", userRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/review", reviewRouter)
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/wishlist", wishlist)
app.use("/api/v1/wishlist", wishlistRouter);
// app.use("/api/v1/orders", orderRouter);

//http://localhost:5000/api/v1/users/register

app.get('/', (req, res) => {
    res.send("Hello World!")
})

export { app }