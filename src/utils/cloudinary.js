import { v2 as cloudinary } from cloudinary
import fs from "fs" //file system in node js, help to perform operation on files


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Upload an image

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: auto
        })
         /* The option `resource_type: auto` means:
         ✔ Cloudinary will automatically detect the type of file  
         (image, video, pdf, etc.)*/

        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath);
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file
        //  as the upload operation got failed
        return null
    }
} 

export {uploadOnCloudinary}