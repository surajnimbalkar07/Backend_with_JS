import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//1. Handling database errors (try-catch)
// Sometimes data is missing or the database fails.
// So we must wrap database code inside try–catch.
// Key point: “Database can fail anytime → always use try–catch.”

// 2. Use async/await for database queries
// Database is slow because it's running on another server.
// Normal code will block and wait, which is bad.
// Using async/await lets the program continue without blocking.
// Key point: “Database is far → always use async/await.”

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB