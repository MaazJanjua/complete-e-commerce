import { config } from "dotenv";
import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "fullName id required"],
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: [true, "username id required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "email id required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password id required"]
    },
    avatar: {
        url: String,
        public_id: String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    phoneNumber: {
        type: String
    },

    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date,
        default: null
    }


}, { timestamps: true })

userSchema.pre("save", async function () {
    if (!this.isModefied("password")) return;

    this.password = await bcrypt.hast(this.password, 10)
})
//costum method
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccesstoken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    }, config.ACCESS_TOKEN_SECRET,
        { expiresIn: config.ACCESS_TOKEN_EXPIRY })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, config.REFRESH_TOKEN_SECRET,
        {
            expiresIn: config.REFRESH_TOKEN_EXPIRY
        })
}

const User = mongoose.model("User", userSchema)
export {
    User
}