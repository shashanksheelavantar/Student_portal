import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        const connectionString = await mongoose.connect(`${process.env.MONGDB_URI}${DB_NAME}`)
        console.log(`DB Connected: ${connectionString.connection.host}`);
    } catch (error) {
        console.log(`DB Conection Error: ${error.message}`);
        process.exit(1)
    }
}

export default connectDB;