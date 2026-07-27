import jwt from "jsonwebtoken";
import { config } from '../config/config.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js';
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import {
    validateResourceExists
} from '../utils/validators/galobalValidator.js'

const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'strict',
    // maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        validateResourceExists(user, "User");

        const accessToken = user.generateAccessToken();

        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {

        console.error(error);
        throw new apiError(500, 'Something Went Wrong While generating access and refresh token')

    }
}


const registerUser = (asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body

    let fields = [fullName, username, email, password]

    if (fields.some((field) => !field?.trim())) {
        throw new apiError(400, 'all fields are required for register')
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    const existedUser = await User.findOne({
        $or: [
            { username: normalizedUsername },
            { email: normalizedEmail }
        ]
    })

    if (existedUser) {
        throw new apiError(409, 'user already exist with this email/username')
    }

    const user = await User.create({
        fullName: fullName.trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        password
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new apiError(500, 'user not created/something went wrong')
    }
    return res.status(201).json(new apiResponse(201, createdUser, 'user Created successfully'))

}))

const loginUser = (asyncHandler(async (req, res) => {
    //get Data from forntend 
    const { email, password } = req.body
    //validate fields
    let fields = [email, password]
    if (fields.some((field) => !field?.trim())) {
        throw new apiError(400, 'all fields are required for login')
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });


    //validate user exist
    validateResourceExists(user, "User")
    //Password Verification
    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new apiError(401, 'password is incorrect')
    }

    //Destructuring / generate RefreshToken & accessToken
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookiesOptions)
        .cookie("refreshToken", refreshToken, cookiesOptions)
        .json(
            new apiResponse(200, {
                user: loggedinUser,
                accessToken
            },
                'Login successful.')
        )
}))

const logoutUser = (asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    )
    return res
        .status(200)
        .clearCookie("accessToken", cookiesOptions)
        .clearCookie("refreshToken", cookiesOptions)
        .json(
            new apiResponse(
                200, {}, "User loggedOut Successfully"
            )
        )
}))

const refreshAccessToken = (asyncHandler(async (req, res) => {

    const incomingRefreshToken =
     req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, 'unauthorized request')
    }

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            config.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        //invalid refreshToken
        validateResourceExists(user, "User")

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, 'refreshToken is expired or expired')
        }

        const { accessToken, refreshToken } =
         await generateAccessAndRefreshToken(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, cookiesOptions)
            .cookie("refreshToken", refreshToken, cookiesOptions)
            .json(new apiResponse(200, {
                accessToken
            },
                'AccessToken refreshed Successfully'
            ))

    } catch (error) {
        throw new apiError(401, error?.message || "invalid refreshToken")
    }
}))

const changePassword = (asyncHandler(async (req, res) => {

    const { newPassword, confirmPassword, oldPassword } = req.body

    if (newPassword !== confirmPassword) {
        throw new apiError(400, 'newPassword and confirmPassword should be equal')
    }

    if (oldPassword === newPassword) {
        throw new apiError(400, 'New password must be different')
    }
    const user = await User.findById(
        req.user._id
    )

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new apiError(401, 'Invalid old password')
    }

    user.password = newPassword

    // await user.save({ validateBeforeSave: false })
    await user.save();
    return res
        .status(200)
        .json(new apiResponse(200, {}, "Password Changed Successfully"))
}))

const getUserDetail = (asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select("-password -refreshToken")

    validateResourceExists(user, 'User')

    return res.status(200).json(new apiResponse(200, user, 'fetched user detail successfully'))
}))

const updateAccountDetail = (asyncHandler(async (req, res) => {

    const { fullName, email } = req.body

    if (!fullName && !email) {
        throw new apiError(400, 'at least one field is required')
    }

    //Build Update Opject
    const updateData = {}
    if (fullName?.trim()) {
        updateData.fullName = fullName.trim()
    }

    if (email?.trim()) {
        const normalizedEmail = email.trim().toLowerCase();

        //check if email is already used bt another user
        const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: req.user._id }
        })
        if (existingUser) {
            throw new apiError(409, 'email is already in use')
        }
        updateData.email = normalizedEmail;
    }


    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateData
        }, {
        new: true,
        runValidators: true
    }
    ).select('-password')

    validateResourceExists(updatedUser, "User")

    return res
        .status(200)
        .json(new apiResponse(200, updatedUser, 'Account Detailed Fetched Successfully'))
}))


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getUserDetail,
    updateAccountDetail
}
