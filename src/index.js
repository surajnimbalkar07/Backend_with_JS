
import { connectDB } from "./db/index.js";
import dotenv, { config } from "dotenv"
import express from "express"

const app=express()
dotenv.config({path:"./env"})

//imported connection here


connectDB().then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`app is listening to ${process.env.PORT}`);
    })

/*connectDB() is ASYNC so connectDB() returns a Promise. so .then and .catch is imp:

What does .then() do?:
.then() runs only when the Promise is successful.

Meaning:

MongoDB connection success → .then() runs

MongoDB connection fail → .catch() runs

Why start(listen) server inside .then()?

Because you MUST start the server only after the database connects.

✔ If DB is connected → Start server
✘ If DB fails → Don’t start server

Otherwise your app will run without DB and give errors.
*/

}).catch((error)=>{
  console.log("database connection error: ",error);
  
})

// Global error handler for express server
app.on("error", (error) => {
  console.log("Server error:", error);
});


// import express from "express"

// const app=express()

// (async()=>{

//     try{
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error",(error)=>{
//         console.log("error:",error);
//         throw error
        
//        })

//        app.listen(process.env.PORT,()=>{
//           console.log(`app is listening to ${process.env.PORT}`);
          
//        })
//     }
//     catch(error){
//         console.log("error:",error)
//         throw error
//     }
// })()