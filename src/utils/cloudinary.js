import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load .env from backend root
dotenv.config({ path: "../../.env" });


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
            console.error("Upload failed:", error);
    fs.unlinkSync(localFilePath); // comment out to see file still exists
    return null;

    }
}



export {uploadOnCloudinary}


// test if it is uploading on cloudinary

// const testUpload = async () => {
//   const filePath = "./abc.mp4";
//   console.log("Checking if file exists:", fs.existsSync(filePath));
//   const result = await uploadOnCloudinary(filePath);
// };

// testUpload();


// [Frontend: selects file]
//            ↓
// POST /upload (multipart/form-data)
//            ↓
// [Multer: parses & saves file temporarily]
//            ↓
// [Backend: calls Cloudinary upload]
//            ↓
// [Cloudinary: uploads & returns URL]
//            ↓
// [Backend: deletes temp file]
//            ↓
// [Frontend: receives Cloudinary URL & shows image]


