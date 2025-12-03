import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


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
            (field) => !field || field?.trim() === "" //if field exist then trim it and check
            //if it is not empty
        )
    ) {
        throw new ApiError(400, "all fields are required");
    }

    //3
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }
    console.log(req.files)

    //4
    //.files is feature provided by multer
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;


    //5
    //agar avatar field nahi he
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }


    //we uploaded avatar & coverimage in db before creating user because we need avatar & coverimage url in order to register user in db
    const avatar = await uploadOnCloudinary(avatarLocalPath)//it is asynchronous operation
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //firse check karo avatar thik se gaya he ki nahi
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    //6.now create one object and make its entry in database

    const user = await User.create({
        fullname,
        avatar: avatar.url, //pura avatar na leke sirf uski url liyi he
        coverImage: coverImage?.url || "",//if image is there then url or empty 
        email,
        password,
        username: username.toLowerCase(),


    })

    //7.check if user is created 
    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        //- means we dont need them
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    //8.now return response

    //return res.status(201).json({createdUser})
    //we can also write like this but as we creted structured way for
    //giving response in ApiResponse.js so will use it
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )




})

//todo:
////user login
const generateAccessAndRefreshToken = async (userId) => {
    try {

        // Finds user by ID
        // Creates access token
        // Creates refresh token
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken();


        // Line 1: Save the new refresh token into the user's DB record.
        // Line 2: Save the user without running validations again.
        // Why disable validation?
        // Because during login, you only update refreshToken, not other fields.


        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        //return both tokens
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500,
            "something went wrong while generating access and refresh token")
    }
}


const loginUser = asyncHandler(async (req, res) => {

    const { email, password, username } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "email or username is required")
    }

    const user = await User.findOne(
        { $or: [{ username }, { email }] }
    )
    if (!user) {
        throw new ApiError(400, "user does not exist")
    }


    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)



    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    //our cookies can be modified easily at frontend
    //so we use httponly and secure true so it can only be 
    //modified by server

    return res.status(200).cookie(
        "accessToken",
        accessToken,
        options).cookie(
            "refreshToken",
            refreshToken,
            options).json(
                new ApiResponse(
                    //status code
                    200,
                    //data
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    //msg
                    "user logged in successfully"
                )
            )
})//so here we complete login but havent yet implemented route

//logout 
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            //It removes the user’s refreshToken from the database
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }//without new:true mongodb will gives old user
    )

    const options = {
        httpOnly: true,//JavaScript on frontend CANNOT access this cookie
        secure: true//Cookie will only be sent over HTTPS
    }
    return res.status(200).clearCookie("accessToken", options)
        .clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged Out"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }


    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
            new ApiResponse(200, { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            )
        )


    } catch (error) {
      throw new ApiError(401,error?.message||"Invalid refresh token")
    }


})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

}