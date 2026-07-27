import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js'


const app = express();

app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true
}))


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
import wishlist from './routes/wishlist.routes.js'

//ROUTES SETUP
app.use("/api/v1/users", userRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/order", orderRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/review", reviewRouter)
app.use("/api/v1/wishlist", wishlist)

//http://localhost:5000/api/v1/users/register

app.get('/', (req, res) => {
    res.send("Hello World!")
})

export { app }