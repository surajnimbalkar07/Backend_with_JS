import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"

export const app=express()
dotenv.config({path:"./env"})
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))


app.use(express.json({limit:"16kb"}))//inner argument is used only if needed
app.use(express.urlencoded({extended:true}))
//data jab bhi url me aata he to problem ho jata he so we use urlencoded to read data
//express.urlencoded() is used only to read data sent from HTML <form> submits.mtlb form se jo bhi data jata he url encoded format me jata he aur express use read nahi kr pata
//use read krne ke liye express urlencoded ka use krta he
//ex:  username=suraj&password=1234
// This is called URL-encoded data, and Express needs express.urlencoded() to read it.
//Without it → req.body will be empty

// extended: false	supports only simple values (strings, numbers)
// extended: true	supports nested objects & arrays
app.use(cookieParser())
app.use(express.static("public"))

//routes import

import userRouter from './routes/user.routes.js'

//route declaration
app.use("/api/v1/users",userRouter)