import mongoose from "mongoose";;
import { DB_NAME } from "../constants.js";

console.log('DB_NAME: ', DB_NAME);
console.log('process.env.MONGODB_URL =>', process.env.MONGODB_URL)
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connnection Failed", error);
        process.exit(1);
    }
}

export default connectDB;