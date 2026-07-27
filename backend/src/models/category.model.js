import mongoose, { Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    images: [
        {
            url: String,
            public_id: String
        }
    ],
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Category = mongoose.model("Category", categorySchema)
export { Category }