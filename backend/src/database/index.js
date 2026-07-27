import mongoose from "mongoose";
import { config } from "../config/config.js";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(config.MONGO_URI);
        console.log("mongoDB connected successfully✔️");
    } catch (error) {
        console.error('MongoDB connection FAILD⚔️', error.message)
        throw error;
    }
}
export { connectDB } 
