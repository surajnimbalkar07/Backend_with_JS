import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation=not empty
    //check if user already exists by username,email
    //check for images,
    //check for avtar
    //if available upload to cloudinary,avatar check on it
    //create user object-create entry in db
    //remove password and refresh token field from response
    //check for user creation and then return response

    // res.status(200).json({
    //     message: "ok",
    // })

    //1.get field from body
    const { fullname, email, username, password } = req.body
    console.log("email:", email);

    //2.do validation to check if fields are not empty
    if (
        [fullname, email, username, password].some(
            (field) => field?.trim() === "" //if field exist then trim it and check
            //if it is not empty
        )
    ) {
        throw new ApiError(400, "all fields are required");
    }
   
    //3
   const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }
     console.log(req.files)
    
    //4
    //.files is feature provided by multer
   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage?.[0]?.path;
   
    
    //5
    //agar avatar field nahi he
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    

    //we uploaded avatar & coverimage in db before creating user because we need avatar & coverimage url in order to register user in db
    const avatar=await uploadOnCloudinary(avatarLocalPath)//it is asynchronous operation
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    //firse check karo avatar thik se gaya he ki nahi
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    //6.now create one object and make its entry in database

   const user=await User.create({
        fullname,
        avatar:avatar.url, //pura avatar na leke sirf uski url liyi he
        coverImage:coverImage?.url||"",//if image is there then url or empty 
        email,
        password,
        username:username.toLowerCase(),


    })
   
    //7.check if user is created 
    //remove password and refresh token field from response
    const createdUser=await User.findById(user._id).select(
        //- means we dont need them
        "-password -refreshToken"
    )
     if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
     }

     //8.now return response
     
    //return res.status(201).json({createdUser})
    //we can also write like this but as we creted structured way for
    //giving response in ApiResponse.js so will use it
     return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
     )

      


})

export { registerUser }