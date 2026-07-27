import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { config } from '../config/config.js'

import { apiError } from './apiError.js';

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (LocalFilePath) => {
    try {
        if (!LocalFilePath) {
            throw new apiError("localFilePath is required for uploading to Cloudinary");
        }
        const response = await cloudinary.uploader.upload(
            LocalFilePath,
            {
                resource_type: "auto"
            }
        );

        fs.unlinkSync(LocalFilePath); //remove the locally saved file as it has been uploaded successfully

        //if file hass been uploaded successfully
        console.log("File uploaded successfully to Cloudinary", response.url);

        return response
    } catch (error) {
        console.error("Eror uploading file to Cloudinary", error);
        response.secure_url
        if (LocalFilePath && fs.existsSync(LocalFilePath)) {
            fs.unlinkSync(LocalFilePath)
        }
        throw error;
    }
}

const deleteFromCloudinary = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId)
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}  