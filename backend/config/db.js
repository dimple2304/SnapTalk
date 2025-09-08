import mongoose from "mongoose";
import { DB_CONNECTION_STRING } from "./envIndex.js";

const connectDB = async () => {
    try{
        await mongoose.connect(DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongodb connected");    
    } catch (err) {
        console.error(err.message)
        process.exit(1);
    }
}

export default connectDB;