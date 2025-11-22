 
//using async await:
// const asyncHandler=(fn)=>async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code||500).json({
//             success:false,
//             message:error.message
//         })
        
//     }
// }


//using promises:
const asyncHandler=(fn)=>(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch((error)=>{
        next(error)
    })

    //why we not return promise inside curly braces here as we know we have to
    //return something in curly braces

    // Express does not require middleware to return a 
    // Promise or any value — it only cares that you call res.* 
    // or next() (so the code works and errors are passed to next).
}

export {asyncHandler}