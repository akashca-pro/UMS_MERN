import "dotenv/config";
import mongoose from "mongoose";
const url = process.env.URL
const connectDB = async () => {
   try {
    await mongoose.connect(url)
    console.log("Database connected successfully")
   } catch (error) {
     console.log("Database is not connected",error.message)
   }

}

export default connectDB