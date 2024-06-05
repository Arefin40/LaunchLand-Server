import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectToDB = () => {
   return mongoose.connect(process.env.MONGO_DB_URI, {
      dbName: process.env.DB_NAME,
   });
};
